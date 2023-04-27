import React from 'react';
import styled from 'styled-components';

interface InputProps {
  modelValue?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  type?: string;
  name?: string;
  id?: string;
}

const Label = styled.label`
  color: var(--heading-color);
`;

const StyledInput = styled.input`
  background-color: var(--bg-color);
  color: var(--text-color);
  box-shadow: 0 0 0 1px var(--border-color);
  transition: box-shadow 0.15s ease-in-out;

  ::placeholder {
    color: var(--text-color);
    opacity: 0.5;
  }

  &:focus {
    box-shadow: 0 0 0 2px var(--primary-color);
    outline: 1px solid var(--primary-color);
    //outline: 5px auto -webkit-focus-ring-color;
  }
`;

const InputDescription = styled.p`
  color: var(--text-color);
  opacity: 0.75;
`;

export function Input(props: InputProps) {
  return (
    <div>
      <Label htmlFor={props.id} className="block text-sm font-medium leading-6">
        {props.label}
      </Label>
      <div className="mt-2">
        <StyledInput
          type={props.type}
          name={props.name}
          id={props.id}
          className="p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
          placeholder={props.placeholder}
          aria-describedby="email-description"
          onChange={props.onChange}
          value={props.modelValue}
        />
      </div>
      <InputDescription className="mt-2 text-sm" id="email-description">
        {props.placeholder}
      </InputDescription>
    </div>
  );
}
