import 'reflect-metadata';
import { SAGA_METADATA } from './constants';

export function NgSaga(): PropertyDecorator
{
    return (target: object, propertyKey: string|symbol) =>
    {
        const properties =
                  Reflect.getMetadata(SAGA_METADATA, target.constructor) || [];
        Reflect.defineMetadata(
            SAGA_METADATA,
            [...properties, propertyKey],
            target.constructor,
        );
    };
}

