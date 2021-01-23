import { SampleAction } from './actions/sample/sample.action';
import { KillDragonAction } from './actions/kill-dragon/kill-dragon.action';

export const CQRS_REGISTRY = [
  {
    impl   : SampleAction,
    handler: () => import('./actions/sample/sample.handler').then(mod => mod.SampleHandler)
  },
  {
    impl   : KillDragonAction,
    handler: () => import('./actions/kill-dragon/kill-dragon.handler').then(mod => mod.KillDragonHandler)
  }
];
