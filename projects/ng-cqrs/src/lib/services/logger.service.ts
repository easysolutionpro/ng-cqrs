import { ErrorHandler, Inject, Injectable } from '@angular/core';
import { NG_CQRS_OPTIONS } from '../options';

@Injectable()
export class NgLogger
{
    constructor(
        private errorHandler: ErrorHandler,
        @Inject(NG_CQRS_OPTIONS) private options
    )
    {
    }

    log(value: any, ...rest: any[])
    {
        if (!this.options.production)
        {
            console.log(value, ...rest);
        }
    }

    error(error: Error)
    {
        this.errorHandler.handleError(error);
    }

    warn(value: any, ...rest: any[])
    {
        console.warn(value, ...rest);
    }
}
