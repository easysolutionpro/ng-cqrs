import { NgEventsHandler } from '../../../../../../ng-cqrs/src/lib/decorators';
import { ResizeEvent } from '../impl';
import { INgEventHandler } from '../../../../../../ng-cqrs/src/lib/interfaces';

@NgEventsHandler(ResizeEvent)
export class ResizeHandler implements INgEventHandler<ResizeEvent>
{
    constructor()
    {
    }

    handle(event: ResizeEvent)
    {
        console.log(`ResizeEvent...`);
    }
}
