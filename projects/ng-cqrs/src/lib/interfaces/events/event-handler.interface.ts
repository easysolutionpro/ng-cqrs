import { INgEvent } from './event.interface';

export interface INgEventHandler<T extends INgEvent = any>
{
    handle(event: T);
}
