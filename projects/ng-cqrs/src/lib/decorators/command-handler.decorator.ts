import { Injectable } from '@angular/core';
import 'reflect-metadata';
import { INgCommand } from '../interfaces/commands/command.interface';
import { COMMAND_HANDLER_METADATA } from './constants';

export function NgCommandHandler(command: INgCommand): ClassDecorator
{
    const injectableFn = Injectable();

    return (target: object) =>
    {
        injectableFn(target);
        Reflect.defineMetadata(COMMAND_HANDLER_METADATA, command, target);
    };
}
