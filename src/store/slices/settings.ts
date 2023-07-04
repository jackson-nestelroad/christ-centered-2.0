import { PayloadAction, SliceCaseReducers, createSlice } from '@reduxjs/toolkit';

import { DefaultState } from '../defaults';

export interface SettingsState {
  twentyFourHour: boolean;
  background?: number;
}

export const DefaultSettingsState: DefaultState<SettingsState> = {
  twentyFourHour: false,
  background: undefined,
};

export const settingsSlice = createSlice<SettingsState, SliceCaseReducers<SettingsState>, 'settings'>({
  name: 'settings',
  initialState: {
    twentyFourHour: false,
    background: undefined,
  },
  reducers: {
    setTwentyFourHour: (state, action: PayloadAction<boolean>) => {
      state.twentyFourHour = action.payload;
    },
    setBackground: (state, action: PayloadAction<number | undefined>) => {
      const value = action.payload ? action.payload - 1 : action.payload;
      state.background = value;
    },
  },
});

export const { setVersion, setTwentyFourHour, setBackground } = settingsSlice.actions;

export default settingsSlice.reducer;
