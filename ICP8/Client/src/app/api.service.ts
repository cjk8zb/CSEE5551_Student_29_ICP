import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Airplane} from './airplane';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

export interface Coordinate {
  latitude;
  longitude;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  getAirplanes(minimum: Coordinate, maximum: Coordinate): Observable<Airplane[]> {
    return this.http.get<Airplane[]>('http://localhost:8081/airplanes', {
      observe: 'body',
      params: {
        minimumLatitude: minimum.latitude,
        minimumLongitude: minimum.longitude,
        maximumLatitude: maximum.latitude,
        maximumLongitude: maximum.longitude
      }
    }).pipe(map(timestampToDate));
  }

  getAirplane(identifier: string): Observable<Airplane[]> {
    return this.http.get<Airplane[]>(`http://localhost:8081/airplanes/${identifier}`).pipe(map(timestampToDate));
  }

}

function timestampToDate(airplanes: Airplane[]): Airplane[] {
  return airplanes.map(airplane => {
    if (airplane.lastPositionUpdate && typeof airplane.lastPositionUpdate === 'number') {
      airplane.lastPositionUpdate = new Date(airplane.lastPositionUpdate * 1000);
    }

    if (airplane.lastUpdate && typeof airplane.lastUpdate === 'number') {
      airplane.lastUpdate = new Date(airplane.lastUpdate * 1000);
    }

    if (airplane.time && typeof airplane.time === 'number') {
      airplane.time = new Date(airplane.time * 1000);
    }

    return airplane;
  });
}
