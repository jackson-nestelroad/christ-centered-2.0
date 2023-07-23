import React, { CSSProperties, useRef } from 'react';

import './Hamburger.scss';

type HamburgerStateChangeCallback = () => void;

interface HamburgerProps {
  width: string;
  style?: CSSProperties;
  open: boolean;
  onClick: HamburgerStateChangeCallback;
}

function Hamburger({ width, style, open, onClick }: HamburgerProps) {
  const ref = useRef<HTMLButtonElement>(null);

  const containerStyle: CSSProperties = {
    ...style,
    width,
  };

  return (
    <div className="hamburger-container" style={containerStyle}>
      <button
        type="button"
        className={`hamburger ${open ? 'open' : 'closed'} ${open ? 'dark' : 'light'}`}
        onClick={() => onClick()}
        ref={ref}
        tabIndex={0}
      >
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </button>
    </div>
  );
}
Hamburger.defaultProps = {
  style: undefined,
};

export default Hamburger;
