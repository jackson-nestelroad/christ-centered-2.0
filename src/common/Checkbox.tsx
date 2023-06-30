import React from 'react';

import './Checkbox.scss';

type CheckboxCallback = () => void;

interface CheckboxProps {
  id?: string;
  checked: boolean;
  disabled?: boolean;
  // eslint-disable-next-line react/no-unused-prop-types
  onClick: CheckboxCallback;
}

function onClick({ disabled, onClick }: CheckboxProps) {
  if (!disabled) {
    onClick();
  }
}

function Checkbox(props: CheckboxProps) {
  const { id, checked, disabled } = props;
  return (
    <span
      className={`checkbox ${checked ? 'checked' : 'unchecked'} ${disabled ? 'disabled' : ''}`}
      onClick={() => onClick(props)}
    >
      <input type="checkbox" id={id} checked={checked} disabled={disabled} readOnly />
      <div className="checkmark-container">
        <div className="checkmark" />
      </div>
    </span>
  );
}

Checkbox.defaultProps = {
  id: '',
  disabled: false,
};

export default Checkbox;
