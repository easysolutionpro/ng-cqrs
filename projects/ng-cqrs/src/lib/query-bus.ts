import { Injectable, NgModuleRef, NgZone, Type } from '@angular/core';
import 'reflect-metadata';
import { QUERY_HANDLER_METADATA } from './decorators/constants';
import { QueryHandlerNotFoundException } from './exceptions';
import { InvalidQueryHandlerException } from './exceptions/invalid-query-handler.exception';
import { INgQuery, INgQueryBus, INgQueryHandler, INgQueryResult } from './interfaces';
import { ObservableBus } from './utils/observable-bus';
import { NgLogger } from './services/logger.service'

export type QueryHandlerType = Type<INgQueryHandler<INgQuery, INgQueryResult>>;

@Injectable()
export class NgQueryBus extends ObservableBus<INgQuery> implements INgQueryBus
{
    private handlers = new Map<string, INgQueryHandler<INgQuery, INgQueryResult>>();

    constructor(
        private readonly moduleRef: NgModuleRef<any>,
        private readonly zone: NgZone,
        private readonly logger: NgLogger
    )
    {
        super();
    }

    execute<T extends INgQuery, TResult extends INgQueryResult>(
        query: T,
    ): Promise<TResult>
    {
        return this.zone.runOutsideAngular(() =>
        {
            const handler = this.handlers.get(this.getQueryName(query));
            if (!handler) throw new QueryHandlerNotFoundException();

            this.subject$.next(query);
            try
            {
                return handler.execute(query) as Promise<TResult>;
            }
            catch (e)
            {
                this.logger.error(e);
            }
        });
    }

    bind<T extends INgQuery, TResult>(
        handler: INgQueryHandler<T, TResult>,
        name: string,
    )
    {
        this.zone.runOutsideAngular(() => this.handlers.set(name, handler));
    }

    register(handlers: QueryHandlerType[] = [])
    {
        this.zone.runOutsideAngular(() =>
        {
            handlers.forEach(handler => this.registerHandler(handler));
        });
    }

    protected registerHandler(handler: QueryHandlerType)
    {
        this.zone.runOutsideAngular(() =>
        {
            const instance = this.moduleRef.injector.get(handler);
            if (!instance)
            {
                return;
            }
            const target = this.reflectQueryName(handler);
            if (!target)
            {
                throw new InvalidQueryHandlerException();
            }
            this.bind(instance as INgQueryHandler<INgQuery, INgQueryResult>, target.name);
        });
    }

    private getQueryName(query): string
    {
        const { constructor } = Object.getPrototypeOf(query);
        return constructor.name as string;
    }

    private reflectQueryName(handler: QueryHandlerType): FunctionConstructor
    {
        return Reflect.getMetadata(QUERY_HANDLER_METADATA, handler);
    }
}
