import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Measurement } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable()
export class MeasurementsService {
  //env: string = isDevMode() ? 'development' : 'production';
  env= 'test';
  config = apiConfig[this.env];

  constructor(private http: HttpClient) { }
  baseUrl: string = this.config.apiUrl + 'measurement/';

  getMeasurements(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getMeasurementById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createMeasurement(measurement: Measurement): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, measurement);
  }

  updateMeasurement(measurement: Measurement): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + measurement.id, measurement);
  }

  deleteMeasurement(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }
}
