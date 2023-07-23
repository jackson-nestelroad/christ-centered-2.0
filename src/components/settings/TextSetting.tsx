import React, { useId } from 'react';

import TextInput from '../../common/TextInput';
import './TextSetting.scss';

type TextInputCallback = (value: string) => void;

interface TextSettingProps {
  text: string;
  value: string;
  disabled?: boolean;
  focusable?: boolean;
  placeholder?: string;
  onChange: TextInputCallback;
  onSubmit: TextInputCallback;
}

function TextSetting({ text, value, disabled, focusable, placeholder, onChange, onSubmit }: TextSettingProps) {
  const id = useId();
  return (
    <div className="text-setting">
      <div className="label">
        <label htmlFor={id}>{text}</label>
      </div>
      <span className="input-container">
        <TextInput
          id={id}
          value={value}
          disabled={disabled}
          focusable={focusable}
          placeholder={placeholder}
          onChange={onChange}
          onSubmit={onSubmit}
        />
      </span>
    </div>
  );
}

TextSetting.defaultProps = {
  disabled: false,
  focusable: true,
  placeholder: '',
};

export default TextSetting;
