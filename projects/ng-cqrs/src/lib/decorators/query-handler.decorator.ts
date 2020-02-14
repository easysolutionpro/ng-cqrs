import { Injectable } from '@angular/core';
import 'reflect-metadata';
import { INgQuery } from '../interfaces';
import { QUERY_HANDLER_METADATA } from './constants';

export function NgQueryHandler(query: INgQuery): ClassDecorator
{
    const injectableFn = Injectable();

    return (target: object) =>
    {
        injectableFn(target);
        Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
    };
}
