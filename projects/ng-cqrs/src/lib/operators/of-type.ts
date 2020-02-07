import { Type } from '@angular/core';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { INgEvent } from '../interfaces';

/**
 * Filter values depending on their instance type (comparison is made
 * using native `instanceof`).
 *
 * @param types List of types implementing `INgEvent`.
 *
 * @return A stream only emitting the filtered instances.
 */
export function ofType<TInput extends INgEvent, TOutput extends INgEvent>(
    ...types: Type<TOutput>[]
)
{
    const isInstanceOf = (event: INgEvent): event is TOutput =>
        !!types.find(classType => event.constructor.name === classType.name);
    return (source: Observable<TInput>): Observable<TOutput> =>
        source.pipe(filter(isInstanceOf));
}
