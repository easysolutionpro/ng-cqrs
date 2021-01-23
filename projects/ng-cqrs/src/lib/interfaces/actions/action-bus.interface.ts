import { IAction } from './action.interface';

export interface IActionBus
{
  execute<T extends IAction>(command: T): Promise<any>;
}
