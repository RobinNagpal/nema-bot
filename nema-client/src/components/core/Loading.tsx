// Loading.tsx
import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  animation: ${spin} 1s linear infinite;
  border-color: var(--primary-color);
  height: 4rem;
  width: 4rem;
  border-width: 0.25rem;
  border-style: solid;
  border-radius: 50%;
`;

const Loading: React.FC = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <Loader />
    </div>
  );
};

export default Loading;
