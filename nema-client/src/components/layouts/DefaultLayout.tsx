import React, { ReactNode } from 'react';
import styled from 'styled-components';

type DefaultLayoutProps = {
  children: ReactNode;
};

const Main = styled.main`
  background-color: var(--bg-color);
`;

const DefaultLayout: React.FC<DefaultLayoutProps> = ({ children }) => {
  return (
    <Main className="px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:px-8 lg:py-32  h-screen	">
      <div className="mx-auto max-w-5xl mt-10">{children}</div>
    </Main>
  );
};

export default DefaultLayout;
