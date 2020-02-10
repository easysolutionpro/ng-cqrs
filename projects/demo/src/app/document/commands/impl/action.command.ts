export class ActionCommand
{
    constructor(
        public readonly action: string,
        public readonly dataset: object,
        public readonly element: Element,
        public readonly event: MouseEvent,
    )
    {
    }
}