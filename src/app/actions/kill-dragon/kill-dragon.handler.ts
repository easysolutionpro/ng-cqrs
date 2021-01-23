import { NgModule } from '@angular/core';
import { KillDragonAction } from './kill-dragon.action';
import { IActionHandler } from '../../../../projects/ngx-cqrs/src/lib/interfaces';

@NgModule()
export class KillDragonHandler implements IActionHandler<KillDragonAction>
{
  execute(command: KillDragonAction): Promise<any>
  {
    console.log('KillDragonAction...');
    return undefined;
  }
}
