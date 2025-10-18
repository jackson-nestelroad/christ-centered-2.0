import { DailyBread, Language } from 'daily-bread';
import React from 'react';
import { batch } from 'react-redux';

import { useGeolocation } from '../context/Geolocation';
import { useWeather } from '../context/Weather';
import { StatelessReactHooks } from '../hooks';
import { DefaultVersions, SupportedLanguages, SupportedVersions, isSupportedLanguage } from '../lib/languages';
import { fetchVerseForSearch } from '../lib/verse';
import { fetchWeatherForLocation } from '../lib/weather';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setHourLeadingZero, setLanguage, setTwentyFourHour } from '../store/slices/settings';
import {
  VerseState,
  fetchVerse,
  setUseHomepageForVerseOfTheDay,
  setVerse,
  setVerseSearch,
  setVersion,
} from '../store/slices/verse';
import { setLocation, setTemperatureUnit, setWeatherData, setWeatherDisplay } from '../store/slices/weather';
import { TemperatureUnit } from '../types/weather';
import './Menu.scss';
import AsyncSetting from './settings/AsyncSetting';
import CheckboxSetting from './settings/CheckboxSetting';
import SelectSetting from './settings/SelectSetting';
import ToggleSetting from './settings/ToggleSetting';

interface MenuProps {
  focusable: boolean;
}

type MenuHooks = StatelessReactHooks<'dispatch' | 'geolocation' | 'weather'> & { verse: VerseState };

function onToggleTwentyFourHour({ dispatch }: MenuHooks, currentValue: boolean) {
  dispatch(setTwentyFourHour(!currentValue));
}

function onToggleHourLeadingZero({ dispatch }: MenuHooks, currentValue: boolean) {
  dispatch(setHourLeadingZero(!currentValue));
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
  const bibleVerse = await fetchVerseForSearch(verse.config, verse.dailyBreadConfig, newValue);
  batch(() => {
    dispatch(setVerseSearch(newValue));
    dispatch(setVerse(bibleVerse));
  });
}

function onSetLanguage({ dispatch }: MenuHooks, language: Language, newLanguage: Language) {
  if (language === newLanguage) {
    return;
  }
  batch(() => {
    dispatch(setLanguage(newLanguage));
    dispatch(setVersion(DefaultVersions[newLanguage]));
    dispatch(fetchVerse());
  });
}

function onSetVersion({ dispatch }: MenuHooks, version: string, newVersion: string) {
  if (version === newVersion) {
    return;
  }

  const dailyBread = new DailyBread();
  if (!dailyBread.isSupportedVersion(version)) {
    return;
  }

  batch(() => {
    dispatch(setVersion(newVersion));
    dispatch(fetchVerse());
  });
}

function onToggleUseHomepageForVerseOfTheDay({ dispatch }: MenuHooks, currentValue: boolean) {
  batch(() => {
    dispatch(setUseHomepageForVerseOfTheDay(!currentValue));
    dispatch(fetchVerse());
  });
}

function Menu({ focusable }: MenuProps) {
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
          focusable={focusable}
          onClick={() => onToggleTwentyFourHour(hooks, settings.twentyFourHour)}
        />
        <ToggleSetting
          headerText="Hour Leading Zero"
          offText="Off"
          onText="On"
          on={settings.hourLeadingZero}
          focusable={focusable}
          onClick={() => onToggleHourLeadingZero(hooks, settings.hourLeadingZero)}
        />
        <hr />
        <CheckboxSetting
          text="Enable weather?"
          checked={weather.config.display}
          focusable={focusable}
          onClick={() => onToggleWeather(hooks, weather.config.display)}
        />
        <ToggleSetting
          offText="Fahrenheit"
          onText="Celsius"
          disabled={!weather.config.display}
          focusable={focusable}
          on={weather.config.unit !== TemperatureUnit.Fahrenheit}
          onClick={() => onToggleTemperatureUnit(hooks, weather.config.unit)}
        />
        <AsyncSetting
          text="Location (blank for current location)"
          value={weather.config.location ?? ''}
          disabled={!weather.config.display}
          focusable={focusable}
          placeholder="Location"
          failureText="No weather data found"
          onSave={value => onSaveLocation(hooks, weather.config.location ?? '', value)}
        />
        <hr />
        <AsyncSetting
          text="Bible Verse (blank for verse of the day)"
          value={verse.config.search ?? ''}
          focusable={focusable}
          placeholder="Verse"
          failureText="No Bible verses found"
          onSave={value => onSaveVerse(hooks, verse.config.search ?? '', value)}
        />
        <SelectSetting
          text="Language"
          value={settings.language}
          options={SupportedLanguages}
          focusable={focusable}
          onSelect={language => onSetLanguage(hooks, settings.language, language)}
          placeholder="Language"
        />
        <SelectSetting
          text="Version"
          value={verse.config.version}
          options={SupportedVersions[settings.language] ?? []}
          focusable={focusable}
          onSelect={version => onSetVersion(hooks, verse.config.version, version)}
          placeholder="Version"
          disabled={!isSupportedLanguage(settings.language)}
        />
        <hr />
        <CheckboxSetting
          text="Use Bible Gateway homepage for Verse of the Day?"
          checked={verse.dailyBreadConfig.useHomepageForVerseOfTheDay}
          focusable={focusable}
          onClick={() => onToggleUseHomepageForVerseOfTheDay(hooks, verse.dailyBreadConfig.useHomepageForVerseOfTheDay)}
        />
        <hr />
      </div>
    </div>
  );
}

export default Menu;
