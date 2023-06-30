import React, { ReactNode } from 'react';

import BrowserStorageProvider from '../context/BrowserStorage';
import GeolocationProvider from '../context/Geolocation';
import WeatherProvider from '../context/Weather';
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
      <StoreLoader>
        <GeolocationProvider>
          <WeatherProvider>{children}</WeatherProvider>
        </GeolocationProvider>
      </StoreLoader>
    </BrowserStorageProvider>
  );
}

ChristCentered.defaultProps = {
  children: undefined,
};

export default ChristCentered;
