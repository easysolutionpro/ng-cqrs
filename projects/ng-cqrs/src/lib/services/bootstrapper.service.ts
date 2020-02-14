import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { filter, first } from 'rxjs/operators';

@Injectable()
export class BootstrapperService
{
    /**
     * Use `ReplaySubject`, thus we can get cached value even if the stream is completed
     */
    private bootstrap$ = new ReplaySubject<boolean>(1);

    get appBootstrapped$(): Observable<boolean>
    {
        return this.bootstrap$.asObservable().pipe(filter(appBootstrapped => !!appBootstrapped));
    }

    /**
     * This event will be emitted after attaching `ComponentRef` of the root component
     * to the tree of views, that's a signal that application has been fully rendered
     */
    bootstrap(): void
    {
        this.bootstrap$.next(true);
        this.bootstrap$.complete();
    }

    /**
     * Run after run bootstrap
     */
    safelyRun(callback: any): void
    {
        this.appBootstrapped$
            .pipe(first())
            .subscribe(() => callback());
    }
}