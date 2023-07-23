import React, { RefObject, useLayoutEffect, useRef, useState } from 'react';

import { StateRefReactHooks, defaultSetStateRef } from '../hooks';
import './Switch.scss';

type SwitchCallback = () => void;

interface SwitchProps {
  id?: string;
  on: boolean;
  disabled?: boolean;
  focusable?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClick: SwitchCallback;
}

interface SwitchState {
  active: boolean;
}

type SwitchHooks = StateRefReactHooks<SwitchState, 'setStateRef'> & {
  input: RefObject<HTMLInputElement>;
};

function onClick({ input }: SwitchHooks, { disabled, onClick }: SwitchProps) {
  if (disabled) {
    return;
  }

  input.current!.focus();
  onClick();
}

function onKeyDown(hooks: SwitchHooks, event: KeyboardEvent) {
  const { stateRef, setStateRef, input } = hooks;
  const state = stateRef.current;
  if (event.code === 'Space') {
    if (!state.active && document.activeElement === input.current) {
      setStateRef({ ...state, active: true });
    }
  }
}

function onKeyUp({ stateRef, setStateRef }: SwitchHooks, _: KeyboardEvent) {
  const state = stateRef.current;
  if (state.active) {
    setStateRef({ ...state, active: false });
  }
}

function Switch(props: SwitchProps) {
  const { id, on, disabled, focusable } = props;
  const [state, setState] = useState<SwitchState>({ active: false });
  const stateRef = useRef(state);
  const setStateRef = defaultSetStateRef(stateRef, setState);
  const input = useRef<HTMLInputElement>(null);
  const hooks: SwitchHooks = { stateRef, setStateRef, input };

  useLayoutEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => onKeyDown(hooks, event);
    const keyUpHandler = (event: KeyboardEvent) => onKeyUp(hooks, event);

    document.addEventListener('keydown', keyDownHandler, { passive: false });
    document.addEventListener('keyup', keyUpHandler, { passive: false });
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
    };
  }, []);

  return (
    <div
      className={`switch ${on ? 'on' : 'off'} ${disabled ? 'disabled' : ''} ${state.active ? 'active' : 'inactive'}`}
      aria-checked={on}
      aria-disabled={disabled}
      onClick={() => onClick(hooks, props)}
    >
      <input
        type="checkbox"
        id={id}
        checked={on}
        disabled={disabled}
        readOnly
        tabIndex={disabled || !focusable ? -1 : 0}
        ref={input}
      />
      <span className="slider" />
    </div>
  );
}

Switch.defaultProps = {
  id: '',
  disabled: false,
  focusable: true,
};

export default Switch;
