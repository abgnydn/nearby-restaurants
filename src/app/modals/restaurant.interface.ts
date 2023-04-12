export interface Image {
  itemType: string;
  itemId: string;
  imageSize: string;
  base64: string;
  storeId: string;
}

export interface Location {
  type: string;
  coordinates: number[];
}

export interface GeoLocation {
  approve: boolean;
  latitude: number;
  longitude: number;
}

export interface WorkingHour {
  day: number;
  open: string;
  close: string;
  closed: boolean;
}

export interface StoreInfo {
  id: string;
  geoLocation: GeoLocation;
  userPoint: number;
  workingHours: WorkingHour[];
  status: string;
  rate: number;
  minOrderPrice: number;
}

export interface Restaurant {
  id: string;
  title: string;
  text: string;
  type: string;
  images: Image[];
  location: Location;
  isDinner: boolean;
  isDelivery: boolean;
  storeInfo: StoreInfo;
  categoryId: string;
}

export interface ErrorResponse {
  code: string;
  desc: string;
}

export interface RestaurantResponse {
  response: Restaurant[];
  error: ErrorResponse;
}
