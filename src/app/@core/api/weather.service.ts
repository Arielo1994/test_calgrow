import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { apiConfig } from '../../../../api.config';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  config = apiConfig["weather"];

  constructor(private http: HttpClient) { }

  getWeather(latitude:number, longitude: number ){
    return this.http.get(this.config.apiUrl+'weather?'+
                                        'lat='+latitude+
                                        '&lon='+longitude+'&lang=es'+
                                        '&appid='+this.config.apiKey
            );
  }
}
