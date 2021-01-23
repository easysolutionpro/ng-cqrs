import { IAction } from './actions/action.interface';
import { IQuery } from './queries/query.interface';

export interface CqrsRegistryType<T = any>
{
  impl: IAction|IQuery;
  handler: () => Promise<T>;
}

