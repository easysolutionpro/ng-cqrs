## Description

A lightweight **CQRS** module for [Angular](https://angular.io) framework. This is a redesigned [CQRS module](https://github.com/nestjs/cqrs) for Nest framework (node.js)

## Installation

```bash
$ npm install --save ng-cqrs
```

## Commands
In this model, each action is called a Command. When a command is sent, the application responds to it. 
Let's create for example a `ShowNotificationCommand` command to display notifications. Let's see how the command looks:

```typescript
export class ShowNotificationCommand
{
    constructor(
        public readonly type: string,
        public readonly text: string,
    )
    {
    }
}
```

The `NgCommandBus` is a stream of commands. It delegates commands to the equivalent handlers. Each command must have an appropriate command handler:

```typescript
@NgCommandHandler(ShowNotificationCommand)
export class ShowNotificationHandler implements INgCommandHandler<ShowNotificationCommand>
{
    constructor(private readonly commandBus: NgCommandBus)
    {
    }

    async execute(command: ShowNotificationCommand)
    {
        // Load PNotify script
        await this.commandBus.execute(new LoadScriptsCommand('pnotify'));
        
        // Show notice
        new PNotify({
            text       : command.text,
            icon       : false,
            buttons    : {
                closer : true,
                sticker: false
            });
    }
}
```
All commands, queries and events executed outside of the Angular zone and are well suited for working with plugins and manipulating the DOM directly.
With this method of work, each change in the application is determined by the appearance of the command. The logic is encapsulated in handlers. With this approach, we can simply add behavior such as logging or saving commands for diagnostic purposes. 
They are dispatched  directly using NgCommandBus.

```typescript
constructor(private readonly commandBus: NgCommandBus)
{
    this.commandBus.execute(new ShowNotificationCommand('success', 'Ok'))
}
```

## Events

Example event:
```typescript
export class ConfirmationSuccessEvent
{
    constructor(
        public readonly element: Element,
    )
    {
    }
}
```
Each event can have multiple Event Handlers.
```typescript
@NgEventsHandler(ConfirmationSuccessEvent)
export class ConfirmationSuccessHandler implements INgEventHandler<ConfirmationSuccessEvent>
{
    handle(event: ConfirmationSuccessEvent) {
        // logic
    }
}
```
Inject `NgEventBus` class:
```typescript
constructor(private readonly eventBus: NgEventBus) {}
```
Run event:
```typescript
@HostListener('click', ['$event'])
onClick(event)
{
    this.eventBus.publish(new ClickEvent(event));
}
```

## Sagas

Sagas are an extremely powerful feature. A single saga may listen for 1..* events. Using the RxJS library, it can combine, merge, filter or apply other RxJS operators on the event stream. Each saga returns an Observable which contains a command. This command is dispatched asynchronously.

```typescript
@Injectable()
export class HeroesGameSagas {
  @NgSaga()
  dragonKilled = (events$: Observable<any>): Observable<INgEvent> => {
    return events$.pipe(
      ofType(HeroKilledDragonEvent),
      map((event) => new DropAncientItemCommand(event.heroId, fakeItemID)),
    );
  }
}
```

## Queries

The `NgQueryBus` follows the same pattern as the `NgCommandsBus`. Example Query Handler:
```typescript
@NgQueryHandler(GetEmptyBlockQuery)
export class GetEmptyBlockHandler implements INgQueryHandler<GetEmptyBlockQuery>
{
    async execute(query: GetEmptyBlockQuery): Promise<Element>
    {
        const block = document.querySelector('#empty_block');
 
        // logic

        return block;
    }
}
```

## Setup

Finally, let's look at how to set up the whole CQRS mechanism.
```typescript
export const CommandHandlers = [
    ActionHandler
];
...

@NgModule({
    imports     : [
        NgCQRSModule.forFeature([
            ...EventHandlers,
            ...CommandHandlers,
            ...QueryHandlers,
            DocumentSagas,
        ])
    ]
})
export class DocumentModule
{
}
```
`NgCommandBus`, `NgQueryBus` and `NgEventBus` are Observables. This means that you can easily subscribe to all actions.
```typescript
// Listen all events
this.eventBus.listenAll.subscribe(event =>
{
});

// Listen all commands
this.commandBus.listenAll.subscribe(command =>
{
});
```