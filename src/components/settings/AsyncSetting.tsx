import React, { useState } from 'react';

import { ReactHooks } from '../../hooks';
import './AsyncSetting.scss';
import TextSetting from './TextSetting';

type SaveCallback = (value: string) => Promise<void>;

enum Status {
  Initial,
  Loading,
  Success,
  Failure,
}

interface AsyncSettingProps {
  text: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  failureText: string;
  onSave: SaveCallback;
}

interface AsyncSettingState {
  value: string;
  status: Status;
}

type AsyncSettingHooks = ReactHooks<AsyncSettingState, 'setState'>;

function onChange({ state, setState }: AsyncSettingHooks, value: string) {
  const newStatus = state.status === Status.Loading ? Status.Loading : Status.Initial;
  setState({ ...state, value, status: newStatus });
}

function onSubmit({ state, setState }: AsyncSettingHooks, callback: SaveCallback) {
  if (state.status !== Status.Loading) {
    setState({ ...state, status: Status.Loading });
    callback(state.value)
      .then(() => {
        setState({ ...state, status: Status.Success });
      })
      .catch(() => {
        setState({ ...state, status: Status.Failure });
      });
  }
}

function statusClass(status: Status): string {
  switch (status) {
    case Status.Loading:
      return 'loading';
    case Status.Success:
      return 'success';
    case Status.Failure:
      return 'failure';
    default:
      return '';
  }
}

function helpText({ state }: AsyncSettingHooks, failureText: string): string {
  switch (state.status) {
    case Status.Loading:
      return 'Loading...';
    case Status.Success:
      return 'Success!';
    case Status.Failure:
      return failureText;
    default:
      return 'Press enter to save';
  }
}

function AsyncSetting({ text, value, disabled, placeholder, failureText, onSave }: AsyncSettingProps) {
  const [state, setState] = useState<AsyncSettingState>({ value, status: Status.Initial });
  const hooks = { state, setState };

  return (
    <div className={`async-setting ${statusClass(state.status)}`}>
      <TextSetting
        text={text}
        value={state.value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={value => onChange(hooks, value)}
        onSubmit={() => onSubmit(hooks, onSave)}
      />
      <p className="help">{helpText(hooks, failureText)}</p>
    </div>
  );
}

AsyncSetting.defaultProps = {
  disabled: false,
  placeholder: '',
};

export default AsyncSetting;
