import { Component, OnInit } from '@angular/core';
import { NbDateService } from '@nebular/theme';
import { Plant, Field, Sector } from '../../../@core/api/models';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { MeanService } from '../../../@core/utils';
import { rgb } from 'd3-color';

interface ChartData {
  ecuatorial_means: Array<number>,
  polar_means: Array<number>,
  means_dates: Array<string>
}

@Component({
  selector: 'ngx-chartjs',
  styleUrls: ['./chartjs.component.scss'],
  templateUrl: './chartjs.component.html',
})
export class ChartjsComponent implements OnInit {
  colors: any;
  chartjs: any;
  data: { labels: Array<any>, datasets: Array<any> };
  options: any;
  themeSubscription: any;

  ecuatorial_means: number[];
  polar_means: number[];
  means_dates: string[];

  filterForm: FormGroup;

  selectedPlants: Array<Plant> = Array<Plant>();
  selectedPeriod: string;
  currentObjName: string;

  startDate: Date;
  endDate: Date;
  adjustementAvailable: boolean = true;

  constructor(
    private chartDataService: MeanService,
    protected dateService: NbDateService<Date>,
    protected fb: FormBuilder,
  ) { }

  ngOnInit() {
    this.data = { labels: [], datasets: [] };
    this.selectedPeriod = '0';
    this.ecuatorial_means = Array<number>();
    this.polar_means = Array<number>();
    this.means_dates = Array<string>();

    let _startingDate: Date = this.dateService.addMonth(this.dateService.today(), -1);
    _startingDate = this.dateService.getMonthStart(_startingDate);
    this.filterForm = this.fb.group({
      dateCtrl: [_startingDate, Validators.required],
      periodCtrl: ['0', Validators.required],
    });

    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      spanGaps: true,
      legend: {
        position: 'bottom',
      },
      hover: {
        mode: 'index',
      },
      scales: {
        xAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Fecha de medición [d/m/a]',
            },
            gridLines: {
              display: true,
            },
          },
        ],
        yAxes: [
          {
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Tamaño [mm]',
            },
            gridLines: {
              display: true,
            },
          },
        ],
      },
    }
  }

  private getPeriod(): { startDate: Date, endDate: Date } {
    this.startDate = this.filterForm.get('dateCtrl').value;
    let period: string = this.filterForm.get('periodCtrl').value;

    if (period === "1") {
      this.endDate = this.dateService.addMonth(this.startDate, 1);
    } else if (period === '3') {
      this.endDate = this.dateService.addMonth(this.startDate, 3);
    } else if (period === '12') {
      this.endDate = this.dateService.addYear(this.startDate, 1);
    } else if (period == '0') {
      this.endDate = this.dateService.today();
    }
    return { startDate: this.startDate, endDate: this.endDate }
  }

  updateChartConfig() {
    this.adjustementAvailable = false;
    let _randColor1 = rgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
    let _randColor2 = rgb(Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256));
    this.data.labels = this.means_dates;
    this.data.datasets.push({
      label: `${this.currentObjName} [mm ecuatorial]`,
      data: this.ecuatorial_means,
      borderColor: _randColor1,
      backgroundColor: _randColor1,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    }, {
      label: `${this.currentObjName} [mm polar]`,
      data: this.polar_means,
      borderColor: _randColor2,
      backgroundColor: _randColor2,
      fill: false,
      pointRadius: 4,
      pointHoverRadius: 6,
    },
    );
    this.data = Object.assign({}, this.data);
    this.ecuatorial_means = Array<number>();
    this.polar_means = Array<number>();
    this.means_dates = Array<string>();
  }

  resetChartConfig() {
    this.data = { labels: [], datasets: [] };
    this.selectedPlants = Array<Plant>();
    this.ecuatorial_means = Array<number>();
    this.polar_means = Array<number>();
    this.means_dates = Array<string>();
    this.adjustementAvailable = true;
  }

  fieldAddedEventHandler($addedField: Field) {
    let period = this.getPeriod();
    let fieldsChartData: ChartData[] = this.chartDataService.getFieldMeans($addedField.id, period);
    for (const chartData of fieldsChartData) {
      this.ecuatorial_means = chartData.ecuatorial_means;
      this.polar_means = chartData.polar_means;
      this.means_dates = chartData.means_dates;
      this.currentObjName = $addedField.name;
    };
    this.updateChartConfig();
  }

  sectorAddedEventHandler($addedSector: Sector) {
    let period = this.getPeriod();
    let sectorsChartData: ChartData[] = this.chartDataService.getSectorMeans($addedSector.id, period);
    sectorsChartData.forEach((chartData) => {
      this.ecuatorial_means = chartData.ecuatorial_means;
      this.polar_means = chartData.polar_means;
      this.means_dates = chartData.means_dates;
      this.currentObjName = $addedSector.name;
    });
    this.updateChartConfig();
  }

  plantAddedEventHandler($addedPlant: Plant) {
    let period = this.getPeriod();
    let plantChartData: ChartData = this.chartDataService.getPlantMeans($addedPlant.id, period);
    this.ecuatorial_means = plantChartData.ecuatorial_means;
    this.polar_means = plantChartData.polar_means;
    this.means_dates = plantChartData.means_dates;
    this.currentObjName = $addedPlant.name;
    this.updateChartConfig();
  }
}
