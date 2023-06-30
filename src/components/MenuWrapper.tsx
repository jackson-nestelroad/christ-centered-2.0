import React, { CSSProperties, useState } from 'react';

import Hamburger from '../common/Hamburger';
import Menu from './Menu';
import './MenuWrapper.scss';

interface MenuWrapperProps {
  children?: React.ReactNode;
}

interface MenuWrapperState {
  open: boolean;
}

const width = '16rem';

function MenuWrapper({ children }: MenuWrapperProps) {
  const [state, setState] = useState<MenuWrapperState>({
    open: false,
  });

  const containerStyle: CSSProperties = {
    transform: state.open ? `translateX(${width})` : undefined,
  };

  const menuStyle: CSSProperties = {
    width,
    marginLeft: `-${width}`,
  };

  return (
    <>
      <Hamburger
        width="1.375rem"
        style={{ zIndex: 1 }}
        open={state.open}
        onClick={() => setState({ ...state, open: !state.open })}
      />
      <div className="menu-wrapper-container" style={containerStyle}>
        <div className="menu-wrapper-menu" style={menuStyle}>
          <Menu />
        </div>
        <div className="menu-wrapper-content">{children}</div>
      </div>
    </>
  );
}

MenuWrapper.defaultProps = {
  children: undefined,
};

export default MenuWrapper;
