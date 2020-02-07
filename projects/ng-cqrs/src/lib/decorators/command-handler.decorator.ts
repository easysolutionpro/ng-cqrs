import 'reflect-metadata';
import { Type } from '@angular/core';
import { COMMAND_HANDLER_METADATA, ANNOTATIONS } from './constants';
import { INgCommand } from '../interfaces/commands/command.interface';

export function NgCommandHandler(command: INgCommand): (cls: Type<any>) => any
{
    if (this instanceof NgCommandHandler)
    {
        return this as typeof NgCommandHandler;
    }

    const annotationInstance = new (NgCommandHandler as any)();
    return function TypeDecorator(cls: Type<any>)
    {
        Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, cls);
        // Use of Object.defineProperty is important since it creates non-enumerable property which
        // prevents the property is copied during subclassing.
        const annotations = cls.hasOwnProperty(ANNOTATIONS)
            ? (cls as any)[ANNOTATIONS]
            : Object.defineProperty(cls, ANNOTATIONS, { value: [] })[ANNOTATIONS];
        annotations.push(annotationInstance);

        return cls;
    };
}

