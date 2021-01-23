import { ModuleWithProviders, NgModule } from '@angular/core';
import { QueryBus } from './query-bus';
import { ActionBus } from './action-bus';
import { CqrsLoader } from './cqrs-loader';
import { CQRS_MODULE_REGISTRY, CQRS_MODULE_SAGAS, CqrsModuleOptions } from './interfaces/module-options';

@NgModule()
export class CqrsModule
{
  static forRoot(options: CqrsModuleOptions): ModuleWithProviders<CqrsModule>
  {
    options = options || { sagas: [], registry: [] };

    return {
      ngModule : CqrsModule,
      providers: [
        QueryBus,
        ActionBus,
        CqrsLoader,
        ...options.sagas,
        {
          provide : CQRS_MODULE_REGISTRY,
          useValue: options.registry || [],
        },
        {
          provide   : CQRS_MODULE_SAGAS,
          deps      : options.sagas,
          useFactory: CqrsModule.createSourceInstances,
        },
      ],
    };
  }

  private static createSourceInstances(...instances: any[])
  {
    return instances;
  }

  // constructor(
  //   actionBus: ActionBus,
  //   @Optional() @Inject(CQRS_MODULE_OPTIONS) readonly config: CqrsModuleOptions
  // )
  // {
  //   actionBus.registerSagas(config.sagas);
  // }
}
