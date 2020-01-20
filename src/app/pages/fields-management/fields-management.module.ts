import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldComponent } from './field/field.component';
import { AgmCoreModule } from '@agm/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NbInputModule, NbButtonModule, NbToastrModule, NbSelectComponent, NbSelectModule, NbCardModule } from '@nebular/theme';

@NgModule({
  declarations: [
    FieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NbInputModule,
    NbSelectModule,
    NbCardModule,
    NbButtonModule,
    NbToastrModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBS6_4xgnglXNo-pxeAJfmgOoGl3ZgdqGo',
      libraries: ['places'],
    }),
  ],
  exports:[
    FieldComponent
  ]
})
export class FieldsManagementModule { }
