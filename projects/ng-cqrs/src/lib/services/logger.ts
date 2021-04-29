import { Inject, Injectable } from '@angular/core';
import { CQRS_MODULE_LOGGING, LogSettings } from '../tokens';

@Injectable()
export class Logger
{
    constructor(@Inject(CQRS_MODULE_LOGGING) readonly logging: LogSettings)
    {
    }

    get prefix(): string
    {
        return !!this.logging.prefix ? this.logging.prefix + ':' : '';
    }

    logAction(type: string, value: any): void
    {
        console.log(`%c[${this.prefix}${type}]`, `color: #0077cc`, value);
    }

    logQuery(type: string, value: any): void
    {
        console.log(`%c[${this.prefix}${type}]`, `color: #439a00`, value);
    }
}
