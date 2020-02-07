import { Subject } from 'rxjs';
import { INgEvent } from './event.interface';

export interface INgMessageSource
{
    bridgeEventsTo<T extends INgEvent>(subject: Subject<T>);
}
