import React, { useId } from 'react';

import TextInput from '../../common/TextInput';
import './TextSetting.scss';

type TextInputCallback = (value: string) => void;

interface TextSettingProps {
  text: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  onChange: TextInputCallback;
  onSubmit: TextInputCallback;
}

function TextSetting({ text, value, disabled, placeholder, onChange, onSubmit }: TextSettingProps) {
  const id = useId();
  return (
    <div className="text-setting">
      <div className="label">
        <label htmlFor={id}>{text}</label>
      </div>
      <TextInput
        id={id}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        onSubmit={onSubmit}
      />
    </div>
  );
}

TextSetting.defaultProps = {
  disabled: false,
  placeholder: '',
};

export default TextSetting;
