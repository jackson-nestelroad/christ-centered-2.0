import { Language } from 'daily-bread';
import React, { ReactNode, useEffect, useState } from 'react';
import { Provider } from 'react-redux';

import { useBrowserStorage } from '../context/BrowserStorage';
import { BrowserStorageServiceInterface } from '../service/browser-storage';
import { Environment } from '../service/environment';
import configureStore, { CreatedStore, RootState, StoreKey, StoreKeys } from '../store/root';
import { setBackground, setLanguage } from '../store/slices/settings';
import { setVerse } from '../store/slices/verse';
import { WeatherState } from '../store/slices/weather';

interface StoreLoaderState {
  store?: CreatedStore;
}

interface StoreLoaderProps {
  children?: ReactNode;
}

async function saveInitialStoreState(storage: BrowserStorageServiceInterface, state: RootState): Promise<void> {
  try {
    await Promise.all(StoreKeys.map(key => storage.saveState(key, state[key])));
  } catch (error) {
    console.error(`Failed to write initial store state to browser storage: ${error}`);
  }
}

/**
 * StoreLoader automatically loads the store from browser storage and provides it to the rest of the application.
 */
function StoreLoader({ children }: StoreLoaderProps) {
  const [state, setState] = useState<StoreLoaderState>({});
  const storage = useBrowserStorage();

  const saveStore = (store: CreatedStore) => {
    // Manually synchronize the browser storage with the initial state of the store, since the store may apply some
    // default values or modify the state in a meaningful way across multiple versions.
    saveInitialStoreState(storage, store.getState());

    if (Environment.Environment() !== 'production') {
      (globalThis as any).store = store;
      (globalThis as any).setStorage = (key: StoreKey, value: RootState[StoreKey]) => {
        storage.saveState(key, value);
      };
      (globalThis as any).setVerse = (verse: string) => {
        store.dispatch(setVerse(verse));
      };
      (globalThis as any).resetWeather = () => {
        storage.saveState('weather', {} as WeatherState);
      };
      (globalThis as any).setBackground = (background?: number) => {
        store.dispatch(setBackground(background));
      };
      (globalThis as any).setLanguage = (language: Language) => {
        store.dispatch(setLanguage(language));
      };
    }

    setState({ ...state, store });
  };

  useEffect(() => {
    storage
      .getRootState()
      .then(preloadedState => {
        console.log('Found preloaded state in browser storage', JSON.stringify(preloadedState));
        saveStore(configureStore(preloadedState, storage));
      })
      .catch(error => {
        console.error('Failed to read initial state from browser storage', error);
        saveStore(configureStore({}, storage));
      });
  }, []);

  if (!state.store) {
    return null;
  }

  return <Provider store={state.store}>{children}</Provider>;
}

StoreLoader.defaultProps = {
  children: undefined,
};

export default StoreLoader;
