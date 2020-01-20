import { Component, OnInit, Inject } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { NbDialogService } from '@nebular/theme';
import {DecisionComponent} from '../decision/decision.component';

import { FruitsService } from '../../../@core/api/fruits.service';
import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';
import { Field, Sector, Plant, Fruit, ApiResponse, Measurement } from '../../../@core/api/models';
import { MeasurementsService } from '../../../@core/api/measurements.service';

/*angular material dialog */
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-aggmetricas',
  templateUrl: './aggmetricas.component.html',
  styleUrls: ['./aggmetricas.component.scss'],
})
export class AggmetricasComponent implements OnInit {

  measurements = Array<Measurement>();
  measurement: Measurement;

  sectorForm: FormGroup;
  plantForm: FormGroup;
  fruitForm: FormGroup;
  metricas: FormGroup;

  selectedSectorItem: Sector;
  selectedPlantItem: Plant;
  selectedFruitItem: Fruit;
  isSelectionConfirmed: boolean = false;


  source: LocalDataSource = new LocalDataSource();
  fields: Array<Field>;
  sectors: Array<Sector>;
  plants: Array<Plant>;
  fruits: Array<Fruit>;

  selectedFruitName: string;
  selectedPlantName: string;
  selectedSectorName: string;
  selectedFieldName: string;
  subscriptionId: any;

  constructor(
    private fruitsService: FruitsService,
    private plantsService: PlantsService,
    private sectorsService: SectorsService,
    private measurementsService: MeasurementsService,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AggmetricasComponent>,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    @Inject(MAT_DIALOG_DATA) public data,
  ) { }


  ngOnInit() {
    this.sectorForm = this.fb.group({
      sectorCtrl: ['', Validators.required],
    });

    this.plantForm = this.fb.group({
      plantCtrl: ['', Validators.required],
    });

    this.fruitForm = this.fb.group({
      fruitCtrl: ['', Validators.required],
    });

    this.metricas = this.fb.group({
      ecuatorial: new FormControl( null , Validators.required),
      polar: new FormControl( null , Validators.required),
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
              _this.plants.push(plants[i]); // add to data source only plants that belgons to the selected field
            }
          }
        },
      });
    }
  }

  onPlantSubmit() {
    this.selectedSectorName = this.selectedSectorItem.name;
    this.selectedPlantName = this.selectedPlantItem.name;
    if (this.plantForm.status === 'VALID') {
        const _this = this;
        this.fruits = Array<Fruit>();
        this.fruitsService.getFruits().subscribe({
          next(response) {
            for (let i = 0, fruits = response.payload; i < fruits.length; i++) {
              if (fruits[i].plantId === _this.selectedPlantItem.id) {
                _this.fruits.push(fruits[i]); // add only fruits that belgons to the selected sector
              }
            }
          },
        });
    }
  }
/* REVISAR*/
  onFruitSubmit() {
    if (this.plantForm.status === 'VALID') {
      this.selectedFruitName = this.selectedFruitItem.name;

      if (this.selectedFruitName !== '') {
        this.isSelectionConfirmed = true;

        this.getMeasurements();

      }
    }
  }

  getMeasurements() {
    this.measurementsService.getMeasurements().subscribe( (response: ApiResponse) => {
      this.measurements = Array<Measurement>();
      response.payload.forEach((measurement: Measurement) => {
        if (measurement.fruitId === this.selectedFruitItem.id) {
          this.measurements.push(measurement);
        }
      });
    });
  }
  annulateSelection() {
    this.isSelectionConfirmed = false;
  }

  onMetricasSubmit() {

    if(this.measurements[this.measurements.length - 1] === undefined){
      this.metricas.value.ecuatorial = this.metricas.value.ecuatorial.replace(",", ".");
      this.metricas.value.polar = this.metricas.value.polar.replace(",", ".");


      this.measurementsService.createMeasurement({
        id: null,
        ecuatorial_length: this.metricas.value.ecuatorial,
        polar_length: this.metricas.value.polar,
        fruitId: this.selectedFruitItem.id,
        createdAt: null,
      }).subscribe({
        next: function (newMetric) {
          this.dialogRef.close(true);
          this.toastrService.show(
            newMetric.id,
            "Metrica Agregada",
            { position: 'top-right', status: 'success' });
        }.bind(this),
        error: function (err) {
          this.toastrService.show(
            err,
            "Algo salio mal",
            { position: 'top-right', status: 'danger' });
        }.bind(this)
      });

      return;
    }
    let anterior = this.measurements[this.measurements.length - 1];

    this.metricas.value.ecuatorial = this.metricas.value.ecuatorial.replace(",", ".");
    this.metricas.value.polar = this.metricas.value.polar.replace(",", ".");

    let total = this.metricas.value.ecuatorial* this.metricas.value.polar;
    let total2 = anterior.ecuatorial_length * anterior.polar_length;

    if (total < total2) {

        //DIALOG
        this.dialogService.open(DecisionComponent, {context: {tittle: 'Atención', content: 'La metricá agregada es menor a la anterior. ¿Desea Ingresarla de todas formas?'}}).onClose.subscribe({
          next: function (decision) {
            if (decision) {
              this.measurementsService.createMeasurement({
                id: null,
                ecuatorial_length: this.metricas.value.ecuatorial,
                polar_length: this.metricas.value.polar,
                fruitId: this.selectedFruitItem.id,
                createdAt: null,
              }).subscribe({
                next: function (newMetric) {
                  this.dialogRef.close(true);
                  this.toastrService.show(
                    newMetric.id,
                    "Metrica Agregada",
                    { position: 'top-right', status: 'success' });
                }.bind(this),
                error: function (err) {
                  this.toastrService.show(
                    err,
                    "Algo salio mal",
                    { position: 'top-right', status: 'danger' });
                }.bind(this)
              });
            }
        }.bind(this)},
        );
    }else {
      this.measurementsService.createMeasurement({
        id: null,
        ecuatorial_length: this.metricas.value.ecuatorial,
        polar_length: this.metricas.value.polar,
        fruitId: this.selectedFruitItem.id,
        createdAt: null,
      }).subscribe({
        next: function (newMetric) {
          this.dialogRef.close(true);
          this.toastrService.show(
            newMetric.id,
            "Metrica Agregada",
            { position: 'top-right', status: 'success' });
        }.bind(this),
        error: function (err) {
          this.toastrService.show(
            err,
            "Algo salio mal",
            { position: 'top-right', status: 'danger' });
        }.bind(this)
      });
    }

  }

  keyPress(event: any) {
    const pattern = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ','];
    const inputChar = String.fromCharCode(event.charCode);
    let x = pattern.indexOf(inputChar);

    if (x === -1) {
        // invalid character, prevent input
        event.preventDefault();
    }
}

}
