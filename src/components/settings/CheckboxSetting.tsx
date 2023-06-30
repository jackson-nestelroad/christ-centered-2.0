import React, { useId } from 'react';

import Checkbox from '../../common/Checkbox';
import './CheckboxSetting.scss';

interface CheckboxSettingProps {
  text: string;
  checked: boolean;
  disabled?: boolean;
  onClick: () => void;
}

function CheckboxSetting({ text, checked, disabled, onClick }: CheckboxSettingProps) {
  const id = useId();
  return (
    <div className="checkbox-setting">
      <span className="option">
        <label htmlFor={id}>{text}</label>
      </span>
      <Checkbox id={id} checked={checked} disabled={disabled} onClick={onClick} />
    </div>
  );
}

CheckboxSetting.defaultProps = {
  disabled: false,
};

export default CheckboxSetting;
