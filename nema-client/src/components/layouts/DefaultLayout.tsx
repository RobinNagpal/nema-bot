// components/layouts/DefaultLayout.tsx
import React, { ReactNode } from 'react';

type DefaultLayoutProps = {
  children: ReactNode;
};

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <main className="bg-white px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:py-32">
      <div className="mx-auto max-w-5xl mt-10">{children}</div>
    </main>
  );
};

export default DefaultLayout;
