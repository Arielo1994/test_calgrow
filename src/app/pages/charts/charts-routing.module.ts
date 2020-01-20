import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ChartsComponent } from './charts.component';
// import { ChartjsComponent } from './chartjs/chartjs.component';
import { ComparativeChartComponent } from './comparative-chart/comparative-chart.component';

const routes: Routes = [{
  path: '',
  component: ChartsComponent,
  children: [{
    path: 'comparative',
    component: ComparativeChartComponent,
  }],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ChartsRoutingModule { }

export const routedComponents = [
  ChartsComponent,
];
