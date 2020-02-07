import { INgEvent } from './event.interface';

export interface INgEventPublisher
{
    publish<T extends INgEvent>(event: T);
}
