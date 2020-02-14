import { NgEventsHandler } from '../../../../../../ng-cqrs/src/lib/decorators';
import { ClickEvent } from '../impl';
import { INgEventHandler } from '../../../../../../ng-cqrs/src/lib/interfaces';

@NgEventsHandler(ClickEvent)
export class ClickHandler implements INgEventHandler<ClickEvent>
{
    constructor()
    {
    }

    handle(event: ClickEvent)
    {
        console.log(`ClickEvent...`);
    }
}
