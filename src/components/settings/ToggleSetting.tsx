import React, { useId } from 'react';

import Switch from '../../common/Switch';
import './ToggleSetting.scss';

interface ToggleSettingProps {
  headerText?: string;
  offText: string;
  onText: string;
  on: boolean;
  disabled?: boolean;
  focusable?: boolean;
  onClick: () => void;
}

function ToggleSetting({ headerText, offText, onText, on, disabled, focusable, onClick }: ToggleSettingProps) {
  const id = useId();
  return (
    <div className="toggle-setting">
      {headerText ? <label htmlFor={id}>{headerText}</label> : null}
      <div className="toggle-container">
        <span className={`option ${!on ? 'on' : 'off'}`}>{offText}</span>
        <span className="input-container">
          <Switch id={id} on={on} disabled={disabled} focusable={focusable} onClick={onClick} />
        </span>
        <span className={`option ${on ? 'on' : 'off'}`}>
          <label htmlFor={id}>{onText}</label>
        </span>
      </div>
    </div>
  );
}

ToggleSetting.defaultProps = {
  headerText: undefined,
  disabled: false,
  focusable: true,
};

export default ToggleSetting;
