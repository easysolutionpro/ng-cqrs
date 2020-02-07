import 'reflect-metadata';
import { INgQuery } from '../interfaces';
import { QUERY_HANDLER_METADATA } from './constants';

export function NgQueryHandler(query: INgQuery): ClassDecorator
{
    return (target: object) =>
    {
        Reflect.defineMetadata(QUERY_HANDLER_METADATA, query, target);
    };
}

