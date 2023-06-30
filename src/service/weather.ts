import { Axios, AxiosRequestConfig } from 'axios';

import { Coordinates, WeatherData } from '../types/weather';
import { Environment } from './environment';

export interface WeatherServiceInterface {
  getWeather(coords: Coordinates): Promise<WeatherData>;
  getWeatherForLocation(location: string): Promise<WeatherData>;
}

interface OpenWeatherMapResponse {
  coord: {
    lon: number;
    lat: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  base: string;
  main: {
    temp: number;
    feels_like?: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level?: number;
    grnd_level?: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  id: number;
  name: string;
  cod: number;
}

class OpenWeatherMapService implements WeatherServiceInterface {
  public constructor(private key: string) {
    this.axios = new Axios({
      baseURL: 'https://api.openweathermap.org',
    });
  }

  public async getWeather({ latitude, longitude }: Coordinates): Promise<WeatherData> {
    return this.makeRequest({
      method: 'get',
      url: `/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${this.key}`,
    });
  }

  public async getWeatherForLocation(location: string): Promise<WeatherData> {
    return this.makeRequest({
      method: 'get',
      url: `/data/2.5/weather?q=${location}&appid=${this.key}`,
    });
  }

  private async makeRequest(config: AxiosRequestConfig): Promise<WeatherData> {
    const response = await this.axios.request(config);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch current weather data (HTTP code = ${response.status})`);
    }
    // Note: this conversion does not check that the response follows the expected format;
    const data = JSON.parse(response.data) as OpenWeatherMapResponse;

    if (data.cod !== 200) {
      console.error(data);
      throw new Error(`Failed to fetch current weather data (internal code = ${data.cod})`);
    }

    const celsius = data.main.temp - 273.15;
    const fahrenheit = celsius * 1.8 + 32;
    return {
      temperature: {
        celsius,
        fahrenheit,
      },
      location: data.name,
      id: data.weather[0]?.id,
    };
  }

  private axios: Axios;
}

export function CreateWeatherService(): WeatherServiceInterface {
  const key = Environment.WeatherApiKey();
  if (!key) {
    throw new Error('No API key configured for weather service');
  }
  return new OpenWeatherMapService(key);
}
