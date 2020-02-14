import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DocumentModule } from './document/document.module';
import { environment } from '../environments/environment';
import { NgCQRSModule } from '../../../ng-cqrs/src/lib';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        DocumentModule,

        NgCQRSModule.forRoot({
            production: environment.production,
            providers : []
        }),
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule
{
}
