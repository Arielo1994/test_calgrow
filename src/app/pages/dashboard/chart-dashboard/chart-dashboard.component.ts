import { Component, OnInit, Input } from '@angular/core';
import { rgb } from 'd3-color';
import { ApiResponse } from '../../../@core/api/models';
import { FruitsService } from '../../../@core/api/fruits.service';
import { FieldsService } from '../../../@core/api/fields.service';
import { count } from 'rxjs/operators';

@Component({
  selector: 'ngx-chart-dashboard',
  templateUrl: './chart-dashboard.component.html',
  styleUrls: ['./chart-dashboard.component.scss']
})
export class ChartDashboardComponent implements OnInit {

  @Input() fieldId: number;
  data: any;
  options:any;
  currentData: any;
  counts: {};
  type = 'week';
  measureType = 'polar';
  measureTypeCurrent = 'polar';
  typeCurrent = 'week';
  colorChart: any[] = [];

  chartData = [];
  currentChartData = [];

  

  constructor(
    private fruitsService: FruitsService,
    private fieldsService: FieldsService
    ) {
      
    this.data = {
      labels: [],
      datasets: [],
    };

    this.currentData = {
      labels: [],
      datasets: [],
    };

    this.options = {
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
  }

  ngOnInit() {    
    this.updateCountsFields(this.fieldId);
    this.updateChartData();
    this.updateCurrentChartData();
  }

  ngOnChanges(){
    this.updateCountsFields(this.fieldId);
    this.updateChartData();
    this.updateCurrentChartData();
  }

  updateChartData(){
    if(!this.colorChart.length){
      this.data.datasets.forEach((element) => {
        this.colorChart.push({borderColor: element.borderColor,backgroundColor: element.backgroundColor})
      });
    }    
    this.data
    this.data.labels = [];
    this.data.datasets = [];   
    this.fruitsService.getFruitsByField(this.fieldId,this.type).subscribe({
      next: function (response: ApiResponse) {        
        if(response.payload.length){
          this.chartData = response.payload;
          this.data.labels=response.payload[0].labels;
          response.payload.forEach((element,index) => {
            let r = Math.floor(Math.random() * 256);let g = Math.floor(Math.random() * 256);let b = Math.floor(Math.random() * 256);
            this.data.datasets.push({ 
              data: this.measureType == 'polar' ? element.polarData: element.ecuatorialData,
              label: element.period,
              borderColor: this.colorChart.length  ? this.colorChart[index].borderColor : rgb(r,g,b),
              backgroundColor: this.colorChart.length ? this.colorChart[index].backgroundColor : rgb(r,g,b,0.1),
              pointRadius: 4,
              pointHoverRadius: 6
            })          
          });
        }
      }.bind(this),
    });
  }

  updateCurrentChartData(){
    let color = [];
    this.currentData.datasets.forEach((element) => {
      color.push({borderColor: element.borderColor,backgroundColor: element.backgroundColor})
    });
    this.currentData.labels = [];
    this.currentData.datasets = [];
    this.fruitsService.getFruitsByField(this.fieldId,this.typeCurrent).subscribe({
      next: function (response: ApiResponse) {        
        if(response.payload.length){
          this.currentChartData = response.payload;
          this.currentData.labels=response.payload[response.payload.length-1].labels;
          let r = Math.floor(Math.random() * 256);let g = Math.floor(Math.random() * 256);let b = Math.floor(Math.random() * 256);
            this.currentData.datasets.push({ 
              data: this.measureTypeCurrent == 'polar' ? response.payload[response.payload.length-1].polarData : response.payload[response.payload.length-1].ecuatorialData,
              label: response.payload[response.payload.length-1].period,
              borderColor: color.length ? color[0].borderColor : rgb(r,g,b),
              backgroundColor: color.length ? color[0].backgroundColor : rgb(r,g,b,0.2),
              pointRadius: 4,
              pointHoverRadius: 6
            }) 
        }
      }.bind(this),
    });

  }


  updateCountsFields(fieldId:number){
    //this.fieldsService.getFieldsCounts(this.fields[this.fields.length-1].id).subscribe({
    this.fieldsService.getFieldsCounts(fieldId).subscribe({
      next: function (response: ApiResponse) {    
        //this.counts = response.payload[0];
        this.counts = [1,0,0];
        console.log(this.counts);
      }.bind(this),
    });
  }

}
