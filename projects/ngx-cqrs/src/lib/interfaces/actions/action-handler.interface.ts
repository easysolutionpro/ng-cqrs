import { IAction } from './action.interface';

export interface IActionHandler<T extends IAction = any>
{
  execute(command: T): Promise<any>;
}
