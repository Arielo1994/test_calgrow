import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Sector, ApiResponse } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable()
export class SectorsService {
  //env: string = isDevMode() ? 'development' : 'production';
  env = 'test'
  config = apiConfig[this.env];

  constructor(private http: HttpClient) { }
  baseUrl: string = this.config.apiUrl + 'sector/';

  getSectors(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getSectorById(id: number): Observable<any> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createSector(sector: Sector): Observable<any> {
    return this.http.post<ApiResponse>(this.baseUrl, sector);
  }

  updateSector(sector: Sector): Observable<any> {
    return this.http.put<ApiResponse>(this.baseUrl + sector.id, sector);
  }

  deleteSector(id: number): Observable<any> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }
}
