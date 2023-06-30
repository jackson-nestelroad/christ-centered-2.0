import { $CombinedState, AsyncThunk, combineReducers, configureStore as reduxConfigureStore } from '@reduxjs/toolkit';

import { BrowserStorageServiceInterface } from '../service/browser-storage';
import { DefaultState, applyDefaults } from './defaults';
import { saveToBrowserStorage } from './middleware/browser-storage';
import settingsReducer, { DefaultSettingsState } from './slices/settings';
import verseReducer, { DefaultVerseState } from './slices/verse';
import weatherReducer, { DefaultWeatherState } from './slices/weather';

const Reducers = {
  settings: settingsReducer,
  verse: verseReducer,
  weather: weatherReducer,
};

const rootReducer = combineReducers(Reducers);

export type RootState = ReturnType<typeof rootReducer>;

const DefaultRootState: { [key in StoreKey]: DefaultState<RootState[key]> } = {
  settings: DefaultSettingsState,
  verse: DefaultVerseState,
  weather: DefaultWeatherState,
};

/**
 * Configures the store with the given preloaded state.
 *
 * The preloaded state is potentially modified in place to receive default values and remove extra keys.
 * @param preloadedState Preloaded state, typically retrived from browser storage.
 * @param storage Storage service to synchronize state changes to.
 * @returns Created store.
 */
export default function configureStore(preloadedState: object, storage: BrowserStorageServiceInterface) {
  preloadedState = applyDefaults(preloadedState, DefaultRootState);
  return reduxConfigureStore({
    preloadedState,
    reducer: rootReducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(saveToBrowserStorage(storage)),
  });
}

export type CreatedStore = ReturnType<typeof configureStore>;
export type AppDispatch = CreatedStore['dispatch'];

export type AppAsyncThunk<Return, Arg, State> = AsyncThunk<Return, Arg, { state: State; dispatch: AppDispatch }>;

export type StoreKey = Exclude<keyof RootState, typeof $CombinedState>;

export const StoreKeys: StoreKey[] = Object.keys(Reducers) as StoreKey[];
