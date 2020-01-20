import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { NbAccessChecker } from '@nebular/security';
import { NbThemeService, NbColorHelper, NbDialogService, NbToastrService } from '@nebular/theme';
import { FruitsService } from '../../@core/api/fruits.service';
import { ApiResponse, Field } from '../../@core/api/models';
import { FieldsService } from '../../@core/api/fields.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { concat } from 'rxjs';
import { rgb } from 'd3-color';


/* Angular */
import {MatDialog, MatDialogConfig} from '@angular/material';

/* Entry Components*/
import { AggmetricasComponent } from './aggmetricas/aggmetricas.component';
import { GenerateQrComponent } from './generate-qr/generate-qr.component';

import { id } from '@swimlane/ngx-charts/release/utils';
import { CreateFieldComponent } from './create-field/create-field.component';
//import {  } from '';

interface CardSettings {
  title: string;
  icon: string;
  type: string;
  link: string;
  function: string;
}

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnDestroy, OnInit {

  // FIELDS
  fieldForm: FormGroup;
  fields: Array<Field>;
  selectedFieldName: string;
  selectedFieldItem: Field;
  item: Field;
  subscriptionId: Number;
  alert: boolean;

  lat: number = 51.673858;
  lng: number = 7.815982;
  zoom: number = 12;

  private alive = true;

  card1: CardSettings = {
    title: 'Agregar Medición',
    icon: 'edit-2-outline',
    type: 'primary',
    link: '',
    function: 'openaggmetricas',
  };
  card2: CardSettings = {
    title: 'Generar QR Planta',
    icon: 'printer-outline',
    type: 'primary',
    link: '',
    function: 'openGenerateqr',
  };
  card3: CardSettings = {
    title: 'Agregar usuario',
    icon: 'person-add-outline',
    type: 'primary',
    link: '/auth/adduser',
    function: '',
  };
  card4: CardSettings = {
    title: 'Generar Informes',
    icon: 'file-text-outline',
    type: 'primary',
    link: '/pages/charts/comparative',
    function: '',
  };
  card5: CardSettings = {
    title: 'Agregar Campo',
    icon: 'pin-outline',
    type: 'primary',
    link: '',
    function:'openCreateField'
  };

  // Clicks Funtions
  handleClick(method: string) {
    switch (method) {
      case 'openaggmetricas':
        this.openaggmetricas();
      break;
      case 'openCreateField':
        this.openCreateField();
      break; 
        break;
      case 'openGenerateqr':
        this.openGenerateqr();
        break;
      default:
        break;
 }
}

  statusCards;

  commonStatusCardsSet: CardSettings[] = [];

  userRole: number;

  constructor(
    private authService: NbAuthService,
    private accessChecker: NbAccessChecker,
    private fruitsService: FruitsService,
    private fieldsService: FieldsService,
    private dialog: MatDialog,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    private dialogService: NbDialogService,
    ) {
      
    }

  ngOnInit() {

    this.fieldForm = this.fb.group({
      fieldCtrl: ['', Validators.required],
    });

    this.statusCards = this.commonStatusCardsSet;
    this.authService.getToken().subscribe({
      next: function (token: NbAuthJWTToken) {
        this.userRole = token.getPayload().role;     
      }.bind(this)
    });

    this.authService.getToken().subscribe({
      next: this.getUserFields.bind(this),
    });

    

    this.accessChecker.isGranted('create', 'users').subscribe(canCreateUser => {
      this.commonStatusCardsSet.push(this.card1);
      if (canCreateUser) {
        this.commonStatusCardsSet.push(this.card2);
        this.commonStatusCardsSet.push(this.card3);
        this.commonStatusCardsSet.push(this.card4);
        this.commonStatusCardsSet.push(this.card5);
      }
    });
  }

  getUserFields(token: NbAuthJWTToken) {
    this.subscriptionId = token.getPayload().subscriptionId;
    this.fieldsService.getFields().subscribe({
      next: this.getFields.bind(this),
    });
  }

  getFields(response: ApiResponse) {
    this.fields = Array<Field>();
    response.payload.forEach((field: Field) => {
      if (field.subscriptionId === this.subscriptionId) {
        this.fields.push(field);
      }
    });
    this.selectedFieldItem = this.fields[this.fields.length-1];
    this.updateGPS(this.selectedFieldItem);    
  }

  updateGPS(field: Field){
    let coordinates = field.gps_pos.split(",");
    this.lat = parseFloat(coordinates[0]);
    this.lng = parseFloat(coordinates[1]);
  }

  openaggmetricas(){
    let alert: boolean;
    this.item = this.selectedFieldItem;
    

    /* POP UP */
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.data = {
      field: this.selectedFieldItem,
    };
    const dialogRef = this.dialog.open(AggmetricasComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      let currentField = this.selectedFieldItem;
      
        this.selectedFieldItem = {
          id: 2000,
          name: 'campo',
          subscriptionId: 2000,
          gps_pos: '-34.57224388, -58.43931932',
        };
        setTimeout(() => {
          this.selectedFieldItem = currentField;
     }, 1000);
      
    });


    /*ACTIVATING THE ALERT*/
    this.alert = alert;
  }

  onClose() {
    this.alert= false;
    /*GIVING THE ORIGINAL VALUE TO THE FIELD FOR REALOADING THE TABLE*/
    this.selectedFieldItem = this.item;
  }

  openGenerateqr() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.panelClass = '.panel';
    dialogConfig.data = {
      field: this.selectedFieldItem,
    };
    this.dialog.open(GenerateQrComponent, dialogConfig);
  }

  openCreateField() {
    this.selectedFieldItem = null;
    this.dialogService.open(CreateFieldComponent, {})
              .onClose.subscribe(name => { 
                this.authService.getToken().subscribe({
                  next: this.getUserFields.bind(this),
                });
              });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
