import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Specie } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable()
export class SpeciesService {
   //env: string = isDevMode() ? 'development' : 'production';
   env = 'production'
   config = apiConfig[this.env];
 
   constructor(private http: HttpClient) { }
   baseUrl: string = this.config.apiUrl + 'specie/';

  getSpecies(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getSpecieById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createSpecie(specie: Specie): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, specie);
  }

  updateSpecie(specie: Specie): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + specie.id, specie);
  }

  deleteSpecie(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }
}
