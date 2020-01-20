import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ViewChild, ElementRef, NgZone } from '@angular/core';
import { MapsAPILoader, MouseEvent } from '@agm/core';
import { FieldsService } from '../../../@core/api/fields.service';
import { NbAuthService, NbAuthJWTToken } from '@nebular/auth';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NbToastrService } from '@nebular/theme';
@Component({
  selector: 'ngx-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss']
})
export class FieldComponent implements OnInit {

  @Output() getNewField = new EventEmitter();

  subscriptionId: number;
  fieldForm: FormGroup;
  loading: boolean = false;
  autocompleteService: google.maps.places.AutocompleteService;
  

  constructor(private mapsAPILoader: MapsAPILoader,private fieldsService: FieldsService,
    private authService: NbAuthService,private fb: FormBuilder,
    private ngZone: NgZone, private toastrService: NbToastrService) { }

  latitude: number;
  longitude: number;
  zoom: number;
  address: string;
  private geoCoder;
  addresses = [];
  seeAddresses: boolean = false;
 
  ngOnInit() {
    this.latitude =  -33.4488897;
    this.longitude = -70.6692655;
    this.zoom = 12;
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      //this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.autocompleteService = new 
      google.maps.places.AutocompleteService();
    });

    this.fieldForm = this.fb.group({
      fieldName: ['', Validators.required],
    });

    this.authService.getToken().subscribe({
      next: function (token: NbAuthJWTToken) {
        this.subscriptionId = token.getPayload().subscriptionId;
      }.bind(this),
    });
  }

  
 
  // Get Current Location Coordinates
  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.getAddress(this.latitude, this.longitude);
      });
    }
  }
 
 
  markerDragEnd($event: MouseEvent) {
    //console.log($event);
    this.latitude = $event.coords.lat;
    this.longitude = $event.coords.lng;
    this.getAddress(this.latitude, this.longitude);
  }
 
  getAddress(latitude, longitude) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          this.zoom = 12;
          this.address = results[0].formatted_address;
          
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
 
    });
  }

  selectedAddress(place_id) {
    this.addresses = [];
    this.zoom = 12;
      this.geoCoder.geocode({'placeId': place_id}, results => {
        this.address = results[0].formatted_address;
        this.latitude = results[0].geometry.location.lat();
        this.longitude = results[0].geometry.location.lng();
        console.log(results);
        document.getElementById("search").click();
    });
  }

  getAddressByName(name) {
    console.log(this.address);
    console.log(name.key);

    if(name.target.value) {
      this.autocompleteService.getPlacePredictions({ input: this.address, componentRestrictions: {country: 'cl'}, }, results => {
          this.addresses = results;
          console.log(results);
          document.getElementById("search").click();
      }
      );
    }else{
      this.addresses = [];
    }
    
     
  }

  createField(): void {
    this.fieldsService.createField({
      name: this.fieldForm.value.fieldName,
      subscriptionId: this.subscriptionId,
      gps_pos: this.latitude + ',' + this.longitude
    }).subscribe({
        next: function (newField) {
          this.getNewField.emit({newField: newField.payload});
          this.toastrService.show(
            newField.name,
            "Campo creado",
            { position: 'top-right', status: 'success' });
        }.bind(this),
        error: function (err) {
          this.toastrService.show(
            err.error.message,
            "Error",
            { position: 'top-right', status: 'danger' });
        }.bind(this)
      });
  };

}
