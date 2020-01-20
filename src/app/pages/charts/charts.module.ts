import { NgModule } from '@angular/core';
import { ChartModule } from 'angular2-chartjs';
import { NbListModule, NbCheckboxModule,NbCardModule, NbDatepickerModule, NbStepperModule, NbSelectModule, NbButtonModule, NbTreeGridModule } from '@nebular/theme';

import { ThemeModule } from '../../@theme/theme.module';

import { ChartsRoutingModule, routedComponents } from './charts-routing.module';
import { ChartjsMultipleXaxisComponent } from './chartjs/chartjs-multiple-xaxis.component';
import { PlantSelectorComponent } from './plant-selector/plant-selector.component';
import { ChartjsComponent } from './chartjs/chartjs.component';
import { ComparativeChartComponent } from './comparative-chart/comparative-chart.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// const components = [
//   ChartjsMultipleXaxisComponent,
//   PlantSelectorComponent,
// ];

const components = [
  ComparativeChartComponent,
  ChartjsMultipleXaxisComponent,
  PlantSelectorComponent,
  ChartjsComponent
];

@NgModule({
  imports: [
    ThemeModule,
    ChartsRoutingModule,
    ChartModule,
    NbCardModule,
    NbDatepickerModule,
    NbStepperModule,
    FormsModule,
    ReactiveFormsModule,
    NbSelectModule,
    NbButtonModule,
    NbTreeGridModule,
    NbCheckboxModule,
    NbListModule
  ],
  declarations: [...routedComponents, ...components],
})
export class ChartsModule {}
