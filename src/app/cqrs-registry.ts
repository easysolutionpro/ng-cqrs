import { SampleAction } from './actions/sample/sample.action';
import { KillDragonAction } from './actions/kill-dragon/kill-dragon.action';
import { GetDragonQuery } from './queries/get-dragon/get-dragon.query';

export const CQRS_REGISTRY = [
    {
        impl   : SampleAction,
        handler: () => import('./actions/sample/sample.handler').then(mod => mod.SampleHandler)
    },
    {
        impl   : KillDragonAction,
        handler: () => import('./actions/kill-dragon/kill-dragon.handler').then(mod => mod.KillDragonHandler)
    },
    {
        impl   : GetDragonQuery,
        handler: () => import('./queries/get-dragon/get-dragon.handler').then(mod => mod.GetDragonHandler)
    }
];
