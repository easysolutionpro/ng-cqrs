import { Injectable, Type } from '@angular/core';
import { SAGA_METADATA } from '../decorators/constants';


@Injectable()
export class ExplorerService
{
  explore(groups: Type<any>[]): {sagas: Type<any>[]}
  {
    return groups.reduce((accum, item) =>
    {
      if (this.hasMetadata(item, SAGA_METADATA))
      {
        accum.sagas.push(item);
      }

      return accum;

    }, { sagas: [] });
  }

  hasMetadata(type, metadataKey: string): boolean
  {
    return !!Reflect.getMetadata(metadataKey, type.constructor);
  }
}
