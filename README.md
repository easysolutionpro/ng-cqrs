## Description

A lightweight **CQRS** module for [Angular](https://angular.io) framework. Action handler and query handler module are loaded with lazy-load at the moment of action or query call.

## Installation

```bash
$ npm install --save ng-cqrs
```

## src/app/app.module.ts 

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
 
import { AppComponent } from './app.component';
 
import { CqrsModule } from 'ng-cqrs';
 
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    CqrsModule.forRoot({
          sagas   : [HeroesGameSagas],
          registry: [
            {
                impl   : KillDragonAction,
                handler: () => import('./actions/kill-dragon/kill-dragon.handler').then(mod => mod.KillDragonHandler)
            }
          ]
        })
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
```

## Actions
In this model, each action is called a Action. When a action is sent, the application responds to it. 
Let's create for example a `ShowNotificationAction` action to display notifications. Let's see how the action looks:

```typescript
export class ShowNotificationAction
{
    static readonly type = 'ShowNotificationAction';

    constructor(
        public readonly type: string,
        public readonly text: string,
    )
    {
    }
}
```

The `ActionBus` is a stream of actions. It delegates actions to the equivalent handlers. Each action must have an appropriate action handler:

```typescript
@NgModule()
export class ShowNotificationHandler implements IActionHandler<ShowNotificationAction>
{
    constructor(private readonly actionBus: ActionBus)
    {
    }

    async execute(action: ShowNotificationAction)
    {
        // Load PNotify script
        await this.actionBus.execute(new LoadScriptsAction('pnotify'));
        
        // Show notice
        new PNotify({
            text       : action.text,
            icon       : false,
            buttons    : {
                closer : true,
                sticker: false
            });
    }
}
```
All actions and queries work like Angular modules and are loaded with lazy-load at the time of a command or request.
With this method of work, each change in the application is determined by the appearance of the action. The logic is encapsulated in handlers.

```typescript
constructor(private readonly actionBus: ActionBus)
{
    this.actionBus.execute(new ShowNotificationAction('success', 'Ok'))
}
```

## Sagas

Sagas are an extremely powerful feature. A single saga may listen for 1..* actions. Using the RxJS library, it can combine, merge, filter or apply other RxJS operators on the event stream. Each saga returns an Observable which contains a action. This action is dispatched asynchronously.

```typescript
@Injectable()
export class HeroesGameSagas {
  @Saga()
  dragonKilled = (events$: Observable<any>): Observable<INgEvent> => {
    return events$.pipe(
      ofType(HeroKilledDragonEvent),
      map((event) => new DropAncientItemAction(event.heroId, fakeItemID)),
    );
  }
}
```

## Queries

The `QueryBus` follows the same pattern as the `ActionsBus`. Example Query Handler:
```typescript
@NgModule()
export class GetEmptyBlockHandler implements IQueryHandler<GetEmptyBlockQuery>
{
    async execute(query: GetEmptyBlockQuery): Promise<Element>
    {
        const block = document.querySelector('#empty_block');
 
        // logic

        return block;
    }
}
```
A working example is available in `src/app`.
