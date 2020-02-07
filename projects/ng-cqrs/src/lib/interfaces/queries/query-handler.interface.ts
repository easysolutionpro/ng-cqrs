import { INgQuery } from './query.interface';

export interface INgQueryHandler<T extends INgQuery = any, TRes = any>
{
    execute(query: T): Promise<TRes>;
}
