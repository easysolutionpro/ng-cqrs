import { Injectable } from '@angular/core';

@Injectable()
export class Logger
{
    logAction(type: string, value: any): void
    {
        console.log(`%c[${type}]`, `color: #0077cc`, value);
    }

    logQuery(type: string, value: any): void
    {
        console.log(`%c[${type}]`, `color: #439a00`, value);
    }
}
