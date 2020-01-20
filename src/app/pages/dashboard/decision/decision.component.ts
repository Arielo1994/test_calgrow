import { Component, OnInit } from '@angular/core';

import {NbDialogRef} from '@nebular/theme';



@Component({
  selector: 'ngx-decision',
  templateUrl: './decision.component.html',
  styleUrls: ['./decision.component.scss']
})
export class DecisionComponent implements OnInit {

  tittle;
  content;

  constructor(protected dialogRef: NbDialogRef<DecisionComponent>) { }

  ngOnInit() {
  }

  close(){
    this.dialogRef.close(true);
  }

  closeN(){
    this.dialogRef.close(false);
  }

}
