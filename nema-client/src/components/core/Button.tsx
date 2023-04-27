import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  onClick: () => void;
  type: 'button' | 'submit' | 'reset';
  label: string;
}

const StyledButton = styled.button`
  background-color: var(--primary-color);
  color: var(--text-color);
  border-color: var(--border-color);
  &:hover {
    background-color: var(--block-bg);
  }
  &:focus {
    outline-color: var(--primary-color);
  }
`;

export function Button(props: ButtonProps) {
  return (
    <StyledButton
      onClick={props.onClick}
      type={props.type}
      className="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 font-medium sm:mt-0 sm:w-auto sm:text-sm"
    >
      {props.label}
    </StyledButton>
  );
}
