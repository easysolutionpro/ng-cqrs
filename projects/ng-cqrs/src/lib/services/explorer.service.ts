import { Inject, Injectable, InjectionToken, Type } from '@angular/core';
import {
    COMMAND_HANDLER_METADATA,
    EVENTS_HANDLER_METADATA,
    QUERY_HANDLER_METADATA,
    SAGA_METADATA,
} from '../decorators/constants';
import { INgCommandHandler, INgEventHandler, INgQueryHandler } from '../interfaces';
import { NgCqrsOptions } from '../interfaces/cqrs-options.interface';

export const CQRS_PROVIDER_GROUPS = new InjectionToken<any>('__CQRS_PROVIDERS__');

@Injectable()
export class ExplorerService
{
    constructor(@Inject(CQRS_PROVIDER_GROUPS) private readonly groups: Type<any>[][])
    {
    }

    explore(): NgCqrsOptions
    {
        const groups   = [...this.groups];
        const commands = this.flatMap<INgCommandHandler>(groups, instance =>
            this.filterProvider(instance, COMMAND_HANDLER_METADATA),
        );
        const queries  = this.flatMap<INgQueryHandler>(groups, instance =>
            this.filterProvider(instance, QUERY_HANDLER_METADATA),
        );
        const events   = this.flatMap<INgEventHandler>(groups, instance =>
            this.filterProvider(instance, EVENTS_HANDLER_METADATA),
        );
        const sagas    = this.flatMap(groups, instance =>
            this.filterProvider(instance, SAGA_METADATA),
        );
        return { commands, queries, events, sagas };
    }

    flatMap<T>(
        groups: Type<any>[][],
        callback: (instance: any) => Type<any>|undefined,
    ): Type<T>[]
    {
        const items = groups
            .map(group => [...group].map(callback))
            .reduce((a, b) => a.concat(b), []);
        return items.filter(element => !!element) as Type<T>[];
    }

    filterProvider(
        instance: Type<any>|undefined,
        metadataKey: string,
    ): Type<any>|undefined
    {
        if (!instance)
        {
            return undefined;
        }
        return this.extractMetadata(instance, metadataKey);
    }

    extractMetadata(instance: Object, metadataKey: string): Type<any>
    {
        if (!instance.constructor)
        {
            return;
        }
        const metadata = Reflect.getMetadata(metadataKey, instance.constructor);
        return metadata ? (instance.constructor as Type<any>) : undefined;
    }
}
