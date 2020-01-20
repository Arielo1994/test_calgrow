import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { FieldsService } from '../../../@core/api/fields.service';
import { Field, ApiResponse } from '../../../@core/api/models';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-smart-table',
  templateUrl: './fields-admin.component.html',
  styleUrls: ['./fields-admin.component.scss'],
})
export class FieldsAdminComponent implements OnInit {

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
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  subscriptionId: number;
  subscriptionFields: Array<Field> = Array<Field>();

  constructor(
    private fieldsService: FieldsService,
    private authService: NbAuthService,
    private toastrService: NbToastrService
  ) { }

  ngOnInit() {
    this.authService.getToken().subscribe({
      next: function (token: NbAuthJWTToken) {
        this.subscriptionId = token.getPayload().subscriptionId;
        this.loadSourceData();
      }.bind(this),
    });
  }

  loadSourceData(): void {
    this.subscriptionFields = Array<Field>();
    this.fieldsService.getFields().subscribe({
      next: function (response: ApiResponse) {
        response.payload.forEach((field: Field) => {
          if (field.subscriptionId === this.subscriptionId) {
            this.subscriptionFields.push(field);
          }
        });
        this.source.load(this.subscriptionFields);
      }.bind(this),
    });
  };

  onCreateConfirm(event): void {
    this.fieldsService.createField({
      name: event.newData.name,
      subscriptionId: this.subscriptionId,
      gps_pos: '0'
    }).subscribe({
        next: function (newField) {
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
    let _this = this;
    this.fieldsService.updateField(event.newData)
      .subscribe({
        next(newField) {
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
  };

  onDeleteConfirm(event): void {
    if (window.confirm('¿Está seguro de eliminar este campo? Esto además eliminará todos los sectores, plantas y frutos de obsercación asociados.')) {
      let _this = this;
      this.fieldsService.deleteField(event.data.id)
        .subscribe({
          next(newField) {
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
};
