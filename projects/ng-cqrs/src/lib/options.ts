import { InjectionToken, Type } from '@angular/core';

export const NG_CQRS_OPTIONS = new InjectionToken('NG_CQRS_OPTIONS');

export interface NgCQRSOptions
{
    production: boolean;
    providers: Type<any>[];
}