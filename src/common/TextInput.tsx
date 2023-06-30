import React, { KeyboardEvent } from 'react';

import './TextInput.scss';

type TextInputCallback = (value: string) => void;

interface TextInputProps {
  id?: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  // eslint-disable-next-line react/no-unused-prop-types
  onChange: TextInputCallback;
  // eslint-disable-next-line react/no-unused-prop-types
  onSubmit: TextInputCallback;
}

function onChange({ disabled, onChange }: TextInputProps, value: string) {
  if (!disabled) {
    onChange(value);
  }
}

function onKeyDown({ value, disabled, onSubmit }: TextInputProps, event: KeyboardEvent<HTMLInputElement>) {
  if (!disabled && (event.key === 'Enter' || event.key === 'NumpadEnter')) {
    onSubmit(value);
  }
}

function TextInput(props: TextInputProps) {
  const { id, value, disabled, placeholder } = props;
  return (
    <input
      id={id}
      type="text"
      className="text-input"
      value={value}
      disabled={disabled}
      placeholder={placeholder}
      onChange={event => onChange(props, event.target.value)}
      onKeyDown={event => onKeyDown(props, event)}
    />
  );
}

TextInput.defaultProps = {
  id: '',
  disabled: false,
  placeholder: '',
};

export default TextInput;
