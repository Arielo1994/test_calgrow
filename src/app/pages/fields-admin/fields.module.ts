import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbInputModule,
  NbRadioModule,
  NbSelectModule,
  NbUserModule,
  NbIconModule,
  NbTreeGridModule,
  NbStepperModule,
  NbListModule,
} from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FieldsRoutingModule, routedComponents } from './fields-routing.module';

@NgModule({
  imports: [
    ThemeModule,
    NbIconModule,
    NbInputModule,
    NbCardModule,
    NbButtonModule,
    NbActionsModule,
    NbUserModule,
    NbCheckboxModule,
    NbRadioModule,
    NbDatepickerModule,
    FieldsRoutingModule, //routing
    NbSelectModule,
    Ng2SmartTableModule,
    NbTreeGridModule,
    //stepper
    FormsModule,
    ReactiveFormsModule,
    NbStepperModule,
    NbListModule
  ],
  declarations: [
    ...routedComponents,
  ],
  exports: [
    ...routedComponents
  ]
})
export class FieldsModule { }
