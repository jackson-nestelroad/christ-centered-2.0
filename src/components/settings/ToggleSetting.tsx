import React, { useId } from 'react';

import Switch from '../../common/Switch';
import './ToggleSetting.scss';

interface ToggleSettingProps {
  offText: string;
  onText: string;
  on: boolean;
  disabled?: boolean;
  focusable?: boolean;
  onClick: () => void;
}

function ToggleSetting({ offText, onText, on, disabled, focusable, onClick }: ToggleSettingProps) {
  const id = useId();
  return (
    <div className="toggle-setting">
      <span className={`option ${!on ? 'on' : 'off'}`}>{offText}</span>
      <span className="input-container">
        <Switch id={id} on={on} disabled={disabled} focusable={focusable} onClick={onClick} />
      </span>
      <span className={`option ${on ? 'on' : 'off'}`}>
        <label htmlFor={id}>{onText}</label>
      </span>
    </div>
  );
}

ToggleSetting.defaultProps = {
  disabled: false,
  focusable: true,
};

export default ToggleSetting;
