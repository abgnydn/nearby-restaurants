// Import required modules
import { CommonModule, NgStyle } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CardComponent } from '../components/card/card.component';
import { ApiService } from '../services/api.service';
import { InfiniteScrollCustomEvent } from '@ionic/core';
import { Restaurant } from '../modals/restaurant.interface';
import { ModalController } from '@ionic/angular';
import { LocationService } from '../services/location.service';
import { Position } from '@capacitor/geolocation';
import { LoadingController } from '@ionic/angular';

// Define component metadata
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, NgStyle, CommonModule, CardComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class HomePage implements OnInit {
  data!: Restaurant[];
  variant = 'success';
  showIcon = true;
  skip: number = 0;
  limit: number = 10;
  searchTerm: string = '';
  currentLocation!: Pick<Position['coords'], 'latitude' | 'longitude'>;
  filteredData!: Restaurant[];
  isLoading: boolean = false;
  @Input() chip = true;

  // Initialize component
  ngOnInit(): void {
    this.location.checkAndGetLocation().then((res) => {
      if (res?.coords.latitude && res?.coords.longitude) {
        this.currentLocation = res?.coords;
        return this.getData(res?.coords.latitude, res?.coords.longitude);
      }
    });
  }

  // Get variant style
  getVariant() {
    if (this.variant === 'success') {
      return {
        borderRadius: '100%',
        width: '15px',
        height: '15px',
        background: 'red',
        position: 'absolute',
        bottom: '-10px',
        right: '-10px',
      };
    }
  }

  // Handle search input event
  onSearchInput(event: any) {
    this.searchTerm = event.target.value.toString();
    this.filterItems();
  }

  // Filter items based on search term
  filterItems() {
    if (this.searchTerm) {
      this.filteredData = this.data.filter((item: Restaurant) => {
        return item.title.toLowerCase().includes(this.searchTerm.toLowerCase());
      });
    } else {
      this.filteredData = [...this.data];
    }
  }

  // Constructor
  constructor(
    private api: ApiService,
    private location: LocationService,
    private loadingController: LoadingController // Inject LoadingController here
  ) {}

  // Load more items when infinite scroll is triggered
  loadMoreItems(event: Event) {
    const customEvent = event as CustomEvent<InfiniteScrollCustomEvent>;
    this.api
      .getData(
        this.skip,
        this.limit,
        this.currentLocation.latitude,
        this.currentLocation.longitude
      )
      .subscribe((newItems) => {
        this.data = this.data.concat(newItems.response);
        this.filterItems();
        (customEvent.target as HTMLIonInfiniteScrollElement).complete();
        this.skip += this.limit;
      });
  }

  // Get data from API
  getData(latitude: number, longitude: number): void {
    this.isLoading = true;
    this.api
      .getData(this.skip, this.limit, latitude, longitude)
      .subscribe((data) => {
        console.log(data.response, 'data');
        this.data = data.response;
        this.filterItems();
        this.isLoading = false;
      });
  }
}
