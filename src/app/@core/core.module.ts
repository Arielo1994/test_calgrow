import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbAuthModule, NbTokenStorage, NbTokenLocalStorage } from '@nebular/auth';
import { NbSecurityModule, NbRoleProvider } from '@nebular/security';
import { RoleProvider } from './auth/role.service';
import { roleConfig } from './auth/auth.config';

import { throwIfAlreadyLoaded } from './module-import-guard';
import {
  AnalyticsService,
  LayoutService,
  MeanService,
  StateService,
} from './utils';

import { FieldsService } from './api/fields.service';
import { SectorsService } from './api/sectors.service';
import { SpeciesService } from './api/species.service';
import { VarietiesService } from './api/varieties.service';
import { PlantsService } from './api/plants.service';
import { FruitsService } from './api/fruits.service';
import { MeasurementsService } from './api/measurements.service';
import { MeansMeasurementsService } from './api/means.service';

const DATA_SERVICES = [
  FieldsService,
  SectorsService,
  SpeciesService,
  VarietiesService,
  PlantsService,
  FruitsService,
  MeasurementsService,
  MeansMeasurementsService,
];

export const NB_CORE_PROVIDERS = [
  ...DATA_SERVICES,

  NbSecurityModule.forRoot(roleConfig).providers,
  { provide: NbRoleProvider, useClass: RoleProvider },
  //{ provide: NbTokenStorage, useClass: NbTokenLocalStorage },

  AnalyticsService,
  LayoutService,
  MeanService,
  StateService,
];

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    NbAuthModule,
  ],
  declarations: [],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    throwIfAlreadyLoaded(parentModule, 'CoreModule');
  }

  static forRoot(): ModuleWithProviders {
    return <ModuleWithProviders>{
      ngModule: CoreModule,
      providers: [
        ...NB_CORE_PROVIDERS,
      ],
    };
  }
}
