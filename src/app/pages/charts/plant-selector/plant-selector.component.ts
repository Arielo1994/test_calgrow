import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';
import { FieldsService } from '../../../@core/api/fields.service';
import { Field, Sector, Plant, Fruit, ApiResponse } from '../../../@core/api/models';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';

@Component({
  selector: 'ngx-plant-selector',
  templateUrl: 'plant-selector.component.html',
  styleUrls: ['plant-selector.component.scss'],
})
export class PlantSelectorComponent implements OnInit {

  @Output() fieldAddedEvent = new EventEmitter<number>();
  @Output() sectorAddedEvent = new EventEmitter<number>();
  @Output() plantAddedEvent = new EventEmitter<number>();
  @Output() plantReset = new EventEmitter();
  
  fieldForm: FormGroup;
  sectorForm: FormGroup;
  plantForm: FormGroup;

  selectedFieldItem: Field;
  selectedSectorItem: Sector;
  selectedPlantItem: Plant;
  isSelectionConfirmed: boolean = false;

  fields: Array<Field>;
  sectors: Array<Sector>;
  plants: Array<Plant>;
  fruits: Array<Fruit>;

  selectedPlantName: string;
  selectedSectorName: string;
  selectedFieldName: string;
  subscriptionId: number;

  constructor(
    protected authService: NbAuthService,
    protected plantsService: PlantsService,
    protected sectorsService: SectorsService,
    protected fieldsService: FieldsService,
    protected fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.fieldForm = this.fb.group({
      fieldCtrl: ['', Validators.required],
    });

    this.sectorForm = this.fb.group({
      sectorCtrl: ['', Validators.required],
    });

    this.plantForm = this.fb.group({
      plantCtrl: ['', Validators.required],
    });

    this.authService.getToken().subscribe({
      next: this.getUserFields.bind(this),
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
  }

  onFieldSubmit() {
    if (this.fieldForm.status === "VALID") {
      let _this = this;
      this.sectors = Array<Sector>();
      this.sectorsService.getSectors().subscribe({
        next(response) {
          for (let i = 0, sectors: Sector[] = response.payload; i < sectors.length; i++) {
            if (sectors[i].fieldId == _this.selectedFieldItem.id) {
              _this.sectors.push(sectors[i]); // add to data source only sectors that belgons to the selected field
            }
          }
        }
      });
    }
  }

  onSectorSubmit() {
    console.log('onSectorSubmit called')
    if (this.sectorForm.status === "VALID") {
      let _this = this;
      this.plants = Array<Plant>();
      this.plantsService.getPlants().subscribe({
        next(response) {
          for (let i = 0, plants = response.payload; i < plants.length; i++) {
            if (plants[i].sectorId == _this.selectedSectorItem.id) {
              _this.plants.push(plants[i]); // add to data source only plants that belgons to the selected field
            }
          }
        }
      });
    }
  }

  annulateSelection() {
    this.isSelectionConfirmed = false;
  }

  onFieldAdded() {
    if (this.fieldForm.valid) this.fieldAddedEvent.emit(this.fieldForm.value['fieldCtrl']);
  }
  onSectorAdded() {
    if (this.sectorForm.valid) this.sectorAddedEvent.emit(this.sectorForm.value['sectorCtrl']);
  }
  onPlantAdded() {
    if (this.plantForm.valid) this.plantAddedEvent.emit(this.plantForm.value['plantCtrl']);
  }
  onPlantReset() {
    this.plantReset.emit();
  }
}
