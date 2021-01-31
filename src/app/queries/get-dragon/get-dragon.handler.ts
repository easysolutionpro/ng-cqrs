import { IQueryHandler } from '../../../../projects/ng-cqrs/src/lib/interfaces';
import { GetDragonQuery } from './get-dragon.query';
import { NgModule } from '@angular/core';

@NgModule()
export class GetDragonHandler implements IQueryHandler<GetDragonQuery>
{
    async execute(query: GetDragonQuery): Promise<any>
    {
        return Promise.resolve({ result: 'Dragon' });
    }
}
