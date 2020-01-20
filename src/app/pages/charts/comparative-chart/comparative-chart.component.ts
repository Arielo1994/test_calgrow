import { Component, OnInit} from '@angular/core';
import { FieldsService } from '../../../@core/api/fields.service';
import { FruitsService } from '../../../@core/api/fruits.service';
import { MeasurementsService } from '../../../@core/api/measurements.service';
import { MeansMeasurementsService } from '../../../@core/api/means.service';
import { PlantsService } from '../../../@core/api/plants.service';
import { SectorsService } from '../../../@core/api/sectors.service';
import { rgb } from 'd3-color';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { Field, Sector, Plant, Fruit, ApiResponse } from '../../../@core/api/models';
import { forkJoin } from 'rxjs';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface TableRow {
  campo? :string;
  sector? :string;
  planta? :string;
  fruta?  :string;
  kind? :string;
  id: string;
  model_type: string;
  checked: boolean;
}


@Component({
  selector: 'ngx-comparative-chart-selector',
  templateUrl: 'comparative-chart.component.html',
  styleUrls: ['comparative-chart.component.scss'],
})
export class ComparativeChartComponent implements OnInit{
 
  subscriptionId: number;
  fields: Array<Field>;
  sectors: Array<Sector>;
  plants: Array<Plant>;
  fruits: Array<Fruit>;
  // means; Array<Mean>;
  chartData = [];
  currentChartData = [];

  defaultColumns = [ 'campo', 'sector', 'fruta' ];
  allColumns = [ ...this.defaultColumns];

  selectedRows: TableRow[] = [];

  data: TreeNode<TableRow>[] = [];
  // [
  //   {
  //     data: {campo:"SAN LUCAS", sector:"", planta:"", fruta:"", kind: "dir", model_type: "campo", id:"1", checked: false},
  //     children: [
  //       {
  //         data: {campo: "", sector: "Sector 1", planta: "", fruta: "", kind: "dir",  model_type: "sector", id:"1", checked: false},
  //         children:[
  //           {
  //             data: {campo: "", sector: "", planta: "Planta1", fruta: "", kind: "dir",  model_type: "planta", id:"1", checked: false},
  //             children:[
  //               {
  //                 data: {campo: "", sector: "", planta: "", fruta: "fruta1", kind: "no_dir", model_type: "fruta", id:"1", checked: false},
  //                 children: []
  //               },
  //               {
  //                 data: {campo: "", sector: "", planta: "", fruta: "fruta2", kind: "no_dir", model_type: "fruta", id:"2", checked: false},
  //                 children: []
  //               },
  //               {
  //                 data: {campo: "", sector: "", planta: "", fruta: "fruta3", kind: "no_dir", model_type: "fruta", id:"3", checked: false},
  //                 children: []
  //               }
  //             ]
  //           },
  //           {
  //             data: {campo: "", sector: "", planta: "Planta2", fruta: "", kind: "dir",  model_type: "planta", id:"2", checked: false},
  //             children:[
  //               {
  //                 data: {campo: "", sector: "", planta: "", fruta: "fruta4", kind: "no_dir", model_type: "fruta", id:"4", checked: false},
  //                 children: []
  //               }
  //             ]
  //           }
  //         ]
  //       },
  //     ]
  //   }
  // ]

  data_chart: { labels: Array<any>, datasets: Array<any> };
  
