import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { getActionTypeFromInstance } from '../utils';
import { IAction, IQuery } from '../interfaces';

export function ofType(...types: any[])
{
  const isInstanceOf = (event: IAction|IQuery) =>
    !!types.find(classType =>
    {
      return typeof classType === 'string'
        ? getActionTypeFromInstance(event) === classType
        : getActionTypeFromInstance(event) === getActionTypeFromInstance(classType);
    });
  return (source: Observable<any>): Observable<any> => source.pipe(filter(isInstanceOf));
}
