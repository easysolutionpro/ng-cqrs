import { INgCommand } from './command.interface';

export interface ICommandBus
{
    execute<T extends INgCommand>(command: T): Promise<any>;
}
