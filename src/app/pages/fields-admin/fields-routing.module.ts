import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FieldsComponent } from './fields.component';

import { FieldsAdminComponent } from './fields-admin/fields-admin.component';
import { SectorsAdminComponent } from './sectors-admin/sectors-admin.component';
import { PlantsAdminComponent } from './plants-admin/plants-admin.component';
import { FruitsAdminComponent } from './fruits-admin/fruits-admin.component';
import { SpeciesAdminComponent } from './species-admin/species-admin.component';

const routes: Routes = [
  {
    path: '',
    component: FieldsComponent,
    children: [
      {
        path: 'fields',
        component: FieldsAdminComponent,
      },
      {
        path: 'sectors',
        component: SectorsAdminComponent,
      },
      {
        path: 'species',
        component: SpeciesAdminComponent,
      },
      {
        path: 'plants',
        component: PlantsAdminComponent,
      },
      {
        path: 'fruits',
        component: FruitsAdminComponent,
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class FieldsRoutingModule { }

export const routedComponents = [
  FieldsComponent,
  FieldsAdminComponent,
  SectorsAdminComponent,
  SpeciesAdminComponent,
  PlantsAdminComponent,
  FruitsAdminComponent
];

