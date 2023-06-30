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
  const ref = useRef<HTMLDivElement>(null);

  const containerStyle: CSSProperties = {
    ...style,
    width,
  };

  return (
    <div className="hamburger-container" style={containerStyle}>
      <div
        className={`hamburger ${open ? 'open' : 'closed'} ${open ? 'dark' : 'light'}`}
        onClick={() => onClick()}
        ref={ref}
      >
        <div className="line" />
        <div className="line" />
        <div className="line" />
      </div>
    </div>
  );
}
Hamburger.defaultProps = {
  style: undefined,
};

export default Hamburger;
