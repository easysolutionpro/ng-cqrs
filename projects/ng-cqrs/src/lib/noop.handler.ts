import { NgModule } from '@angular/core';

@NgModule()
export class NoopHandler
{
    async execute(): Promise<void>
    {
        return undefined;
    }
}
