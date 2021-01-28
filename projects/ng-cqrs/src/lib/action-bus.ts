import { Inject, Injectable, Type } from '@angular/core';
import 'reflect-metadata';
import { IAction, IActionBus, IActionResult, ISaga } from './interfaces';
import { getActionTypeFromInstance, ObservableBus } from './utils';
import { ActionHandlerNotFoundException, InvalidSagaException } from './exceptions';
import { Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { ofType } from './operators/of-type';
import { CqrsLoader } from './cqrs-loader';
import { SAGA_METADATA } from './decorators/constants';
import { CQRS_MODULE_LOGGING, CQRS_MODULE_SAGAS } from './tokens';
import { Logger } from './services/logger';

@Injectable()
export class ActionBus extends ObservableBus<IAction> implements IActionBus
{
    constructor(
        private readonly loader: CqrsLoader,
        private readonly logger: Logger,
        @Inject(CQRS_MODULE_SAGAS) readonly sagas: Type<any>[],
        @Inject(CQRS_MODULE_LOGGING) readonly enableLogging: boolean
    )
    {
        super();
        this.registerSagas(sagas);
    }

    async execute<T extends IAction, TResult extends IActionResult>(action: T): Promise<TResult>
    {
        await this.loader.load(action);
        if (!this.loader.hasHandler(action))
        {
            throw new ActionHandlerNotFoundException(`ActionHandler not found for command "${getActionTypeFromInstance(action)}"`);
        }
        this.subject$.next(action);
        const result = this.loader.execute(action);
        if (this.enableLogging)
        {
            const value = result instanceof Promise ? (await result) : result;
            this.logger.logAction(getActionTypeFromInstance(action), action);
            return Promise.resolve(value);
        }
        return result;
    }

    ofType<TInput extends IAction, TOutput extends IAction>(
        ...types: (Type<IAction>|string)[]
    ): Observable<IAction>
    {
        return this.subject$.pipe(ofType(...types), share());
    }

    private registerSagas(instances: Type<any>[] = []): void
    {
        const sagas = instances
            .map(instance =>
            {
                const metadata = Reflect.getMetadata(SAGA_METADATA, instance.constructor) || [];

                return metadata.map((key: string) => instance[key]);
            })
            .reduce((a, b) => a.concat(b), []);

        sagas.forEach(saga => this.registerSaga(saga));
    }

    protected registerSaga(saga: ISaga): void
    {
        if (typeof saga !== 'function')
        {
            throw new InvalidSagaException();
        }
        const stream$ = saga(this.subject$);
        if (!(stream$ instanceof Observable))
        {
            throw new InvalidSagaException();
        }

        stream$
            .pipe(filter(e => !!e))
            .subscribe((action: IAction|IAction[]) =>
            {
                if (Array.isArray(action))
                {
                    action.forEach(c => this.execute(c));
                }
                else
                {
                    this.execute(action);
                }
            });
    }
}

