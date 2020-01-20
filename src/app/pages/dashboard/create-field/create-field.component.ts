import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { Field } from '../../../@core/api/models';




@Component({
  selector: 'ngx-create-field',
  templateUrl: './create-field.component.html',
  styleUrls: ['./create-field.component.scss']
})
export class CreateFieldComponent implements OnInit {
  
  field: Field;
  indexStep = 0;
  plantStep = false;
  fruitStep = false;


  constructor(protected ref: NbDialogRef<CreateFieldComponent>){
  }

  setField(event) {
    this.field = event.newField;
    this.indexStep = 1;
  }
  setSector() {
    this.plantStep = true;
    this.indexStep = 2;
  }

  setPlant() {
    this.fruitStep = true;
    this.indexStep = 3;
  }


  close(){
    this.ref.close(Field);
  }

  ngOnInit(){
    
  }
}



