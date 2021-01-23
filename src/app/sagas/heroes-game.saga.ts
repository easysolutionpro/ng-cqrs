import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SampleAction } from '../actions/sample/sample.action';
import { KillDragonAction } from '../actions/kill-dragon/kill-dragon.action';
import { Saga } from '../../../projects/ngx-cqrs/src/lib/decorators';
import { IAction } from '../../../projects/ngx-cqrs/src/lib/interfaces';
import { ofType } from '../../../projects/ngx-cqrs/src/lib/operators';

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
