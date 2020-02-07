export class InvalidCommandHandlerException extends Error
{
    constructor()
    {
        super(
            `Invalid command handler exception (missing @NgCommandHandler() decorator?)`,
        );
    }
}
