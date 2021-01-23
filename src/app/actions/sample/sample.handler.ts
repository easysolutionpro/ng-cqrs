import { NgModule } from '@angular/core';
import { IActionHandler } from '../../cqrs/interfaces';
import { SampleAction } from './sample.action';

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
