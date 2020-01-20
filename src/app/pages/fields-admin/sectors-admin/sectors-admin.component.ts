import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SectorsService } from '../../../@core/api/sectors.service';
import { FieldsService } from '../../../@core/api/fields.service';
import { Field, Sector, ApiResponse } from '../../../@core/api/models';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-smart-table-sector',
  templateUrl: 'sectors-admin.component.html',
  styleUrls: ['sectors-admin.component.scss'],
})
export class SectorsAdminComponent implements OnInit {

  @Input() idField:number;
  @Input() selectFieldOption = true;

  fieldForm: FormGroup;
  subscriptionId: number;
  subscriptionFields: Array<Field>;
  selectedFieldItem: Field;
  selectedFieldName: string;
  isSelectionConfirmed: boolean = false;
  fieldName: string;

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
    },
  };

  source: LocalDataSource = new LocalDataSource();

  fields: Array<Field>;
  sectors: Array<Sector>;
  filteredSectors: Array<Sector>;

  loadSourceData(): void {
    let _this = this;
    this.filteredSectors = Array<Sector>();
    this.selectedFieldName = this.selectedFieldItem.name;
    _this.sectorsService.getSectors().subscribe({
      next(response) {
        for (let i = 0, sectors = response.payload; i < sectors.length; i++) {
          if (sectors[i].fieldId == _this.selectedFieldItem.id) {
            _this.filteredSectors.push(sectors[i]); // add to data source only sectors that belgons to the selected field
          }
        }
        _this.source.load(_this.filteredSectors); // clear data source array.
      }
    });
  };

  constructor(
    private authService: NbAuthService,
    private sectorsService: SectorsService,
    private fieldsService: FieldsService,
    private toastrService: NbToastrService,
    private fb: FormBuilder,
    
  ) { }

  ngOnInit() {
    console.log("Inicio Sector");
    this.fieldForm = this.fb.group({
      fieldCtrl: ['', Validators.required],
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
      this.fieldName = this.selectedFieldItem.name;
      this.isSelectionConfirmed = true;
      this.loadSourceData();
  }

  annulateSelection() {
    this.isSelectionConfirmed = false;
  }

  onCreateConfirm(event): void {
    let _this = this;
    this.sectorsService.createSector({
      id: null,
      name: event.newData.name,
      fieldId: _this.selectedFieldItem.id
    })
      .subscribe({
        next(newSector) {
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
    this.sectorsService.updateSector({
      id: event.newData.id,
      name: event.newData.name,
      fieldId: _this.selectedFieldItem.id
    })
      .subscribe({
        next(newSector) {
          //_this.loadSourceData();
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
    if (window.confirm('¿Está seguro de eliminar este sector? Esto además eliminará las plantas y frutos de observación asociados.')) {
      let _this = this;
      this.sectorsService.deleteSector(event.data.id)
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
}
