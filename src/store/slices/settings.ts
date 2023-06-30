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
  },
});

export const { setVersion, setTwentyFourHour } = settingsSlice.actions;

export default settingsSlice.reducer;
