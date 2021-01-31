import { Component } from '@angular/core';
import { SampleAction } from './actions/sample/sample.action';
import { ActionBus } from '../../projects/ng-cqrs/src/lib/action-bus';
import { QueryBus } from '../../projects/ng-cqrs/src/lib/query-bus';
import { GetDragonQuery } from './queries/get-dragon/get-dragon.query';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.css']
})
export class AppComponent
{
  title = 'angular-starter';

  constructor(
      private readonly actionBus: ActionBus,
      private readonly queryBus: QueryBus
  )
  {
  }

  select(): void
  {
    this.actionBus.execute(new SampleAction());
    this.queryBus.execute(new GetDragonQuery()); // .then(result => console.log(result));
  }
}
