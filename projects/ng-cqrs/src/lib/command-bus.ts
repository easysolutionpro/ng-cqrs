import { Injectable, NgModuleRef, NgZone, Type } from '@angular/core';
import 'reflect-metadata';
import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { COMMAND_HANDLER_METADATA } from './decorators/constants';
import { CommandHandlerNotFoundException } from './exceptions/command-not-found.exception';
import { InvalidCommandHandlerException } from './exceptions/invalid-command-handler.exception';
import { ICommandBus, INgCommand, INgCommandHandler } from './interfaces/index';
import { BootstrapperService } from './services/bootstrapper.service';
import { NgLogger } from './services/logger.service';
import { ObservableBus } from './utils/observable-bus';

export type CommandHandlerType = Type<INgCommandHandler<INgCommand>>;

@Injectable()
export class NgCommandBus extends ObservableBus<INgCommand> implements ICommandBus
{
    private handlers = new Map<string, INgCommandHandler<INgCommand>>();

    constructor(
        private readonly moduleRef: NgModuleRef<any>,
        private readonly zone: NgZone,
        private readonly logger: NgLogger,
        private readonly bootstrapper: BootstrapperService
    )
    {
        super();
    }

    get listenAll(): Observable<INgCommand>
    {
        return this.subject$.pipe(share());
    }

    execute<T extends INgCommand>(command: T): Promise<any>
    {
        return this.zone.runOutsideAngular(() =>
        {
            const name = this.getCommandName(command);
            return this.executeByName(command, name);
        });
    }

    async executeByName<T extends INgCommand>(command: T, name: string): Promise<any>
    {
        await this.bootstrapper.appBootstrapped$.toPromise();

        return this.zone.runOutsideAngular(() =>
        {
            const handler = this.handlers.get(name);
            if (!handler)
            {
                throw new CommandHandlerNotFoundException(`CommandHandler not found for command  "${name}"`);
            }
            this.subject$.next(command);

            try
            {
                return handler.execute(command);
            }
            catch (e)
            {
                this.logger.error(e);
            }
        });
    }

    bind<T extends INgCommand>(handler: INgCommandHandler<T>, name: string)
    {
        this.handlers.set(name, handler);
    }

    register(handlers: CommandHandlerType[] = [])
    {
        this.zone.runOutsideAngular(() =>
        {
            handlers.forEach(handler => this.registerHandler(handler));
        });
    }

    protected registerHandler(handler: CommandHandlerType)
    {
        const instance = this.moduleRef.injector.get(handler);
        if (!instance)
        {
            return;
        }
        const target = this.reflectCommandName(handler);
        if (!target)
        {
            throw new InvalidCommandHandlerException();
        }
        this.bind(instance as INgCommandHandler<INgCommand>, target.name);
    }

    private getCommandName(command): string
    {
        const { constructor } = Object.getPrototypeOf(command);
        return constructor.name as string;
    }

    private reflectCommandName(handler: CommandHandlerType): FunctionConstructor
    {
        return Reflect.getMetadata(COMMAND_HANDLER_METADATA, handler);
    }
}
