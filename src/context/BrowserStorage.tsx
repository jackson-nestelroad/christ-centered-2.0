import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';

import ShowAppError from '../components/ShowAppError';
import { BrowserStorageServiceInterface, CreateBrowserStorageService } from '../service/browser-storage';
import { AppError, CreateAppError } from '../util/error';

const BrowserStorageContext = createContext<BrowserStorageServiceInterface>(undefined as unknown as any);

interface BrowserStorageProviderState {
  service?: BrowserStorageServiceInterface;
  error?: AppError;
}

interface BrowserStorageProviderProps {
  children?: ReactNode;
}

/**
 * BrowserStorageProvider provides an instance of the browser storage service to the application.
 *
 * Use `useBrowserStorage` to access the browser storage.
 */
function BrowserStorageProvider({ children }: BrowserStorageProviderProps) {
  const [state, setState] = useState<BrowserStorageProviderState>({
    service: undefined,
    error: undefined,
  });
  useEffect(() => {
    CreateBrowserStorageService()
      .then(service => {
        setState({ ...state, service });
      })
      .catch(error => setState({ ...state, error: CreateAppError(error) }));
  }, []);
  if (!state.service) {
    if (state.error) {
      return <ShowAppError error={state.error} />;
    }
    return null;
  }
  return <BrowserStorageContext.Provider value={state.service}>{children}</BrowserStorageContext.Provider>;
}

BrowserStorageProvider.defaultProps = {
  children: undefined,
};

export const useBrowserStorage = (): BrowserStorageServiceInterface => {
  const context = useContext(BrowserStorageContext);
  if (!context) {
    throw new Error('useBrowserStorage must be used within a BrowserStorageProvider');
  }
  return context;
};

export default BrowserStorageProvider;
