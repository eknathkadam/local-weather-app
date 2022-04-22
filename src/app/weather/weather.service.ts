import { HttpClient, HttpParams } from '@angular/common/http';
import { APP_ID, Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {Observable} from 'rxjs'
import {map} from 'rxjs/operators'

import {ICurrentWeather} from "../interface"


 interface CurrentWeatherData {
   weather:[{
     description: string,
     icon: string
   }],
   main:{
     temp:number
   },
   sys:{
     country:string
   },
   dt: number,
   name:string
 }

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private httpClient:HttpClient) { }

  getCurrentWeather(city: string, country: string):Observable<ICurrentWeather>{
    
    //advanced way of sending params
    //Example String:
    ////https://api.openweathermap.org/data/2.5/weather?q=Mumbai,in&appid=3848c475e1af662056214575f198128f

const uriParams = new HttpParams()
      .set('q',city+','+country)
      .set('appid',environment.appId)

      console.log(environment.baseUrl+'api.openweathermap.org/data/2.5/weather');

      return this.httpClient
      .get<CurrentWeatherData>(
        environment.baseUrl+'api.openweathermap.org/data/2.5/weather',
        {params:uriParams}
        ).pipe(map(data=>this.transformToICurrentWeather(data)))
    
  }

  private transformToICurrentWeather(data: CurrentWeatherData):ICurrentWeather{
    const imageURL = 'https://openweathermap.org/img/w/'+data.weather[0].icon+'.png';
    return{
      city: data.name,
      country: data.sys.country,
      date: data.dt*1000,
      image: imageURL,
      //TODO Add a function transform into celcius
      temperature: this.convertKelvinToFarenheit(data.main.temp), 
      
      description:data.weather[0].description,
    }
  }
private convertKelvinToFarenheit(kelvin:number):number{
  return kelvin*9 / 5 - 459.67
}

}