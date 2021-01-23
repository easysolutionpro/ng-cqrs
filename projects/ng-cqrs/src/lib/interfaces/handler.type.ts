import { IActionHandler } from './actions/action-handler.interface';
import { IQueryHandler } from './queries/query-handler.interface';

export type CqrsHandler = IQueryHandler|IActionHandler;
