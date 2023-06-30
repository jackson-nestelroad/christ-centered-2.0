import { GeolocationServiceInterface } from '../service/geolocation';
import { WeatherServiceInterface } from '../service/weather';
import { WeatherData } from '../types/weather';

export async function fetchWeatherForLocation(
  geolocation: GeolocationServiceInterface,
  weather: WeatherServiceInterface,
  location?: string,
): Promise<WeatherData> {
  console.log('Fetching weather');

  if (location) {
    return await weather.getWeatherForLocation(location);
  }
  const coords = await geolocation.getCurrentLocation();
  return await weather.getWeather(coords);
}
