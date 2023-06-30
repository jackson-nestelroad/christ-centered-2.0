import React from 'react';
import { batch } from 'react-redux';

import { useGeolocation } from '../context/Geolocation';
import { useWeather } from '../context/Weather';
import { StatelessReactHooks } from '../hooks';
import { fetchVerseForSearch } from '../lib/verse';
import { fetchWeatherForLocation } from '../lib/weather';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setTwentyFourHour } from '../store/slices/settings';
import { VerseState, setVerse, setVerseSearch } from '../store/slices/verse';
import { setLocation, setTemperatureUnit, setWeatherData, setWeatherDisplay } from '../store/slices/weather';
import { TemperatureUnit } from '../types/weather';
import './Menu.scss';
import AsyncSetting from './settings/AsyncSetting';
import CheckboxSetting from './settings/CheckboxSetting';
import ToggleSetting from './settings/ToggleSetting';

type MenuHooks = StatelessReactHooks<'dispatch' | 'geolocation' | 'weather'> & { verse: VerseState };

function onToggleTwentyFourHour({ dispatch }: MenuHooks, currentValue: boolean) {
  dispatch(setTwentyFourHour(!currentValue));
}

function onToggleTemperatureUnit({ dispatch }: MenuHooks, currentValue: TemperatureUnit) {
  const newValue = currentValue === TemperatureUnit.Fahrenheit ? TemperatureUnit.Celsius : TemperatureUnit.Fahrenheit;
  dispatch(setTemperatureUnit(newValue));
}

function onToggleWeather({ dispatch }: MenuHooks, currentValue: boolean) {
  dispatch(setWeatherDisplay(!currentValue));
}

async function onSaveLocation(
  { dispatch, geolocation, weather }: MenuHooks,
  value: string,
  newValue: string,
): Promise<void> {
  if (value == newValue) {
    return;
  }
  const data = await fetchWeatherForLocation(geolocation, weather, newValue);
  batch(() => {
    dispatch(setLocation(newValue));
    dispatch(setWeatherData(data));
  });
}

async function onSaveVerse({ dispatch, verse }: MenuHooks, value: string, newValue: string): Promise<void> {
  if (value == newValue) {
    return;
  }
  const bibleVerse = await fetchVerseForSearch(verse.config, newValue);
  batch(() => {
    dispatch(setVerseSearch(newValue));
    dispatch(setVerse(bibleVerse));
  });
}

function Menu() {
  const { verse, weather, settings } = useAppSelector(state => state);

  const hooks: MenuHooks = {
    dispatch: useAppDispatch(),
    geolocation: useGeolocation(),
    weather: useWeather(),
    verse,
  };

  return (
    <div className="menu">
      <img className="logo" src="images/logos/logo.svg" />
      <p className="title">
        <b>Christ</b>-Centered
      </p>
      <p>
        <a href="https://github.com/jackson-nestelroad/christ-centered-2.0/issues" className="link">
          Report / Suggest
        </a>
      </p>
      <hr />
      <div className="settings">
        <ToggleSetting
          offText="12 Hour"
          onText="24 Hour"
          on={settings.twentyFourHour}
          onClick={() => onToggleTwentyFourHour(hooks, settings.twentyFourHour)}
        />
        <hr />
        <CheckboxSetting
          text="Enable weather?"
          checked={weather.config.display}
          onClick={() => onToggleWeather(hooks, weather.config.display)}
        />
        <ToggleSetting
          offText="Fahrenheit"
          onText="Celsius"
          disabled={!weather.config.display}
          on={weather.config.unit !== TemperatureUnit.Fahrenheit}
          onClick={() => onToggleTemperatureUnit(hooks, weather.config.unit)}
        />
        <AsyncSetting
          text="Location (blank for current location)"
          value={weather.config.location ?? ''}
          disabled={!weather.config.display}
          placeholder="Location"
          failureText="No weather data found"
          onSave={value => onSaveLocation(hooks, weather.config.location ?? '', value)}
        />
        <hr />
        <AsyncSetting
          text="Bible Verse (blank for verse of the day)"
          value={verse.config.search ?? ''}
          placeholder="Verse"
          failureText="No Bible verses found"
          onSave={value => onSaveVerse(hooks, verse.config.search ?? '', value)}
        />
        <hr />
      </div>
    </div>
  );
}

export default Menu;
