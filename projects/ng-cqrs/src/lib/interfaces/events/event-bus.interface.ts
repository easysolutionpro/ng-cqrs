import { INgEvent } from './event.interface';

export interface INgEventBus
{
    publish<T extends INgEvent>(event: T);

    publishAll(events: INgEvent[]);
}
