import { INgCommandHandler } from './commands/command-handler.interface';
import { INgEventHandler } from './events/event-handler.interface';
import { INgQueryHandler } from './queries/query-handler.interface';
import { Type } from '@angular/core';

export interface NgCqrsOptions
{
    events?: Type<INgEventHandler>[];
    queries?: Type<INgQueryHandler>[];
    commands?: Type<INgCommandHandler>[];
    sagas?: Type<any>[];
}
