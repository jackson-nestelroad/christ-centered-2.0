import React from 'react';

import './Switch.scss';

type SwitchCallback = () => void;

interface SwitchProps {
  id?: string;
  on: boolean;
  disabled?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClick: SwitchCallback;
}

function onClick({ disabled, onClick }: SwitchProps) {
  if (!disabled) {
    onClick();
  }
}

function Switch(props: SwitchProps) {
  const { id, on, disabled } = props;
  return (
    <div className={`switch ${on ? 'on' : 'off'} ${disabled ? 'disabled' : ''}`} onClick={() => onClick(props)}>
      <input type="checkbox" id={id} checked={on} disabled={disabled} readOnly />
      <span className="slider" />
    </div>
  );
}

Switch.defaultProps = {
  id: '',
  disabled: false,
};

export default Switch;
