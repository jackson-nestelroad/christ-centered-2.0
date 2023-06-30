import React from 'react';

import './Page.scss';

interface PageProps {
  children?: React.ReactNode;
  className?: string;
}

function Page({ className, children }: PageProps) {
  return <main className={['page', className].join(' ').trim()}>{children}</main>;
}

Page.defaultProps = {
  children: undefined,
  className: undefined,
};

export default Page;
