import React, { ReactNode, createContext, useContext, useState } from 'react';

import { CreateGeolocationService, GeolocationServiceInterface } from '../service/geolocation';

const GeolocationContext = createContext<GeolocationServiceInterface>(undefined as unknown as any);

interface GeolocationProviderState {
  service: GeolocationServiceInterface;
}

interface GeolocationProviderProps {
  children?: ReactNode;
}

/**
 * GeolocationProvider provides an instance of the geolocation service to the application.
 *
 * Use `useGeolocation` to access the geolocation service.
 */
function GeolocationProvider({ children }: GeolocationProviderProps) {
  const [state] = useState<GeolocationProviderState>({
    service: CreateGeolocationService(),
  });
  return <GeolocationContext.Provider value={state.service}>{children}</GeolocationContext.Provider>;
}

GeolocationProvider.defaultProps = { children: undefined };

export const useGeolocation = (): GeolocationServiceInterface => {
  const context = useContext(GeolocationContext);
  if (!context) {
    throw new Error('useGeolocation must be used within a GeolocationProvider');
  }
  return context;
};

export default GeolocationProvider;
