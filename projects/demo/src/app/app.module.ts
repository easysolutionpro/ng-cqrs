import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DocumentModule } from './document/document.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        DocumentModule,
    ],
    providers   : [],
    bootstrap   : [AppComponent]
})
export class AppModule
{
}
