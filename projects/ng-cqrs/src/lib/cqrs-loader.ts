import {
    Compiler, Inject,
    Injectable,
    NgModuleFactory,
    NgModuleRef,
    Type,
} from '@angular/core';
import { CqrsRegistryType, IAction, IQuery } from './interfaces';
import { CqrsHandler } from './interfaces/handler.type';
import { getActionTypeFromInstance } from './utils';
import { CQRS_MODULE_REGISTRY } from './tokens';
import { NoopHandler } from './noop.handler';


@Injectable()
export class CqrsLoader
{
    /** Map of unregistered cqrs handlers and their respective module paths to load. */
    handlersToLoad  = new Map<string, () => Promise<any>>();
    /** Map of cqrs handlers that are in the process of being loaded and registered. */
    handlersLoading = new Map<string, Promise<void>>();
    /** Map of cqrs handlers successfully registered. */
    handlersLoaded  = new Map<string, CqrsHandler>();

    constructor(
        private moduleRef: NgModuleRef<any>,
        private compiler: Compiler,
        @Inject(CQRS_MODULE_REGISTRY) readonly registry: CqrsRegistryType[],
    )
    {
        registry.forEach(route =>
        {
            let handler = route.handler;
            if (!handler)
            {
                handler = () => Promise.resolve(NoopHandler);
            }
            this.handlersToLoad.set(getActionTypeFromInstance(route.impl), handler);
        });
    }

    hasHandler(action: IAction|IQuery): boolean
    {
        return this.handlersLoaded.has(getActionTypeFromInstance(action));
    }

    execute(action: IAction|IQuery): Promise<any>
    {
        return this.handlersLoaded.get(getActionTypeFromInstance(action)).execute(action);
    }

    load(action: IAction|IQuery): Promise<void>
    {
        const actionType = getActionTypeFromInstance(action);
        const path       = this.handlersToLoad.get(actionType);

        if (this.handlersLoading.has(actionType))
        {
            // The handler is in the process of being loaded and registered.
            return this.handlersLoading.get(actionType) as Promise<void>;
        }

        if (this.handlersToLoad.has(actionType))
        {
            const handlerLoading = (path() as Promise<NgModuleFactory<any>|Type<any>>)
                .then(elementModuleOrFactory =>
                {
                    if (elementModuleOrFactory instanceof NgModuleFactory)
                    {
                        return elementModuleOrFactory;
                    }
                    else
                    {
                        return this.compiler.compileModuleAsync(elementModuleOrFactory);
                    }
                })
                .then(moduleFactory =>
                {
                    const cqrsModuleRef = moduleFactory.create(this.moduleRef.injector);
                    return cqrsModuleRef.instance;
                })
                .then((handler: CqrsHandler) =>
                {
                    this.handlersLoaded.set(actionType, handler);
                    return Promise.resolve();
                })
                .then(() =>
                {
                    // The custom element has been successfully loaded and registered.
                    // Remove from `handlersLoading` and `handlersToLoad`.
                    this.handlersLoading.delete(actionType);
                    this.handlersToLoad.delete(actionType);
                })
                .catch(err =>
                {
                    // The handler has failed to load and register.
                    // Remove from `handlersLoading`.
                    // (Do not remove from `handlersToLoad` in case it was a temporary error.)
                    this.handlersLoading.delete(actionType);
                    return Promise.reject(err);
                });

            this.handlersLoading.set(actionType, handlerLoading);
            return handlerLoading;
        }

        // The custom element has already been loaded and registered.
        return Promise.resolve();
    }
}
