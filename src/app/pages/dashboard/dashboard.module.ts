import { NgModule } from '@angular/core';
import {
  NbButtonModule,
  NbCardModule,
  NbUserModule,
  NbIconModule,
  NbSelectModule,
  NbInputModule,
  NbTableModule,
  NbTabsetModule,
  NbActionsModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbRadioModule,
  NbTreeGridModule,
  NbStepperModule,
  NbListModule,
  NbDialogModule,
  NbAlertModule,
  NbToastrModule
} from '@nebular/theme';

import { NgxQRCodeModule } from 'ngx-qrcode2';

/* ANGULAR MATERIALS*/
import {MatDialogModule, MatDialogRef} from '@angular/material';
import { MatFormFieldModule, MatInputModule } from '@angular/material';

/* Predefine */

import { ChartModule } from 'angular2-chartjs';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { RouterModule } from '@angular/router';
import { LastmeasurementsComponent } from './lastmeasurements/lastmeasurements.component';

/*Entry Components*/
import { AggmetricasComponent } from './aggmetricas/aggmetricas.component';
import { ChartDashboardComponent } from './chart-dashboard/chart-dashboard.component';
import { CreateFieldComponent } from './create-field/create-field.component';
import { FieldsModule } from '../fields-admin/fields.module';
import { FieldsManagementModule } from '../fields-management/fields-management.module';
import { AgmCoreModule } from '@agm/core';
import { GenerateQrComponent } from './generate-qr/generate-qr.component';
import { WeatherComponent } from './weather/weather.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatSortModule, } from '@angular/material';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

/*PIPE*/
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { DecisionComponent } from './decision/decision.component';

registerLocaleData(localeFr, 'fr');



@NgModule({
  imports: [
    NgxChartsModule,
    NbStepperModule,
    ChartModule,
    RouterModule,
    FormsModule,
    ThemeModule,
    NbInputModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbIconModule,
    NbSelectModule,
    NbTabsetModule,
    MatDialogModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    NbActionsModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbInputModule,
    NbRadioModule,
    NbTreeGridModule,
    MatFormFieldModule,
    MatInputModule,
    NbStepperModule,
    NbListModule,
    NbAlertModule,
    Ng2SmartTableModule,
    MatButtonModule,
    ReactiveFormsModule,
    FieldsModule,
    FieldsManagementModule,
    NbToastrModule.forRoot(),
    NbDialogModule.forChild(),
    NbDatepickerModule.forRoot(),
    FieldsModule,
    NgxQRCodeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBS6_4xgnglXNo-pxeAJfmgOoGl3ZgdqGo',
      libraries: ['places'],
    })
    
  ],
  declarations: [
    DashboardComponent,
    LastmeasurementsComponent,
    AggmetricasComponent,
    ChartDashboardComponent,
    CreateFieldComponent,
    GenerateQrComponent,
    WeatherComponent,
    DecisionComponent,
  ],
  entryComponents: [
    AggmetricasComponent,
    CreateFieldComponent,
    GenerateQrComponent,
    DecisionComponent,
  ],
  providers: [
    {provide: MatDialogRef, useValue: {}},
  ],


})
export class DashboardModule { }
