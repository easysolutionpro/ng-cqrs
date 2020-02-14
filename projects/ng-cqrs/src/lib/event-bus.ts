import { Injectable, NgModuleRef, NgZone, Type } from '@angular/core';
import 'reflect-metadata';
import { Observable, Subject, Subscription } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { NgCommandBus } from './command-bus';
import { EVENTS_HANDLER_METADATA, SAGA_METADATA } from './decorators/constants';
import { InvalidSagaException } from './exceptions';
import { DefaultPubSub } from './helpers/default-pubsub';
import { INgEvent, INgEventBus, INgEventHandler, INgEventPublisher, INgSaga } from './interfaces';
import { ofType } from './operators/of-type';
import { BootstrapperService } from './services/bootstrapper.service';
import { NgLogger } from './services/logger.service';
import { ObservableBus } from './utils';

export type EventHandlerType = Type<INgEventHandler<INgEvent>>;

@Injectable()
export class NgEventBus extends ObservableBus<INgEvent> implements INgEventBus
{
    private _publisher: INgEventPublisher;
    private readonly subscriptions: Subscription[] = [];
    protected subject$                             = new Subject<any>();

    constructor(
        private readonly moduleRef: NgModuleRef<any>,
        private readonly commandBus: NgCommandBus,
        private readonly zone: NgZone,
        private readonly logger: NgLogger,
        private readonly bootstrapper: BootstrapperService
    )
    {
        super();
        this.useDefaultPublisher();
    }

    get listenAll(): Observable<INgEvent>
    {
        return this.subject$.pipe(share());
    }

    get publisher(): INgEventPublisher
    {
        return this._publisher;
    }

    set publisher(_publisher: INgEventPublisher)
    {
        this._publisher = _publisher;
    }

    ofType<TInput extends INgEvent, TOutput extends INgEvent>(
        ...types: Type<TOutput>[]
    ): Observable<TOutput>
    {
        return this.subject$.pipe(ofType(...types), share());
    }

    onModuleDestroy(): void
    {
        this.zone.runOutsideAngular(() =>
        {
            this.subscriptions.forEach(subscription => subscription.unsubscribe());
        });
    }

    publishByName<T extends INgEvent>(event: T, name: string)
    {
        this.zone.runOutsideAngular(() =>
        {
            const instance = Object.create({ constructor: { name } });
            event          = Object.assign(instance, event || {});
            this.publish(event);
        });
    }

    publish<T extends INgEvent>(event: T)
    {
        this.zone.runOutsideAngular(() =>
        {
            try
            {
                this.bootstrapper.safelyRun(() =>
                    this._publisher.publish(event)
                );
            }
            catch (e)
            {
                this.logger.error(e);
            }
        });
    }

    publishAll(events: INgEvent[])
    {
        try
        {
            (events || []).forEach(event => this.publish(event));
        }
        catch (e)
        {
            this.logger.error(e);
        }
    }

    bind(handler: INgEventHandler<INgEvent>, name: string)
    {
        this.zone.runOutsideAngular(() =>
        {
            try
            {
                const stream$      = name ? this.ofEventName(name) : this.subject$;
                const subscription = stream$.subscribe(event =>
                {
                    return handler.handle(event);
                });
                this.subscriptions.push(subscription);
            }
            catch (e)
            {
                this.logger.error(e);
            }
        });
    }

    registerSagas(types: Type<any>[] = [])
    {
        this.zone.runOutsideAngular(() =>
        {
            const sagas = types
                .map(target =>
                {
                    const metadata = Reflect.getMetadata(SAGA_METADATA, target) || [];
                    const instance = this.moduleRef.injector.get(target);
                    if (!instance)
                    {
                        throw new InvalidSagaException();
                    }
                    return metadata.map((key: string) => instance[key]);
                })
                .reduce((a, b) => a.concat(b), []);

            sagas.forEach(saga => this.registerSaga(saga));
        });
    }

    register(handlers: EventHandlerType[] = [])
    {
        handlers.forEach(handler => this.registerHandler(handler));
    }

    protected registerHandler(handler: EventHandlerType)
    {
        this.zone.runOutsideAngular(() =>
        {
            const instance = this.moduleRef.injector.get(handler);
            if (!instance)
            {
                return;
            }
            const eventsNames = this.reflectEventsNames(handler);
            eventsNames.map(event =>
                this.bind(instance as INgEventHandler<INgEvent>, event.name),
            );
        });
    }

    protected ofEventName(name: string)
    {
        return this.zone.runOutsideAngular(() =>
        {
            return this.subject$.pipe(
                filter(event => this.getEventName(event) === name),
            );
        });
    }

    private getEventName(event): string
    {
        const { constructor } = Object.getPrototypeOf(event);
        return constructor.name as string;
    }

    protected registerSaga(saga: INgSaga)
    {
        if (typeof saga !== 'function')
        {
            throw new InvalidSagaException();
        }
        this.zone.runOutsideAngular(() =>
        {
            const stream$ = saga(this.subject$);
            if (!(stream$ instanceof Observable))
            {
                throw new InvalidSagaException();
            }

            const subscription = stream$
                .pipe(filter(e => !!e))
                .subscribe(command =>
                {
                    this.commandBus.execute(command);
                });

            this.subscriptions.push(subscription);
        });
    }

    private reflectEventsNames(handler: EventHandlerType): FunctionConstructor[]
    {
        return Reflect.getMetadata(EVENTS_HANDLER_METADATA, handler);
    }

    private useDefaultPublisher()
    {
        this.zone.runOutsideAngular(() =>
        {
            const pubSub = new DefaultPubSub();
            pubSub.bridgeEventsTo(this.subject$);
            this._publisher = pubSub;
        });
    }
}
