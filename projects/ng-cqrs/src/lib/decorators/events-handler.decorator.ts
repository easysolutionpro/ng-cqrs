import 'reflect-metadata';
import { Type } from '@angular/core';
import { ANNOTATIONS, EVENTS_HANDLER_METADATA } from './constants';
import { INgEvent } from '../interfaces';

export function NgEventsHandler(...events: INgEvent[]): (cls: Type<any>) => any
{
    if (this instanceof NgEventsHandler)
    {
        return this as typeof NgEventsHandler;
    }

    const annotationInstance = new (NgEventsHandler as any)();
    return function TypeDecorator(cls: Type<any>)
    {
        Reflect.defineMetadata(EVENTS_HANDLER_METADATA, events, cls);
        // Use of Object.defineProperty is important since it creates non-enumerable property which
        // prevents the property is copied during subclassing.
        const annotations = cls.hasOwnProperty(ANNOTATIONS)
            ? (cls as any)[ANNOTATIONS]
            : Object.defineProperty(cls, ANNOTATIONS, { value: [] })[ANNOTATIONS];
        annotations.push(annotationInstance);

        return cls;
    };
}
