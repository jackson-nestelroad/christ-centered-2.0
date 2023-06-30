import React, { ReactNode } from 'react';

import BrowserStorageProvider from '../context/BrowserStorage';
import StoreLoader from './StoreLoader';

interface ChristCenteredProps {
  children?: ReactNode;
}

/**
 * ChristCentered sets up all of the contexts and services needed for the application.
 */
function ChristCentered({ children }: ChristCenteredProps) {
  return (
    <BrowserStorageProvider>
      <StoreLoader>{children}</StoreLoader>
    </BrowserStorageProvider>
  );
}

ChristCentered.defaultProps = {
  children: undefined,
};

export default ChristCentered;
