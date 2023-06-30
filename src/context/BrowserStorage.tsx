import React, { ReactNode, createContext, useContext, useState } from 'react';

import { BrowserStorageServiceInterface, CreateBrowserStorageService } from '../service/browser-storage';

const BrowserStorageContext = createContext<BrowserStorageServiceInterface>(undefined as unknown as any);

interface BrowserStorageProviderState {
  service: BrowserStorageServiceInterface;
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
  const [state] = useState<BrowserStorageProviderState>({
    service: CreateBrowserStorageService(),
  });
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
