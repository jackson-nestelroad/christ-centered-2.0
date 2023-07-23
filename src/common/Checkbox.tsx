import React, { RefObject, useLayoutEffect, useRef, useState } from 'react';

import { StateRefReactHooks, defaultSetStateRef } from '../hooks';
import './Checkbox.scss';

type CheckboxCallback = () => void;

interface CheckboxProps {
  id?: string;
  checked: boolean;
  disabled?: boolean;
  focusable?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClick: CheckboxCallback;
}

interface CheckboxState {
  active: boolean;
}

type CheckboxHooks = StateRefReactHooks<CheckboxState, 'setStateRef'> & {
  input: RefObject<HTMLInputElement>;
};

function onClick({ input }: CheckboxHooks, { disabled, onClick }: CheckboxProps) {
  if (disabled) {
    return;
  }

  input.current!.focus();
  onClick();
}

function onKeyDown(hooks: CheckboxHooks, event: KeyboardEvent) {
  const { stateRef, setStateRef, input } = hooks;
  const state = stateRef.current;
  if (event.code === 'Space') {
    if (!state.active && document.activeElement === input.current) {
      setStateRef({ ...state, active: true });
    }
  }
}

function onKeyUp({ stateRef, setStateRef }: CheckboxHooks, _: KeyboardEvent) {
  const state = stateRef.current;
  if (state.active) {
    setStateRef({ ...state, active: false });
  }
}

function Checkbox(props: CheckboxProps) {
  const { id, checked, disabled, focusable } = props;
  const [state, setState] = useState<CheckboxState>({ active: false });
  const stateRef = useRef(state);
  const setStateRef = defaultSetStateRef(stateRef, setState);
  const input = useRef<HTMLInputElement>(null);
  const hooks: CheckboxHooks = { stateRef, setStateRef, input };

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
    <span
      className={`checkbox ${checked ? 'checked' : 'unchecked'} ${disabled ? 'disabled' : ''} ${
        state.active ? 'active' : 'inactive'
      }`}
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={() => onClick(hooks, props)}
    >
      <input
        type="checkbox"
        id={id}
        checked={checked}
        disabled={disabled}
        readOnly
        tabIndex={disabled || !focusable ? -1 : 0}
        ref={input}
      />
      <div className="checkmark-container">
        <div className="checkmark" />
      </div>
    </span>
  );
}

Checkbox.defaultProps = {
  id: '',
  disabled: false,
  focusable: true,
};

export default Checkbox;
