import { PayloadAction, SliceCaseReducers, createSlice } from '@reduxjs/toolkit';
import { Language } from 'daily-bread';

import { DefaultState } from '../defaults';

export interface SettingsState {
  twentyFourHour: boolean;
  background?: number;
  language: Language;
}

export const DefaultSettingsState: DefaultState<SettingsState> = {
  twentyFourHour: false,
  background: undefined,
  language: Language.English,
};

export const settingsSlice = createSlice<SettingsState, SliceCaseReducers<SettingsState>, 'settings'>({
  name: 'settings',
  initialState: {
    twentyFourHour: false,
    background: undefined,
    language: Language.English,
  },
  reducers: {
    setTwentyFourHour: (state, action: PayloadAction<boolean>) => {
      state.twentyFourHour = action.payload;
    },
    setBackground: (state, action: PayloadAction<number | undefined>) => {
      const value = action.payload ? action.payload - 1 : action.payload;
      state.background = value;
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload;
    },
  },
});

export const { setTwentyFourHour, setBackground, setLanguage } = settingsSlice.actions;

export default settingsSlice.reducer;
