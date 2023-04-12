// Import required modules
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { Position } from '@capacitor/geolocation';

import { environment } from 'src/environments/environment';

// Set up HTTP options with headers
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    apiKey: environment.apiKey,
  }),
};

// Injectable ApiService for handling API requests
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}
  myLocation!: Pick<Position['coords'], 'latitude' | 'longitude'>;

  // Fetch data from the API using POST request
  getData(
    skip: number,
    limit: number,
    latitude: any,
    longitude: any
  ): Observable<any> {
    const url = environment.apiUrl;
    return this.http.post(
      url,
      {
        latitude: latitude,
        longitude: longitude,
        skip: skip,
        limit: limit,
      },
      httpOptions
    );
  }
}
