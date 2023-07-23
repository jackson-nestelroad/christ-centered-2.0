import { Dispatch, MutableRefObject, SetStateAction } from 'react';

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

export type SetStateRefFn<S> = (prev: S) => void;

interface AllStateRefReactHooks<S> extends AllStatelessReactHooks {
  stateRef: MutableRefObject<S>;
  setStateRef?: SetStateRefFn<S>;
}

export type ReactHooks<S, K extends keyof AllReactHooks<S>> = Required<Pick<AllReactHooks<S>, 'state' | K>>;

export type StatelessReactHooks<K extends keyof AllStatelessReactHooks> = Required<Pick<AllStatelessReactHooks, K>>;

export type StateRefReactHooks<S, K extends keyof AllStateRefReactHooks<S>> = Required<
  Pick<AllStateRefReactHooks<S>, 'stateRef' | K>
>;

export function defaultSetStateRef<S>(stateRef: MutableRefObject<S>, setState: Dispatch<SetStateAction<S>>) {
  return (next: S) => {
    stateRef.current = next;
    setState(next);
  };
}
