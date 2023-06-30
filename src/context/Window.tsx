import React, { ReactNode, createContext, useContext, useLayoutEffect } from 'react';
import { useState } from 'react';

export interface WindowSize {
  width: number;
  height: number;
}

const WindowSizeContext = createContext<WindowSize>(undefined as unknown as any);

interface WindowSizeProviderProps {
  children?: ReactNode;
}

function WindowSizeProvider({ children }: WindowSizeProviderProps) {
  const [state, setState] = useState<WindowSize>({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const onResize = () => {
      setState({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', () => onResize(), { capture: false, passive: true });
    onResize();
    return () => window.removeEventListener('resize', () => onResize());
  }, []);

  return <WindowSizeContext.Provider value={state}>{children}</WindowSizeContext.Provider>;
}

WindowSizeProvider.defaultProps = {
  children: undefined,
};

export function useWindowSize() {
  const context = useContext(WindowSizeContext);
  if (!context) {
    throw new Error('useWindowSize must be used within a WindowSizeProvider');
  }
  return context;
}

export default WindowSizeProvider;
