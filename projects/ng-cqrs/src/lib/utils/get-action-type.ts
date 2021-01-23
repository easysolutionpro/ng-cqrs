export function getActionTypeFromInstance(action: any): string|undefined
{
    if (action.constructor && action.constructor.type)
    {
        return action.constructor.type;
    }

    return action.type;
}
