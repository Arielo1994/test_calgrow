import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Variety } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable()
export class VarietiesService {
  //env: string = isDevMode() ? 'development' : 'production';
  env = 'production'
  config = apiConfig[this.env];

  constructor(private http: HttpClient) { }
  baseUrl: string = this.config.apiUrl + 'variety/';

  getVarieties(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getVarietiesById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createVariety(variety: Variety): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, variety);
  }

  updateVariety(variety: Variety): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + variety.id, variety);
  }

  deleteVariety(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }
}
