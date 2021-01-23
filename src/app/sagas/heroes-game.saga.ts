import { map } from 'rxjs/operators';
import { ofType } from '../cqrs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { IAction } from '../cqrs/interfaces';
import { Saga } from '../cqrs/decorators';
import { SampleAction } from '../actions/sample/sample.action';
import { KillDragonAction } from '../actions/kill-dragon/kill-dragon.action';

@Injectable()
export class HeroesGameSagas
{
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<IAction> =>
  {
    return events$.pipe(
      ofType(SampleAction),
      map((event) => new KillDragonAction(event)),
    );
  }
}
