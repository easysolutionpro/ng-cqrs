import { Injectable } from '@angular/core';
import { NgEventsHandler } from '../../../../../../ng-cqrs/src/lib/decorators';
import { ClickEvent } from '../impl';
import { INgEventHandler } from '../../../../../../ng-cqrs/src/lib/interfaces';

@Injectable()
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
