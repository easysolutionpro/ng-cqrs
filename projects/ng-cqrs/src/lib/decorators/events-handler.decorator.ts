import { Injectable } from '@angular/core';
import 'reflect-metadata';
import { INgEvent } from '../interfaces';
import { EVENTS_HANDLER_METADATA } from './constants';

export function NgEventsHandler(...events: INgEvent[]): ClassDecorator
{
    const injectableFn = Injectable();

    return (target: object) =>
    {
        injectableFn(target);
        Reflect.defineMetadata(EVENTS_HANDLER_METADATA, events, target);
    };
}
