// Importing required modules and components
import { CommonModule, NgStyle } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { Restaurant } from 'src/app/modals/restaurant.interface';

import { LocationService } from 'src/app/services/location.service';

// Decorator to define component's metadata
@Component({
  selector: 'app-card',
  templateUrl: 'card.component.html',
  styleUrls: ['card.component.scss'],
  standalone: true,
  imports: [IonicModule, NgStyle, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class CardComponent {
  basePath: string = '../../../assets/';
  imageSrc!: string;
  windowWidth: number = window.innerWidth;
  distance!: string;
  isOpen!: boolean;
  statusColor!: string;

  // Input decorator to bind data from parent component
  @Input() item!: Restaurant;

  // Getter for storeInfo
  get storeInfo() {
    const { storeInfo } = this.item;
    return storeInfo;
  }

  // Getter for title
  get title() {
    const { title } = this.item;
    return title;
  }

  // Getter for text
  get text() {
    const { text } = this.item;
    return text;
  }

  // Getter for imageUrl
  get imageUrl() {
    const { images } = this.item;
    return images[0]?.base64;
  }

  // Fallback image when image fails to load
  handleImageError(event: any) {
    event.target.src = '../../assets/placeholder-image.png';
  }

  // Injecting LocationService in the constructor
  constructor(private locationService: LocationService) {}

  ngOnInit() {}

  // Method to calculate the distance between the user and the restaurant
  calculateDistance() {
    const lat2 = this.storeInfo?.geoLocation?.latitude;
    const lon2 = this.storeInfo?.geoLocation?.longitude;

    if (lat2 && lon2) {
      this.distance = this.locationService
        .getDistanceFromLatLonInKm(lat2, lon2)
        .toString();
    }
    this.calculateStatus();
    return this.distance;
  }

  // Private method to calculate the status (open/closed) of the restaurant and set the status color
  private calculateStatus() {
    let openingTime = new Date(
      '1970-01-01T' + this.storeInfo.workingHours[0].open
    );
    let closingTime = new Date(
      '1970-01-01T' + this.storeInfo.workingHours[0].close
    );
    let currentTime = new Date();
    this.isOpen = currentTime >= openingTime && currentTime <= closingTime;
    this.statusColor = this.isOpen
      ? 'var(--ion-color-success)'
      : 'var(--ion-color-warning)';
  }
}
