export class ActionHandlerNotFoundException extends Error
{
  constructor(actionName: string)
  {
    super(`The action handler for the "${actionName}" action was not found!`);
  }
}
