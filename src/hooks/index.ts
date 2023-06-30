import { Dispatch, SetStateAction } from 'react';

import { useGeolocation } from '../context/Geolocation';
import { useWeather } from '../context/Weather';
import { useAppDispatch, useAppSelector } from '../store/hooks';

interface AllStatelessReactHooks {
  dispatch?: ReturnType<typeof useAppDispatch>;
  selector?: ReturnType<typeof useAppSelector>;
  geolocation?: ReturnType<typeof useGeolocation>;
  weather?: ReturnType<typeof useWeather>;
}

interface AllReactHooks<S> extends AllStatelessReactHooks {
  state: S;
  setState?: Dispatch<SetStateAction<S>>;
}

export type ReactHooks<S, K extends keyof AllReactHooks<S>> = Required<Pick<AllReactHooks<S>, 'state' | K>>;

export type StatelessReactHooks<K extends keyof AllStatelessReactHooks> = Required<Pick<AllStatelessReactHooks, K>>;
