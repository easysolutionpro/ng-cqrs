import {
    APP_BOOTSTRAP_LISTENER,
    ModuleWithProviders,
    NgModule,
    Type
} from '@angular/core';
import 'reflect-metadata';
import { NgCommandBus } from './command-bus';
import { NgEventBus } from './event-bus';
import { NgCQRSOptions, NG_CQRS_OPTIONS } from './options';
import { NgQueryBus } from './query-bus';
import { BootstrapperService } from './services/bootstrapper.service';
import { CQRS_PROVIDER_GROUPS, ExplorerService } from './services/explorer.service';
import { NgLogger } from './services/logger.service';

@NgModule()
export class NgCQRSModule
{
    static forRoot(options: NgCQRSOptions): ModuleWithProviders
    {
        return {
            ngModule : NgCQRSModule,
            providers: [
                ...options.providers,
                NgEventBus,
                NgCommandBus,
                NgQueryBus,
                NgLogger,
                BootstrapperService,
                ExplorerService,
                {
                    provide   : CQRS_PROVIDER_GROUPS,
                    multi     : true,
                    deps      : options.providers,
                    useFactory: NgCQRSModule.createSourceInstances,
                },
                {
                    provide : NG_CQRS_OPTIONS,
                    useValue: options
                },
                {
                    provide   : APP_BOOTSTRAP_LISTENER,
                    useFactory: NgCQRSModule.appBootstrapListenerFactory,
                    multi     : true,
                    deps      : [BootstrapperService]
                },
            ]
        };
    }

    static forFeature(providers: Type<any>[]): ModuleWithProviders
    {
        return {
            ngModule : NgCQRSModule,
            providers: [
                ...providers,
                NgEventBus,
                NgCommandBus,
                NgQueryBus,
                NgLogger,
                {
                    provide   : CQRS_PROVIDER_GROUPS,
                    multi     : true,
                    deps      : providers,
                    useFactory: NgCQRSModule.createSourceInstances,
                },
            ]
        };
    }

    private static appBootstrapListenerFactory(bootstrapper: BootstrapperService): Function
    {
        return () => bootstrapper.bootstrap();
    }

    private static createSourceInstances(...instances: any[])
    {
        return instances;
    }

    constructor(
        private readonly eventsBus: NgEventBus,
        private readonly commandsBus: NgCommandBus,
        private readonly queryBus: NgQueryBus,
        private readonly explorerService: ExplorerService,
        private readonly bootstrapper: BootstrapperService
    )
    {
        this.bootstrapper.safelyRun(() =>
        {
            const { events, queries, sagas, commands } = this.explorerService.explore();

            this.eventsBus.register(events);
            this.commandsBus.register(commands);
            this.queryBus.register(queries);
            this.eventsBus.registerSagas(sagas);
        });
    }
}

