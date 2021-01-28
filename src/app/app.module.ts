import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { APP_STORE, appStore } from './app.store';
import { CQRS_REGISTRY } from './cqrs-registry';
import { HeroesGameSagas } from './sagas/heroes-game.saga';
import { CqrsModule } from '../../projects/ng-cqrs/src/lib/cqrs.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        CqrsModule.forRoot({
            sagas        : [HeroesGameSagas],
            registry     : CQRS_REGISTRY,
            enableLogging: true
        }),
    ],
    providers   : [
        { provide: APP_STORE, useValue: appStore }
    ],
    bootstrap   : [AppComponent]
})
export class AppModule
{
}
