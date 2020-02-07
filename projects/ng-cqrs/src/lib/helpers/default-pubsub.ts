import { Subject } from 'rxjs';
import { INgEvent, INgEventPublisher, INgMessageSource } from '../interfaces';

export class DefaultPubSub implements INgEventPublisher, INgMessageSource
{
    private subject$: Subject<any>;

    publish<T extends INgEvent>(event: T)
    {
        if (!this.subject$)
        {
            throw new Error('Invalid underlying subject (call bridgeEventsTo())');
        }
        this.subject$.next(event);
    }

    bridgeEventsTo<T extends INgEvent>(subject: Subject<T>)
    {
        this.subject$ = subject;
    }
}
