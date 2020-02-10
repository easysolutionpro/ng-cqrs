import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgSaga } from '../../../../../ng-cqrs/src/lib/decorators';
import { INgCommand, INgEvent } from '../../../../../ng-cqrs/src/lib/interfaces';
import { filter, map, tap } from 'rxjs/operators';
import { ofType } from '../../../../../ng-cqrs/src/lib/operators';
import { ClickEvent } from '../events/impl';
import { ActionCommand } from '../commands/impl/action.command';

const ACTION_SELECTOR = '[data-action]:not(.disabled)';

@Injectable()
export class DocumentSagas
{
    /**
     * Convert click event to CQRS action if active element has "data-action" attribute
     */
    @NgSaga()
    handleAction = (events$: Observable<INgEvent>): Observable<INgCommand> =>
    {
        return events$
            .pipe(
                ofType(ClickEvent),
                map((event: ClickEvent) =>
                {
                    const triggerElement = (event.event.target as HTMLElement).closest(ACTION_SELECTOR);
                    if (!!triggerElement)
                    {
                        return new ActionCommand(
                            // Get action name
                            triggerElement.getAttribute('data-action'),
                            // Get data attributes
                            (triggerElement as HTMLElement).dataset,
                            // Active element
                            triggerElement,
                            // Event
                            event.event
                        );
                    }
                    return null;
                }),
                filter(command => !!command),
                tap(() =>
                {
                    console.log('Inside [DocumentSagas] Saga');
                })
            );
    }
}
