import { Coordinates } from '../types/weather';

export interface GeolocationServiceInterface {
  getCurrentLocation(): Promise<Coordinates>;
}

class BrowserGeolocationService implements GeolocationServiceInterface {
  public constructor(protected geolocation: Geolocation) {}

  public async getCurrentLocation(): Promise<Coordinates> {
    return new Promise((resolve, reject) => {
      this.geolocation.getCurrentPosition(
        position => {
          resolve(position.coords);
        },
        error => {
          reject(error);
        },
      );
    });
  }
}

export function CreateGeolocationService(): GeolocationServiceInterface {
  if (navigator?.geolocation) {
    return new BrowserGeolocationService(navigator.geolocation);
  }
  throw new Error('Client does not support geolocation');
}
