import { Type } from '@angular/core';
import { CqrsRegistryType } from './registry.type';

export interface CqrsModuleOptions
{
  sagas?: Type<any>[];
  registry: CqrsRegistryType[];
}
