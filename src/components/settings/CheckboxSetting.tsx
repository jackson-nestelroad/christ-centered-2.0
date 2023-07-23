import React, { useId } from 'react';

import Checkbox from '../../common/Checkbox';
import './CheckboxSetting.scss';

interface CheckboxSettingProps {
  text: string;
  checked: boolean;
  disabled?: boolean;
  focusable?: boolean;
  onClick: () => void;
}

function CheckboxSetting({ text, checked, disabled, focusable, onClick }: CheckboxSettingProps) {
  const id = useId();
  return (
    <div className="checkbox-setting">
      <span className="option">
        <label htmlFor={id}>{text}</label>
      </span>
      <span className="input-container">
        <Checkbox id={id} checked={checked} disabled={disabled} focusable={focusable} onClick={onClick} />
      </span>
    </div>
  );
}

CheckboxSetting.defaultProps = {
  disabled: false,
  focusable: true,
};

export default CheckboxSetting;
