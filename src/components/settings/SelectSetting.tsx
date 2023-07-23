import React, { Key, useId } from 'react';

import Dropdown, { DropdownOptions } from '../../common/Dropdown';
import './SelectSetting.scss';

type SelectCallback<T> = (value: T) => void;

interface SelectSettingProps<T extends Key> {
  text: string;
  options: DropdownOptions<T>;
  value?: T;
  disabled?: boolean;
  placeholder?: string;
  onSelect: SelectCallback<T>;
}

function SelectSetting<T extends Key>({
  text,
  options,
  value,
  disabled,
  placeholder,
  onSelect,
}: SelectSettingProps<T>) {
  const id = useId();
  return (
    <div className="text-setting">
      <div className="label">
        <label htmlFor={id}>{text}</label>
      </div>
      <span className="input-container">
        <Dropdown
          id={id}
          options={options}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onSelect={onSelect}
        />
      </span>
    </div>
  );
}

SelectSetting.defaultProps = {
  value: undefined,
  disabled: false,
  placeholder: '',
};

export default SelectSetting;
