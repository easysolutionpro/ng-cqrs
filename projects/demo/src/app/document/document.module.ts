import { NgModule } from '@angular/core';
import { NgCQRSModule } from '../../../../ng-cqrs/src/lib';
import { EventHandlers } from './events/handlers';
import { CommandHandlers } from './commands/handlers';
import { DocumentSagas } from './sagas/document.sagas';


@NgModule({
    imports     : [
        NgCQRSModule.forFeature([
            ...EventHandlers,
            ...CommandHandlers,
            DocumentSagas,
        ])
    ]
})
export class DocumentModule
{
}
