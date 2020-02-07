import {
    ModuleWithProviders,
    NgModule,
    Type
} from '@angular/core';
import 'reflect-metadata';
import { NgEventBus } from './event-bus';
import { NgCommandBus } from './command-bus';
import { NgQueryBus } from './query-bus';
import { CQRS_PROVIDER_GROUPS, ExplorerService } from './services/explorer.service';

@NgModule({
    providers: [
        NgEventBus,
        NgCommandBus,
        NgQueryBus,
        ExplorerService,
    ]
})
export class NgCQRSModule
{
    static forFeature(providers: Type<any>[]): ModuleWithProviders
    {
        return {
            ngModule : NgCQRSModule,
            providers: [
                ...providers,
                NgEventBus,
                NgCommandBus,
                NgQueryBus,
                {
                    provide   : CQRS_PROVIDER_GROUPS,
                    multi     : true,
                    deps      : providers,
                    useFactory: createSourceInstances,
                },
            ]
        };
    }

    constructor(
        private readonly eventsBus: NgEventBus,
        private readonly commandsBus: NgCommandBus,
        private readonly queryBus: NgQueryBus,
        private readonly explorerService: ExplorerService
    )
    {
        const { events, queries, sagas, commands } = this.explorerService.explore();

        this.eventsBus.register(events);
        this.commandsBus.register(commands);
        this.queryBus.register(queries);
        this.eventsBus.registerSagas(sagas);
    }
}

export function createSourceInstances(...instances: any[])
{
    return instances;
}
