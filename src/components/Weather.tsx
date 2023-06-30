import React, { useEffect } from 'react';

import { useGeolocation } from '../context/Geolocation';
import { useWeather } from '../context/Weather';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchWeather } from '../store/slices/weather';
import { TemperatureUnit } from '../types/weather';
import './Weather.scss';

function getWeatherIcon(code: number) {
  const time = new Date().getHours();
  const timeOfDay = time >= 20 || time < 6 ? 'night' : 'day';
  return `wi-owm-${timeOfDay}-${code}`;
}

// Fetch new weather data every fifteen minutes.
const fetchEvery = 15 * 60 * 1000;

function Weather() {
  const { config, lastFetchedAt, status, error, data } = useAppSelector(state => state.weather);
  const dispatch = useAppDispatch();
  const geolocation = useGeolocation();
  const weather = useWeather();

  useEffect(() => {
    const diff = lastFetchedAt ? new Date().valueOf() - lastFetchedAt : fetchEvery + 1;
    if (config.display && (status !== 'fulfilled' || error || diff > fetchEvery)) {
      console.log('Fetching weather');
      dispatch(
        fetchWeather({
          geolocation,
          weather,
        }),
      );
    }
  }, []);

  if (!config.display) {
    return null;
  }

  // Errors should not be displayed.
  if (status === 'rejected') {
    console.error('Weather component failed:', error);
    return null;
  }
  if (status === 'idle' || status === 'loading' || !data) {
    return null;
  }

  return (
    <div className="weather fade-in">
      <i className={`icon wi ${getWeatherIcon(data.id)}`} />
      <div className="temperature">
        {Math.round(config.unit === TemperatureUnit.Celsius ? data.temperature.celsius : data.temperature.fahrenheit)}
        &deg;
        <sup className="unit">{config.unit === TemperatureUnit.Celsius ? 'C' : 'F'}</sup>
      </div>
      <div className="location">{data.location}</div>
    </div>
  );
}

export default Weather;
