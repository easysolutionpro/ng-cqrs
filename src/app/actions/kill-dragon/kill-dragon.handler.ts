import { NgModule } from '@angular/core';
import { IActionHandler } from '../../cqrs/interfaces';
import { KillDragonAction } from './kill-dragon.action';

@NgModule()
export class KillDragonHandler implements IActionHandler<KillDragonAction>
{
  execute(command: KillDragonAction): Promise<any>
  {
    console.log('KillDragonAction...');
    return undefined;
  }
}
