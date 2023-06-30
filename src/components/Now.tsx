import React, { useState } from 'react';

import { useAppSelector } from '../store/hooks';
import './Now.scss';

interface TimeState {
  now: Date;
}

function addLeadingZero(n: number): string {
  return n < 10 ? `0${n}` : n.toString();
}

function Now() {
  const [state, setState] = useState<TimeState>({
    now: new Date(),
  });

  const { twentyFourHour } = useAppSelector(state => state.settings);

  setTimeout(() => {
    setState({ now: new Date() });
  }, 1000);

  let hours = state.now.getHours();
  if (!twentyFourHour) {
    hours %= 12;
    if (hours === 0) {
      hours = 12;
    }
  }
  const minutes = state.now.getMinutes();
  const seconds = state.now.getSeconds();

  return (
    <div className="now">
      <p className="time">
        {addLeadingZero(hours)} {addLeadingZero(minutes)} {addLeadingZero(seconds)}
      </p>
      <p className="date">
        {state.now.toLocaleDateString(undefined, {
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
