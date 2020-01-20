import { Injectable } from '@angular/core';
import { PlantsService } from '../api/plants.service';
import { SectorsService } from '../api/sectors.service';
import { MeansMeasurementsService } from '../api/means.service';
import { ApiResponse, Sector, Plant, MeanMeasurements } from '../api/models';
import { NbDateService } from '@nebular/theme';

interface ChartData {
  ecuatorial_means: Array<number>,
  polar_means: Array<number>,
  means_dates: Array<string>
}

@Injectable()
export class MeanService {
  private sectors: Array<Sector>;
  private plants: Array<Plant>;
  private means: Array<MeanMeasurements>;

  constructor(
    private plantsService: PlantsService,
    private sectorsService: SectorsService,
    private meanMeasurementsService: MeansMeasurementsService,
    private dateService: NbDateService<Date>,
  ) {
    console.log('INVOCANDO CONSTRUCTOR MEAN SERVICE')
    this.sectorsService.getSectors().subscribe({
      next: function (response: ApiResponse) {
        this.sectors = response.payload;
      }.bind(this)
    });

    this.plantsService.getPlants().subscribe({
      next: function (response: ApiResponse) {
        this.plants = response.payload;
      }.bind(this)
    });

    this.meanMeasurementsService.getMeans().subscribe({
      next: function (response: ApiResponse) {
        this.means = response.payload;
      }.bind(this)
    });
  }

  public getFieldMeans(selectedFieldId: number, period: { startDate: Date, endDate: Date }): Array<ChartData> {
    let selectedSectorsId: Array<number> = [];
    let selectedPlantsId: Array<number> = [];
    let selectedMeansInPeriod: Array<MeanMeasurements> = [];

    for (let sector of this.sectors) {
      if (sector.fieldId === selectedFieldId) {
        selectedSectorsId.push(sector.id)
      }
    }

    for (let plant of this.plants) {
      if (selectedSectorsId.includes(plant.sectorId)) {
        console.log(plant.sectorId)
        selectedPlantsId.push(plant.id)
      }
    }

    for (let mean of this.means) {
      if (selectedPlantsId.includes(mean.plantId) &&
        this.dateService.isBetween(new Date(mean.createdAt), period.startDate, period.endDate)
      ) {
        selectedMeansInPeriod.push(mean);
      }
    }

    return this.getChartData(selectedPlantsId, period, selectedMeansInPeriod);
  }

  public getSectorMeans(selectedSectorId: number, period: { startDate: Date, endDate: Date }): Array<ChartData> {
    let selectedPlantsId: Array<number> = [];
    let selectedMeansInPeriod: Array<MeanMeasurements> = [];

    for (let plant of this.plants) {
      if (plant.sectorId === selectedSectorId) {
        console.log(plant.sectorId)

        selectedPlantsId.push(plant.id);
      }
    }

    for (let mean of this.means) {
      if (selectedPlantsId.includes(mean.plantId) &&
        this.dateService.isBetween(new Date(mean.createdAt), period.startDate, period.endDate)
      ) {
        selectedMeansInPeriod.push(mean);
      }
    }

    return this.getChartData(selectedPlantsId, period, selectedMeansInPeriod);
  }

  public getPlantMeans(selectedPlantId: number, period: { startDate: Date, endDate: Date }): ChartData {
    let ecuatorial_means: Array<number> = [];
    let polar_means: Array<number> = [];
    let means_dates: Array<string> = [];

    let day: number;
    let month: number;
    let year: number;
    let mDate: Date;

    let selectedMeansInPeriod: Array<MeanMeasurements> = [];
    for (let mean of this.means) {
      if (mean.plantId === selectedPlantId &&
        this.dateService.isBetween(new Date(mean.createdAt), period.startDate, period.endDate)
      ) {
        selectedMeansInPeriod.push(mean);
      }
    }

    for (let iDate = new Date(period.startDate.getFullYear(), period.startDate.getMonth(), period.startDate.getDate()); this.dateService.compareDates(iDate, period.endDate) <= 0; iDate = this.dateService.addDay(iDate, 1)) {
      for (const mean of selectedMeansInPeriod) {
        day = iDate.getDate();
        month = iDate.getMonth();
        year = iDate.getFullYear();
        mDate = new Date(mean.createdAt);
        console.log(selectedPlantId, mean.plantId)
        if (this.dateService.compareDates(new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate()), iDate) === 0 &&
          selectedPlantId === mean.plantId) {
          ecuatorial_means.push(mean.ecuatorial_mean);
          polar_means.push(mean.polar_mean);
        }
        else {
          ecuatorial_means.push(null);
          polar_means.push(null);
        }
        means_dates.push(day + '-' + (month + 1) + '-' + year);
      }
    }
    return { ecuatorial_means, polar_means, means_dates };
  }

  private getChartData(selectedPlantsId: number[], period: { startDate: Date; endDate: Date; }, selectedMeansInPeriod: MeanMeasurements[]) {
    let ecuatorial_means: Array<number> = [];
    let polar_means: Array<number> = [];
    let means_dates: Array<string> = [];
    let chartData: Array<ChartData> = [];

    let day: number;
    let month: number;
    let year: number;
    let mDate: Date;

    for (const selectedPlantId of selectedPlantsId) {
      for (let iDate = new Date(period.startDate.getFullYear(), period.startDate.getMonth(), period.startDate.getDate()); this.dateService.compareDates(iDate, period.endDate) <= 0; iDate = this.dateService.addDay(iDate, 1)) {
        for (const mean of selectedMeansInPeriod) {
          day = iDate.getDate();
          month = iDate.getMonth();
          year = iDate.getFullYear();
          mDate = new Date(mean.createdAt);
          if (this.dateService.compareDates(new Date(mDate.getFullYear(), mDate.getMonth(), mDate.getDate()), iDate) === 0 &&
            selectedPlantId === mean.plantId) {
            ecuatorial_means.push(mean.ecuatorial_mean);
            polar_means.push(mean.polar_mean);
          }
          else {
            ecuatorial_means.push(null);
            polar_means.push(null);
          }
          means_dates.push(day + '-' + (month + 1) + '-' + year);
        }
        chartData.push({ ecuatorial_means, polar_means, means_dates });
      }
      return chartData;
    }
  }
}
