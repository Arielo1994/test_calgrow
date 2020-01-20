import { Component, OnInit, Input } from '@angular/core';
import { WeatherService } from '../../../@core/api/weather.service';
import { Field } from '../../../@core/api/models';
import * as moment from 'moment';
import { MapsAPILoader } from '@agm/core';

@Component({
  selector: 'ngx-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss']
})
export class WeatherComponent implements OnInit {

  @Input() field: Field;

  currentWeather: any;
  temp: number;
  temp_max: number;
  temp_min: number;
  latitude: number;
  longitude: number;
  address: any;
  date : String;
  weatherIcon: String;
  weatherDescription = " ";
  private geoCoder;

  constructor( private mapsAPILoader: MapsAPILoader, private _weatherService: WeatherService) { }

  ngOnInit() {
    this.date = moment(new Date()).format('DD/MM/YYYY');
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.getAddress();
    });
    this.getCurrentWeather();
  }

  ngOnChanges(){
    let date = new Date();
    this.date = moment(date).format('DD/MM/YYYY');
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      this.getAddress();
    });
    this.getCurrentWeather();
  }

  getCurrentWeather(){
    let coordinates = this.field.gps_pos.split(",");
    this.latitude = parseFloat(coordinates[0]);
    this.longitude = parseFloat(coordinates[1]);
    this._weatherService.getWeather(this.latitude,this.longitude)
      .subscribe(res => {
        console.log(res);
        this.currentWeather = res;
        this.temp = Math.trunc(parseInt(this.currentWeather.main.temp)-273.15);
        this.temp_max = Math.trunc(parseInt(this.currentWeather.main.temp_max)-273.15);
        this.temp_min = Math.trunc(parseInt(this.currentWeather.main.temp_min)-273.15);
        console.log(this.currentWeather.weather[0]);
        this.weatherIcon = 'http://openweathermap.org/img/wn/'+this.currentWeather.weather[0].icon+'@2x.png';
        this.weatherDescription = this.currentWeather.weather[0].description;
      }, err => { });
  }

  getAddress(){
    this.geoCoder.geocode({ 'location': { lat: this.latitude, lng: this.longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.address = results[0].address_components[2].long_name;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }

}
