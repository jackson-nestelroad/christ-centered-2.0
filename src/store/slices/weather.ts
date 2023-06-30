import { PayloadAction, SliceCaseReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchWeatherForLocation } from '../../lib/weather';
import { GeolocationServiceInterface } from '../../service/geolocation';
import { WeatherServiceInterface } from '../../service/weather';
import { Status } from '../../types/status';
import { TemperatureUnit, WeatherConfig, WeatherData } from '../../types/weather';
import { AppError, CreateAppError } from '../../util/error';
import { DefaultState } from '../defaults';
import { RootState } from '../root';

export interface WeatherState {
  status: Status;
  data?: WeatherData;
  lastFetchedAt?: number;
  error?: AppError;
  config: WeatherConfig;
}

export const DefaultWeatherState: DefaultState<WeatherState> = {
  status: 'idle',
  config: {
    display: true,
    unit: TemperatureUnit.Fahrenheit,
  },
};

export interface FetchWeatherAsyncThunkArgs {
  geolocation: GeolocationServiceInterface;
  weather: WeatherServiceInterface;
}

export interface AttemptFetchWeatherAsyncThunkArgs extends FetchWeatherAsyncThunkArgs {
  location?: string;
}

export const fetchWeather = createAsyncThunk<WeatherData, FetchWeatherAsyncThunkArgs, { state: RootState }>(
  'weather/fetchWeather',
  async ({ geolocation, weather }: FetchWeatherAsyncThunkArgs, { getState }) => {
    const { weather: weatherState } = getState();
    return await fetchWeatherForLocation(geolocation, weather, weatherState.config.location);
  },
);

export const weatherSlice = createSlice<WeatherState, SliceCaseReducers<WeatherState>, 'weather'>({
  name: 'weather',
  initialState: {
    status: 'idle',
    config: {
      display: true,
      unit: TemperatureUnit.Fahrenheit,
    },
  },
  reducers: {
    setWeatherDisplay: (state, action: PayloadAction<boolean>) => {
      state.config.display = action.payload;
    },
    setTemperatureUnit: (state, action: PayloadAction<TemperatureUnit>) => {
      state.config.unit = action.payload;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.config.location = action.payload;
      state.status = 'idle';
    },
    setWeatherData: (state, action: PayloadAction<WeatherData>) => {
      state.data = action.payload;
      state.status = 'fulfilled';
      state.lastFetchedAt = new Date().valueOf();
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchWeather.pending, state => {
      state.status = 'loading';
      delete state.error;
    });
    builder.addCase(fetchWeather.fulfilled, (state, action: PayloadAction<WeatherData>) => {
      state.status = 'fulfilled';
      state.data = action.payload;
      state.lastFetchedAt = new Date().valueOf();
    });
    builder.addCase(fetchWeather.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = CreateAppError(action.error);
    });
  },
});

export const { setTemperatureUnit, setWeatherDisplay, setLocation, setWeatherData } = weatherSlice.actions;

export default weatherSlice.reducer;
