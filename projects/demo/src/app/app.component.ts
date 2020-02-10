import { Component, HostListener, OnInit } from '@angular/core';
import { NgCommandBus, NgEventBus } from '../../../ng-cqrs/src/lib';
import { ClickEvent, ResizeEvent } from './document/events/impl';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent implements OnInit
{
    title = 'demo';

    constructor(
        private readonly eventBus: NgEventBus,
        private readonly commandBus: NgCommandBus
    )
    {
    }

    ngOnInit(): void
    {
        // Listen all events
        this.eventBus.listenAll.subscribe(event =>
        {
        });

        // Listen all commands
        this.commandBus.listenAll.subscribe(command =>
        {
        });
    }

    @HostListener('window:resize', ['$event.target.innerWidth'])
    onResize(width: number)
    {
        this.eventBus.publish(new ResizeEvent(width));
    }

    @HostListener('click', ['$event'])
    onClick(event)
    {
        this.eventBus.publish(new ClickEvent(event));
    }
}
