import { NgModule } from '@angular/core';
import { SampleAction } from './sample.action';
import { IActionHandler } from '../../../../projects/ngx-cqrs/src/lib/interfaces';

@NgModule()
export class SampleHandler implements IActionHandler<SampleAction>
{
  constructor()
  {
  }

  async execute(command: SampleAction): Promise<any>
  {
    console.log('SampleAction...');
    return undefined;
  }
}
