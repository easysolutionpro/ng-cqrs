export class CommandHandlerNotFoundException
{
    constructor(
        public readonly message = 'NgCommandHandler not found exception!',
    )
    {
    }
}
