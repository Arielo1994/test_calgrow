import { Injectable, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Field, ApiResponse } from "./models";
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';


@Injectable()
export class FieldsService {
  //env: string = isDevMode() ? 'development' : 'production';
  env = 'test'
  config = apiConfig[this.env];

  constructor(private http: HttpClient) { }
  baseUrl: string = this.config.apiUrl + 'field/';

  getFields(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl);
  }

  getFieldById(id: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.baseUrl + id);
  }

  createField(field: Field): Observable<any> {
    return this.http.post<ApiResponse>(this.baseUrl, field);
  }

  updateField(field: Field): Observable<any> {
    return this.http.put<ApiResponse>(this.baseUrl + field.id, field);
  }

  deleteField(id: number): Observable<any> {
    return this.http.delete<ApiResponse>(this.baseUrl + id);
  }

  getFieldsBySuscriptor(id:number){
    return this.http.get<ApiResponse>(this.baseUrl+ 'suscription/'+ id);
  }
  getFieldsCounts(id:number){
    return this.http.get<ApiResponse>(this.baseUrl + id + '/counts');
  }
}