  chart_options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: true,
            color: '#edf1f7',
          },
          ticks: {
            fontColor: 'grey',
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: 'grey',
            callback: (value, index, values) => value + ' mm'
          },
          gridLines: {
            display: true,
            color: '#edf1f7',
          },            
        },
      ],
    },
    legend: {
      labels: {
        fontColor: 'grey',
      },
    },
  };

  constructor(
    protected authService: NbAuthService,
    protected plantsService: PlantsService,
    protected sectorsService: SectorsService,
    protected fieldsService: FieldsService,
    protected fruitsService: FruitsService,
    // protected fb: FormBuilder,
  ) { }



  ngOnInit() {
    this.authService.getToken().subscribe({
      next: this.getUserFields.bind(this),
    })
    
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
    console.log("fields", this.fields);
    this.authService.getToken().subscribe({
      next: this.getUserSectors.bind(this),
    });
  }

  getUserSectors(token: NbAuthJWTToken) {
    this.subscriptionId = token.getPayload().subscriptionId;
    this.sectorsService.getSectors().subscribe({
      next: this.getSectors.bind(this),
    });
  }

  getSectors(response: ApiResponse) {
    this.sectors = Array<Sector>();
    response.payload.forEach((sector: Sector) => {
        this.sectors.push(sector);
    });
    console.log("sectors", this.sectors);
    this.authService.getToken().subscribe({
      next: this.getUserPlants.bind(this),
    });
  }

  getUserPlants(token: NbAuthJWTToken) {
    this.subscriptionId = token.getPayload().subscriptionId;
    this.plantsService.getPlants().subscribe({
      next: this.getPlants.bind(this),
    });
  }

  getPlants(response: ApiResponse) {
    this.plants = Array<Plant>();
    response.payload.forEach((plant: Plant) => {
        this.plants.push(plant);
    });
    console.log("plants", this.plants);
    this.authService.getToken().subscribe({
      next: this.getUserFruits.bind(this),
    });
  }

  getUserFruits(token: NbAuthJWTToken) {
    this.subscriptionId = token.getPayload().subscriptionId;
    this.fruitsService.getFruits().subscribe({
      next: this.getFruits.bind(this),
    });
  }

  getFruits(response: ApiResponse) {
    this.fruits = Array<Fruit>();
    response.payload.forEach((fruit: Fruit) => {
        this.fruits.push(fruit);
    });
    console.log("fruits", this.fruits);
    this.transformData();
  }

  transformData(){
    this.fields.forEach((field: Field)=>{
      var field_sectors = this.sectors.filter((sector)=>sector.fieldId == field.id );
      this.data = [ ...this.data, {
        data: {campo:field.name, sector:"", planta:"", fruta:"", model_type: "campo", id: field.id.toString(), checked: false, kind: field_sectors.length>0 && "dir" || "no_dir"},
        children:  this.transformSectors(field_sectors)
      }]
    }) 
    console.log("data", this.data)
  }

  transformSectors(sectors: Sector[] ): TreeNode<TableRow>[] {
    var sector_rows: TreeNode<TableRow>[] = [];
    sectors.forEach((sector: Sector)=>{
      var sector_plants = this.plants.filter((plant)=>plant.sectorId==sector.id)
      sector_rows.push({
        data: {campo:"", sector:sector.name, planta:"", fruta:"", model_type: "sector", id: sector.id.toString(), checked: false, kind: sector_plants.length>0 && "dir" || "no_dir"},
        children: this.transformPlants(sector_plants)
      })
    })
    return sector_rows
  }
  
  transformPlants(plants: Plant[] ): TreeNode<TableRow>[] {
    var plant_rows: TreeNode<TableRow>[] = [];
    plants.forEach((plant: Plant)=>{
      var plant_fruits = this.fruits.filter((fruit)=>fruit.plantId==plant.id)
      plant_rows.push({
        data: {campo:"", sector: "", planta: plant.name, fruta:"", model_type: "sector", id: plant.id.toString(), checked: false, kind: plant_fruits.length>0 && "dir" || "no_dir"},
        children: this.transformFruits(plant_fruits)
      })
    })
    return plant_rows
  }

  transformFruits(fruits: Fruit[] ): TreeNode<TableRow>[] {
    var fruit_rows: TreeNode<TableRow>[] = [];
    fruits.forEach((fruit: Fruit)=>{
      fruit_rows.push({
        data: {campo:"", sector: "", planta: "", fruta: fruit.name, model_type: "sector", id: fruit.id.toString(), checked: false},
        children: []
      })
    })
    return fruit_rows
  }

  toggleSelectRow( checked: any, row: TableRow ){
    console.log("checked:", checked)
    console.log(this.selectedRows)
    console.log(row.model_type+" "+row.id);
    checked = checked.target.checked
    if(checked){
      if (!this.selectedRows.some((item) => (item.id).localeCompare(row.id) == 0  && (item.model_type).localeCompare(row.model_type) == 0)) 
        {this.selectedRows.push(row);
        row.checked = true;}
    }else{
       if (this.selectedRows.some((item) => (item.id).localeCompare(row.id) === 0 && (item.model_type).localeCompare(row.model_type) ===0)) 
        {this.selectedRows = this.selectedRows.filter(item => !( item.id.localeCompare(row.id) == 0  && item.model_type.localeCompare(row.model_type) == 0 ));
          row.checked = true;}
        }

    console.log(this.selectedRows)

  }

  recargarPlot(){
    this.selectedRows.forEach((row)=>{
      switch (row.model_type) {
        case "campo":
            break;
        case "sector":
            break;
        case "planta": 
            break;
        case "fruta": 
            break;
        default:
            //default block statement;
      }    
    })
  }
}