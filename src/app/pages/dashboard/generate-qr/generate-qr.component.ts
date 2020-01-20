import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';
import { Field, Sector, Plant, ApiResponse, Measurement } from '../../../@core/api/models';
import { MeasurementsService } from '../../../@core/api/measurements.service';

/*angular material dialog */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import * as html2canvas from 'html2canvas';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'ngx-generate-qr',
  templateUrl: './generate-qr.component.html',
  styleUrls: ['./generate-qr.component.scss']
})
export class GenerateQrComponent implements OnInit {

  @ViewChild('screen', {static: false}) private screen: ElementRef;
  @ViewChild('canvas', {static: false}) canvas: ElementRef;
  @ViewChild('downloadLink', {static: false}) downloadLink: ElementRef;

  sectorForm: FormGroup;
  plantForm: FormGroup;

  selectedSectorItem: Sector;
  selectedPlantItem: Plant;
  isSelectionConfirmed: boolean = false;


  source: LocalDataSource = new LocalDataSource();
  fields: Array<Field>;
  sectors: Array<Sector>;
  plants: Array<Plant>;

  selectedPlantName: string;
  selectedSectorName: string;
  selectedFieldName: string;
  qrcode: string;
  elementType: string;
  value: string;
  subscriptionId: any;

  constructor(
    private plantsService: PlantsService,
    private sectorsService: SectorsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GenerateQrComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }


  ngOnInit() {

    // INICIALIZO EL OBJETO PARA NO TENER UN ERROR
    this.selectedPlantItem = {
      id: 1,
      name: 'asdfasdf',
      gps_pos: 'aasdf',
      sectorId: 4,
      varietyId: 4,
      subscriptionId: 4,
    }

    this.sectorForm = this.fb.group({
      sectorCtrl: ['', Validators.required],
    });

    this.plantForm = this.fb.group({
      plantCtrl: ['', Validators.required],
    });

    this.onFieldSubmit();
  }

  onFieldSubmit() {
    const selectedFieldItem: Field = this.data.field;
    this.selectedFieldName = selectedFieldItem.name;
      const _this = this;
      this.sectors = Array<Sector>();
      this.sectorsService.getSectors().subscribe({
        next(response) {
          for (let i = 0, sectors: Sector[] = response.payload; i < sectors.length; i++) {
            if (sectors[i].fieldId === selectedFieldItem.id) {
              _this.sectors.push(sectors[i]); // add to data source only sectors that belgons to the selected field
            }
          }
        },
      });
  }

  onSectorSubmit() {
    if (this.sectorForm.status === 'VALID') {
      const _this = this;
      this.plants = Array<Plant>();
      this.plantsService.getPlants().subscribe({
        next(response) {
          for (let i = 0, plants = response.payload; i < plants.length; i++) {
            if (plants[i].sectorId === _this.selectedSectorItem.id) {
              _this.plants.push(plants[i]);
            }
          }
        },
      });
    }
  }

  onPlantSubmit() {
    this.selectedSectorName = this.selectedSectorItem.name;
    if (this.plantForm.status === 'VALID') {
      this.isSelectionConfirmed = true;
      this.selectedPlantName = this.selectedPlantItem.name;

      /* qrcode */
      delete this.selectedPlantItem.varietyId;
      console.log(this.selectedPlantItem);
      this.value = this.selectedPlantItem.id.toString();
      this.elementType = 'json';
    }
  }

  download() {
    let self = this;
      /*HTML2CANVAS*/
    html2canvas(this.screen.nativeElement).then(canvas => {
      self.canvas.nativeElement.src = canvas.toDataURL();
      const img = canvas.toDataURL('image/png');
      const doc = new jsPDF();
      doc.text(this.selectedFieldName,doc.internal.pageSize.getWidth() / 2, 15, null, null, 'center');
      doc.addImage(img, 'PNG',71, 17, 68, 45);
      doc.setFontSize(7.5);
      doc.text('Sector: ' + this.selectedSectorName + '      Planta: ' + this.selectedPlantItem.name + '      Serial: ' + this.selectedPlantItem.id, doc.internal.pageSize.getWidth() / 2, 70, null, null, 'center');
      doc.setFontSize(14);
      doc.text('www.calgrow.cl',doc.internal.pageSize.getWidth() / 2, 78, null, null, 'center');
      doc.save('codigo-qr.pdf');
    });
  }


  annulateSelection() {
    this.isSelectionConfirmed = false;
  }

}
