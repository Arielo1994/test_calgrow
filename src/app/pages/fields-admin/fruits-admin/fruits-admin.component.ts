import { Component, OnInit, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { FruitsService } from '../../../@core/api/fruits.service';
import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';
import { FieldsService } from '../../../@core/api/fields.service';
import { Field, Sector, Plant, Fruit, ApiResponse } from '../../../@core/api/models';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-smart-table-fruit',
  templateUrl: 'fruits-admin.component.html',
  styleUrls: ['fruits-admin.component.scss'],
})
export class FruitsAdminComponent implements OnInit {

  @Input() idField:number;
  @Input() selectFieldOption = true;
  
  fieldForm: FormGroup;
  sectorForm: FormGroup;
  plantForm: FormGroup;

  selectedFieldItem: Field;
  selectedSectorItem: Sector;
  selectedPlantItem: Plant;
  isSelectionConfirmed: boolean = false;

  settings = {
    actions: {
      columnTitle: 'Opciones',
      position: 'right',
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      name: {
        title: 'Nombre',
        type: 'text',
      },
      fruitPlantId: {
        title: 'Número de Fruto',
        type: 'text'
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  fields: Array<Field>;
  sectors: Array<Sector>;
  plants: Array<Plant>;
  fruits: Array<Fruit>;

  selectedPlantName: string;
  selectedSectorName: string;
  selectedFieldName: string;
  subscriptionId: any;

  loadSourceData(): void {
    let _this = this;
    this.fruits = Array<Fruit>(); // clear filtered fruits.
    this.selectedFieldName = this.selectedFieldItem.name;
    this.selectedSectorName = this.selectedSectorItem.name;
    this.selectedPlantName = this.selectedPlantItem.name;

    if(this.idField){
      this.selectedFieldItem = new Field(); 
      this.selectedFieldItem.id= this.idField;
      this.onFieldSubmit();
    }

    this.fruitsService.getFruits().subscribe({
      next(response) {
        for (let i = 0, fruits = response.payload; i < fruits.length; i++) {
          if (fruits[i].plantId == _this.selectedPlantItem.id) {
            _this.fruits.push(fruits[i]); // add only fruits that belgons to the selected sector
          }
        }
        _this.source.load(_this.fruits); // load data source array.
      }
    });
  };

  constructor(
    private authService: NbAuthService,
    private fruitsService: FruitsService,
    private plantsService: PlantsService,
    private sectorsService: SectorsService,
    private fieldsService: FieldsService,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log("Inicio fruit");
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

    if(this.idField){
      this.selectedFieldItem = new Field(); 
      this.selectedFieldItem.id= this.idField;
      this.onFieldSubmit();
    }
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

  onSectorSubmit() {
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

  onPlantSubmit() {
    if (this.plantForm.status === "VALID") {
      this.isSelectionConfirmed = true;
      this.loadSourceData();
    }
  }

  annulateSelection() {
    this.isSelectionConfirmed = false;
  }

  onCreateConfirm(event): void {
    let _this = this;
    this.fruitsService.createFruit({
      id: null,
      name: event.newData.name,
      plantId: _this.selectedPlantItem.id,
      fruitPlantId: event.newData.fruitPlantId,
    }).subscribe({
      next(newFruit) {
        _this.loadSourceData();
        event.confirm.resolve();
      },
      error: function (err) {
          this.toastrService.show(
            err.error.message,
            "Error",
            { position: 'top-right', status: 'danger' });
        }.bind(this)
    });
  };

  onEditConfirm(event): void {
    let _this = this;
    this.fruitsService.updateFruit({
      id: event.newData.id,
      name: event.newData.name,
      plantId: _this.selectedPlantItem.id,
      fruitPlantId: event.newData.fruitPlantId,
    }).subscribe({
      next(newFruit) {
        _this.loadSourceData();
        event.confirm.resolve();
      },
      error: function (err) {
          this.toastrService.show(
            err.error.message,
            "Error",
            { position: 'top-right', status: 'danger' });
        }.bind(this)
    });
  };

  onDeleteConfirm(event): void {
    if (window.confirm('¿Está seguro de eliminar esta planta? Esto eliminará los frutos de observación asociados')) {
      let _this = this;
      this.fruitsService.deleteFruit(event.data.id)
        .subscribe({
          next(deletedFruit) {
            _this.loadSourceData();
            event.confirm.resolve();
          },
          error(err) {
            this.toastrService.show(
              err.error.message,
              "Error",
              { position: 'top-right', status: 'danger' });
          }
        });
    } else {
      event.confirm.reject();
    }
  }
}
