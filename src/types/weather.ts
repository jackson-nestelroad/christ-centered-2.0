export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Temperature {
  fahrenheit: number;
  celsius: number;
}

export interface WeatherData {
  temperature: Temperature;
  location: string;
  id: number;
}

export enum TemperatureUnit {
  Fahrenheit = 'fahrenheit',
  Celsius = 'celsius',
}

export interface WeatherConfig {
  display: boolean;
  unit: TemperatureUnit;
  location?: string;
}
