import { Component, OnChanges, OnInit,  Input, ViewChild, Inject } from '@angular/core';
import { NbAuthJWTToken, NbAuthService } from '@nebular/auth';

/*SERVICES*/
import { MeasurementsService } from '../../../@core/api/measurements.service';
import { FruitsService } from '../../../@core/api/fruits.service';
import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';

import { NbDialogService } from '@nebular/theme';
import { NbToastrService } from '@nebular/theme';

import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource, MatTable, MatSort } from '@angular/material';

/*MODELS*/
import { Field, Sector, Plant, Fruit, ApiResponse, Measurement } from '../../../@core/api/models';


import {DecisionComponent} from '../decision/decision.component';

interface User {
  id: number;
  name: string;
  role: string;
  subscription: string;
  picture?: string;
  }

@Component({
  selector: 'ngx-lastmeasurements',
  templateUrl: './lastmeasurements.component.html',
  styleUrls: ['./lastmeasurements.component.scss'],
})



export class LastmeasurementsComponent implements OnChanges, OnInit {
  @Input() field: Field;
  @ViewChild('dataTable', {static: false}) dataTable: MatTable<any>;

  displayedColumns: string[] = ['user', 'ecuatorial_length', 'polar_length', 'sector', 'plant', 'name', 'createdAt', 'delete'];

  measurements = Array<Measurement>();
  fruits = Array<Fruit>();
  plants = Array<Plant>();
  sectors = Array<Sector>();
  measurementsId = [];
  measurement: Measurement;
  fruitsId = [];
  sectorsId = [];
  plantsId = [];

  user: User;

  dataSource = new MatTableDataSource<Measurement>();

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private fruitsService: FruitsService,
    private plantsService: PlantsService,
    private sectorsService: SectorsService,
    private measurementsService: MeasurementsService,
    private authService: NbAuthService,
    private toastrService: NbToastrService,
    private dialogService: NbDialogService,
    ) {
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngOnInit() {
    this.getInit();
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
        }
      });

      

  }


  ngOnChanges() {
    this.measurements = Array<Measurement>();
    this.fruits = Array<Fruit>();
    this.measurementsId = [];
    this.fruitsId = [];
    this.sectorsId = [];
    this.plantsId = [];
    this.getInit();
    this.authService.getToken()
      .subscribe((token: NbAuthJWTToken) => {
        if (token.isValid()) {
          this.user = token.getPayload();
        }
      });

      this.dataSource.sort = this.sort;
  }

  doFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
    console.log(this.dataSource);
  }

  getMeasurements(response: ApiResponse) {
    this.measurements = Array<Measurement>();
    response.payload.forEach((measurement: Measurement) => {
      let x = this.fruitsId.indexOf(measurement.fruitId);
      if (x !== -1) {
        measurement.name = this.fruits[x].name;
        let y = this.plantsId.indexOf(this.fruits[x].plantId);
        measurement.plant = this.plants[y].name;
        let z = this.sectorsId.indexOf(this.plants[y].sectorId);
        measurement.sector = this.sectors[z].name;
        measurement.user = this.user.name;
        this.measurements.push(measurement);
      }
      this.dataSource = new MatTableDataSource<Measurement>(this.measurements);

      /* configure filter */
      this.dataSource.filterPredicate = (data: Measurement, filter: string) => {
        var expr = 'h';
        let buscado = data.user.toLowerCase();
        let a = buscado.indexOf(filter) != -1;
        if (a) {
          expr = 'a';
        }

        let buscado1 = data.plant.toLowerCase();
        let b = buscado1.indexOf(filter) != -1;
        if(b) {
          expr = 'b';
        }

        let buscado2 = data.sector.toLowerCase();
        let c = buscado2.indexOf(filter) != -1;
        if(c) {
          expr = 'c';
        }

        let buscado3 = data.name.toLowerCase();
        let d = buscado3.indexOf(filter) != -1;
        if(d) {
          expr = 'd';
        }

        let buscado4 = data.polar_length.toString();
        let f = buscado4.indexOf(filter) != -1;
        if(f) {
          expr = 'f';
        }

        let buscado5 = data.ecuatorial_length.toString();
        let g = buscado5.indexOf(filter) != -1;
        if(g) {
          expr = 'g';
        }



        switch (expr) {
          case 'a':
            return true;
          case 'b':
            return true;
          case 'c':
            return true;
          case 'd':
            return true;
          case 'e':
            return true;
          case 'f':
            return true;
          case 'g':
            return true;
          default:
            return false;
        }
      }

      /**/


      if (this.dataSource) {
            this.dataTable.renderRows();
            this.dataSource.paginator = this.paginator;
      }
      this.sorting();
      this.dataSource.sort = this.sort;

    });
  }

  getFruits(response: ApiResponse) {
    this.fruits = Array<Fruit>();
    response.payload.forEach((fruit: Fruit) => {
      const x = this.plantsId.indexOf(fruit.plantId);
      if (x !== -1) {
        this.fruits.push(fruit);
        this.fruitsId.push(fruit.id);
      }
    });

    this.measurementsService.getMeasurements().subscribe({
      next: this.getMeasurements.bind(this),
    });
  }

  getPlants(response: ApiResponse) {
    this.plants = Array<Plant>();
    response.payload.forEach((plant: Plant) => {
      const x = this.sectorsId.indexOf(plant.sectorId);
      if (x !== -1) {
        this.plantsId.push(plant.id);
        this.plants.push(plant);
      }
    });

    this.fruitsService.getFruits().subscribe({
      next: this.getFruits.bind(this),
    });
  }

  getSectors(response: ApiResponse) {
    this.sectors = Array<Sector>();
    const fieldId = this.field.id;

    response.payload.forEach((sector: Sector) => {
      if (fieldId === sector.fieldId) {
        this.sectorsId.push(sector.id);
        this.sectors.push(sector);
      }
    });

    this.plantsService.getPlants().subscribe({
      next: this.getPlants.bind(this),
    });
  }

  getInit() {
    this.sectorsService.getSectors().subscribe({
      next: this.getSectors.bind(this),
    });
  }

  sorting() {
    this.measurements.sort(function(a, b) {
      const x = new Date(a.createdAt);
      const y = new Date(b.createdAt);
      return x > y ? -1 : x < y ? 1 : 0;
  });
  }

  deleteM(id: number) {
    var measurementsService = this.measurementsService;
    this.dialogService.open(DecisionComponent, {context: {tittle: 'Atención', content: '¿Esta seguro de eliminar este elemento?'}}).onClose.subscribe({
      next: function (decision) {
        if (decision) {
          console.log(measurementsService);
            measurementsService.deleteMeasurement(id).subscribe({
              next: function () {
              }.bind(this),
              error: function (err) {
              }.bind(this)
            });
        }
        
    }});
    setTimeout(() => {
      this.measurements = Array<Measurement>();
      this.fruits = Array<Fruit>();
      this.measurementsId = [];
      this.fruitsId = [];
      this.sectorsId = [];
      this.plantsId = [];
      this.getInit();
    }, 3000);
}
}
