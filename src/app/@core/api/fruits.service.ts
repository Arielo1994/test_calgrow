import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, Fruit } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable()
export class FruitsService {
  //env: string = isDevMode() ? 'development' : 'production';
  env = 'test'
  config = apiConfig[this.env];

  constructor(private http: HttpClient) { }
  baseUrl: string = this.config.apiUrl + 'fruit/';

  getFruits(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getFruitById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createFruit(fruit: Fruit): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.baseUrl, fruit);
  }

  updateFruit(fruit: Fruit): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(this.baseUrl + fruit.id, fruit);
  }

  deleteFruit(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }

  getFruitsByField(idField: number, typeConsult:string): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + 'field/'+ idField + '/' + typeConsult);
  }
}
