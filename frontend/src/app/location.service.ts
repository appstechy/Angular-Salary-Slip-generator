import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor() { }

  getCurrentLocation(): Promise<GeolocationPosition>{
    return new Promise((resolve, reject) =>{
      if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(
          (position) =>{
            resolve(position);
          },
          (error) =>{
            reject(error);
          }
        );
       
      } else{
        reject(new Error('Geolocation is not available in this browser.'));
      }
    });
  }
}
