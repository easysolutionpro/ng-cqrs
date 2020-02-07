import { Observable } from 'rxjs';
import { INgCommand } from './commands/command.interface';
import { INgEvent } from './events/event.interface';

export type INgSaga = (events$: Observable<INgEvent>) => Observable<INgCommand>;
