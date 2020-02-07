import { INgQuery } from './query.interface';

export interface INgQueryBus
{
    execute<T extends INgQuery, TRes>(query: T): Promise<TRes>;
}
