import { PayloadAction, SliceCaseReducers, createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { fetchVerseForSearch } from '../../lib/verse';
import { BibleVerse, VerseConfig } from '../../types/bible-verse';
import { Status } from '../../types/status';
import { AppError, CreateAppError } from '../../util/error';
import { startOfDay } from '../../util/time';
import { DefaultState } from '../defaults';
import { RootState } from '../root';

export interface VerseState {
  status: Status;
  verse?: BibleVerse;
  lastFetchedAt?: number;
  error?: AppError;
  config: VerseConfig;
}

export const DefaultVerseState: DefaultState<VerseState> = {
  status: 'idle',
  config: {
    version: 'NIV',
  },
};

export const fetchVerse = createAsyncThunk<BibleVerse, void, { state: RootState }>(
  'verse/fetchVerse',
  async (_: void, { getState }) => {
    const { verse } = getState();
    return fetchVerseForSearch(verse.config, verse.config.search);
  },
);

export const verseSlice = createSlice<VerseState, SliceCaseReducers<VerseState>, 'verse'>({
  name: 'verse',
  initialState: {
    status: 'idle',
    config: {
      version: 'NIV',
    },
  },
  reducers: {
    setVerseSearch: (state, action: PayloadAction<string>) => {
      state.config.search = action.payload;
      state.status = 'idle';
    },
    setVerse: (state, action: PayloadAction<BibleVerse>) => {
      state.verse = action.payload;
      state.status = 'fulfilled';
      state.lastFetchedAt = startOfDay();
    },
    setVersion: (state, action: PayloadAction<string>) => {
      state.config.version = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchVerse.pending, state => {
      state.status = 'loading';
      delete state.error;
    });
    builder.addCase(fetchVerse.fulfilled, (state, action: PayloadAction<BibleVerse>) => {
      state.status = 'fulfilled';
      state.verse = action.payload;
      state.lastFetchedAt = startOfDay();
    });
    builder.addCase(fetchVerse.rejected, (state, action) => {
      state.status = 'rejected';
      state.error = CreateAppError(action.error);
    });
  },
});

export const { setVerseSearch, setVerse, setVersion } = verseSlice.actions;

export default verseSlice.reducer;
