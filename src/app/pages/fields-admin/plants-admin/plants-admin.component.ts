import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { Plant, Sector, Field, Specie, Variety, ApiResponse } from '../../../@core/api/models';
import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';
import { FieldsService } from '../../../@core/api/fields.service';
import { SpeciesService } from '../../../@core/api/species.service';
import { VarietiesService } from '../../../@core/api/varieties.service';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-smart-table-plant',
  templateUrl: 'plants-admin.component.html',
  styleUrls: ['plants-admin.component.scss'],
})
export class PlantsAdminComponent implements OnInit {

  @Input() idField:number;
  @Input() selectFieldOption = true;

  fieldForm: FormGroup;
  sectorForm: FormGroup;

  selectedFieldItem;
  selectedSectorItem;
  isSelectionConfirmed: boolean = false;
  speciesConfig: Array<any>;
  varietiesConfig: Array<any> = Array<any>();
  species: Array<Specie> = Array<Specie>();
  varieties: Array<Variety> = Array<Variety>();

  mySettings = {
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
      gps_pos: {
        title: 'Posición GPS',
        type: 'text',
        filter: false,
      },
      /*specie: {
        title: 'Especie',
        type: 'text',
        filter: false,
        editor: {
          type: 'list',
          config: {
            list: []
          },
        },
      },
      variety: {
        title: 'Variedad',
        type: 'text',
        filter: false,
        editor: {
          type: 'list',
          config: {
            list: []
          },
        },
      },*/
    },
  };

  settings = this.mySettings;

  source: LocalDataSource = new LocalDataSource();

  fields: Array<Field>;
  sectors: Array<Sector>;
  plants: Array<Plant>;
  selectedSectorName: string;
  selectedFieldName: any;
  subscriptionId: number;

  loadSourceData(): void {
    let _this = this;
    this.plants = Array<Plant>(); // clear filtered plants.
    this.selectedFieldName = this.selectedFieldItem.name;
    this.selectedSectorName = this.selectedSectorItem.name;
    _this.plantsService.getPlants().subscribe({
      next(response) {
        for (let i = 0, plants = response.payload; i < plants.length; i++) {
          if (plants[i].sectorId == _this.selectedSectorItem.id) {
            _this.plants.push(plants[i]); // add only plants that belgons to the selected sector
          }
        }
        console.log(_this.settings)
        _this.source.load(_this.plants); // load data source array.
      }
    });
    //}
    //})
  };

  constructor(
    private authService: NbAuthService,
    private speciesService: SpeciesService,
    private varietiesService: VarietiesService,
    private plantsService: PlantsService,
    private sectorsService: SectorsService,
    private fieldsService: FieldsService,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit() {
    console.log("Inicio plant");
    this.fieldForm = this.fb.group({
      fieldCtrl: ['', Validators.required],
    });

    this.sectorForm = this.fb.group({
      sectorCtrl: ['', Validators.required],
    });

    if(this.idField){
      this.selectedFieldItem = new Field(); 
      this.selectedFieldItem.id= this.idField;
      this.onFieldSubmit();
    }

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
      let _this = this;
      this.sectors = Array<Sector>();
      this.sectorsService.getSectors().subscribe({
        next(response) {
          for (let i = 0, sectors = response.payload; i < sectors.length; i++) {
            if (sectors[i].fieldId == _this.selectedFieldItem.id) {
              _this.sectors.push(sectors[i]); // add to data source only sectors that belgons to the selected field
            }
          }
        }
      });
  }

  onSectorSubmit() {
    if (this.sectorForm.status === "VALID") {
      this.isSelectionConfirmed = true;
      this.loadSourceData();
    }
  }

  annulateSelection() {
    this.isSelectionConfirmed = false;
  }

  onCreateConfirm(event): void {
    this.plantsService.createPlant({
      id: null,
      name: event.newData.name,
      gps_pos: event.newData.gps_pos,
      sectorId: this.selectedSectorItem.id,
      varietyId: null, //event.newData.variety,
      subscriptionId: this.subscriptionId,
    }).subscribe({
      next: function (newPlant) {
        this.loadSourceData();
        event.confirm.resolve();
      }.bind(this),
      error: function (err) {
          this.toastrService.show(
            err.error.message,
            "Error",
            { position: 'top-right', status: 'danger' });
        }.bind(this)
    });
  };

  onEditConfirm(event): void {
    this.plantsService.updatePlant(event.newData)
      .subscribe({
        next: function (newPlant) {
          this.loadSourceData();
          event.confirm.resolve();
        }.bind(this),
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
      this.plantsService.deletePlant(event.data.id)
        .subscribe({
          next(deletedPlant) {
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
    } else {
      event.confirm.reject();
    }
  }

  /*onRowSelect(event): void {
    console.log(event);
    let _this = this;
    this.varietiesService.getVarieties().subscribe({
      next(response) {
        for (let i = 0, varieties = response.payload; i < varieties.length; i++) {
          if (varieties[i].specieId == _this.selectedSectorItem.id) {
            _this.varieties.push(varieties[i]); // add only varieties that belgons to the selected sector
          }
        }
      }
    })
  }*/
}
