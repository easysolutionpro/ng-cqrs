import { Injectable, Type } from '@angular/core';
import { getActionTypeFromInstance, ObservableBus } from './utils';
import { IQuery, IQueryBus, IQueryResult } from './interfaces';
import { CqrsLoader } from './cqrs-loader';
import { QueryHandlerNotFoundException } from './exceptions';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { ofType } from './operators/of-type';

@Injectable()
export class QueryBus extends ObservableBus<IQuery> implements IQueryBus
{
  constructor(private readonly loader: CqrsLoader)
  {
    super();
  }

  async execute<T extends IQuery, TResult extends IQueryResult>(query: T): Promise<TResult>
  {
    await this.loader.load(query);
    if (!this.loader.hasHandler(query))
    {
      throw new QueryHandlerNotFoundException(`QueryHandler not found for command "${getActionTypeFromInstance(query)}"`);
    }
    this.subject$.next(query);
    return this.loader.execute(query);
  }

  ofType<TInput extends IQuery, TOutput extends IQuery>(
    ...types: (Type<IQuery>|string)[]
  ): Observable<IQuery>
  {
    return this.subject$.pipe(ofType(...types), share());
  }
}
