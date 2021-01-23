import { Component } from '@angular/core';
import { SampleAction } from './actions/sample/sample.action';
import { ActionBus } from '../../projects/ng-cqrs/src/lib';

@Component({
  selector   : 'app-root',
  templateUrl: './app.component.html',
  styleUrls  : ['./app.component.css']
})
export class AppComponent
{
  title = 'angular-starter';

  constructor(private readonly actionBus: ActionBus)
  {
  }

  select(): void
  {
    this.actionBus.execute(new SampleAction());
  }
}
