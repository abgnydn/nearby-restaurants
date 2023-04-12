// Import required modules
import { Injectable } from '@angular/core';
import { Position, Geolocation } from '@capacitor/geolocation';
import { from } from 'rxjs';

// Injectable LocationService for handling device location
@Injectable({
  providedIn: 'root',
})
export class LocationService {
  latitude!: number;
  longitude!: number;

  constructor() {
    this.requestLocationPermission();
  }

  // Check location permissions and get device location
  async checkAndGetLocation(): Promise<Position | undefined> {
    try {
      const status = await Geolocation.checkPermissions();
      if (status) {
        return this.getLocation();
      } else {
        this.requestLocationPermission();
      }
    } catch (error) {
      console.error(error);
    }
    return undefined;
  }

  // Request location permission from the user
  async requestLocationPermission() {
    try {
      const status = await Geolocation.requestPermissions();
      if (status.location) {
        this.getLocation();
      } else {
        console.warn('Location permission not granted');
      }
    } catch (error) {
      console.error(error);
    }
  }

  // Get device location as a Promise
  async getLocation(): Promise<Position> {
    return new Promise((resolve, reject) => {
      from(Geolocation.getCurrentPosition()).subscribe({
        next: (position) => {
          this.latitude = position.coords.latitude;
          this.longitude = position.coords.longitude;
          resolve(position);
        },
        error: (error) => reject(error),
      });
    });
  }

  // Calculate distance between two points in kilometers or meters
  getDistanceFromLatLonInKm(lat2: number, lon2: number): string {
    const R = 6371; // Radius of the earth in km
    const dLat = this.deg2rad(lat2 - this.latitude); // deg2rad below
    const dLon = this.deg2rad(lon2 - this.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(this.latitude)) *
        Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    if (d < 1) {
      // Handle very small distances separately
      d = d * 1000; // Convert to meters
      return `${d.toFixed(2)} m`;
    } else {
      return `${d.toFixed(2)} km`;
    }
  }

  // Convert degrees to radians
  deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }
}
