import { Observable } from 'rxjs';
import { IAction } from './actions/action.interface';

export type ISaga = (actions$: Observable<IAction>) => Observable<IAction>;
