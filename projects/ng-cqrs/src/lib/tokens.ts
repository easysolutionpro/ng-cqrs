import { InjectionToken } from '@angular/core';

export const CQRS_MODULE_REGISTRY = new InjectionToken('CQRS_MODULE_REGISTRY');
export const CQRS_MODULE_SAGAS    = new InjectionToken('CQRS_MODULE_SAGAS');
export const CQRS_MODULE_LOGGING  = new InjectionToken('CQRS_MODULE_LOGGING');

export interface LogSettings
{
    enabled?: boolean;
    prefix?: string;
}

