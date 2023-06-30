import React, { ReactNode, createContext, useContext, useState } from 'react';

import { CreateWeatherService, WeatherServiceInterface } from '../service/weather';

const WeatherContext = createContext<WeatherServiceInterface>(undefined as unknown as any);

interface WeatherProviderState {
  service: WeatherServiceInterface;
}

interface WeatherProviderProps {
  children?: ReactNode;
}

/**
 * WeatherProvider provides an instance of the weather service to the application.
 *
 * Use `useWeather` to access the weather service.
 */
function WeatherProvider({ children }: WeatherProviderProps) {
  const [state] = useState<WeatherProviderState>({
    service: CreateWeatherService(),
  });
  return <WeatherContext.Provider value={state.service}>{children}</WeatherContext.Provider>;
}

WeatherProvider.defaultProps = { children: undefined };

export const useWeather = (): WeatherServiceInterface => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};

export default WeatherProvider;
