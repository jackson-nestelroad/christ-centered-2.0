import React, { useState } from 'react';

import { Environment } from '../service/environment';
import { useAppSelector } from '../store/hooks';
import './Now.scss';

interface NowState {
  now: Date;
  override?: Date;
}

function addLeadingZero(n: number): string {
  return n < 10 ? `0${n}` : n.toString();
}

function Now() {
  const [state, setState] = useState<NowState>({
    now: new Date(),
  });

  if (Environment.Environment() !== 'production') {
    (globalThis as any).setNow = (now: Date) => {
      setState({ ...state, override: now });
    };
  }

  const { twentyFourHour, hourLeadingZero } = useAppSelector(state => state.settings);

  setTimeout(() => {
    setState(state => ({ ...state, now: new Date() }));
  }, 1000);

  const now = state.override ?? state.now;

  let hours = now.getHours();
  if (!twentyFourHour) {
    hours %= 12;
    if (hours === 0) {
      hours = 12;
    }
  }
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  return (
    <div className="now">
      <p className="time">
        {hourLeadingZero ? addLeadingZero(hours) : hours} {addLeadingZero(minutes)} {addLeadingZero(seconds)}
      </p>
      <p className="date">
        {now.toLocaleDateString(undefined, {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })}
      </p>
    </div>
  );
}

export default Now;
