import { Middleware } from '@reduxjs/toolkit';

import { BrowserStorageServiceInterface } from '../../service/browser-storage';
import { RootState, StoreKey } from '../root';

export function saveToBrowserStorage(storage: BrowserStorageServiceInterface): Middleware<{}, RootState> {
  return store => next => action => {
    next(action);

    const { type } = action;
    if (type && typeof type === 'string') {
      const index = type.indexOf('/');
      if (index > 0) {
        const prefix = type.substring(0, index);
        const state = store.getState();
        if (state[prefix as StoreKey]) {
          storage
            .saveState(prefix as StoreKey, state[prefix as StoreKey])
            .catch(error => console.error(`Failed to write ${prefix} update to browser storage: ${error}`));
        }
      }
    }
  };
}
