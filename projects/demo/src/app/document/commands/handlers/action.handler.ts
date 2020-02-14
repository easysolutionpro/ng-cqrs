import { NgCommandHandler } from '../../../../../../ng-cqrs/src/lib/decorators';
import { ActionCommand } from '../impl/action.command';
import { INgCommandHandler } from '../../../../../../ng-cqrs/src/lib/interfaces';
import { NgCommandBus, NgEventBus } from '../../../../../../ng-cqrs/src/lib';

@NgCommandHandler(ActionCommand)
export class ActionHandler implements INgCommandHandler<ActionCommand>
{
    constructor(
        private readonly commandBus: NgCommandBus,
        private readonly eventBus: NgEventBus,
    )
    {
    }

    async execute(command: ActionCommand): Promise<void>
    {
        if (command.action.endsWith('Event'))
        {
            console.log('Publish CQRS event');
            this.eventBus.publishByName(command, command.action);
        } else if (command.action.endsWith('Command'))
        {
            console.log('Execute CQRS command');
            this.commandBus.executeByName(command, command.action);
        }
    }
}
