import { InjectionToken, Type } from '@angular/core';
import { CqrsRegistryType } from './registry.type';

export const CQRS_MODULE_REGISTRY = new InjectionToken('CQRS_MODULE_REGISTRY');
export const CQRS_MODULE_SAGAS    = new InjectionToken('CQRS_MODULE_SAGAS');

export interface CqrsModuleOptions
{
  sagas?: Type<any>[];
  registry: CqrsRegistryType[];
}
