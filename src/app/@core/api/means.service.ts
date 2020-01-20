import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, MeanMeasurements } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable()
export class MeansMeasurementsService {
  //env: string = isDevMode() ? 'development' : 'production';
  env = 'test'
  config = apiConfig[this.env];

  constructor(private http: HttpClient) { }
  baseUrl: string = this.config.apiUrl + 'mean/';

  getMeans(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getMeanById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createMean(mean: MeanMeasurements): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, mean);
  }

  updateMean(mean: MeanMeasurements): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + mean.id, mean);
  }

  deleteMean(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }
}
