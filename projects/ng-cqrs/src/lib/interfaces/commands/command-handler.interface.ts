import { INgCommand } from './command.interface';

export interface INgCommandHandler<T extends INgCommand = any>
{
    execute(command: T): Promise<any>;
}
