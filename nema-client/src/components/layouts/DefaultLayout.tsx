// components/layouts/DefaultLayout.tsx
import React, { ReactNode } from 'react';

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 mt-20">{children}</div>;
};

export default DefaultLayout;
