import React from 'react';
import styled from 'styled-components';

export interface SelectOption {
  key: string;
  value: string;
}

interface SelectProps {
  className?: string;
  name?: string;
  label: string;
  id: string;
  options: SelectOption[];
  onChange: (key: string) => void;
}

const StyledSelect = styled.select`
  color: var(--text-color);
  border: 1px solid var(--border-color);
  background-color: var(--bg-color);
  &:focus {
    outline: 2px solid var(--primary-color);
  }
`;

const StyledLabel = styled.label`
  color: var(--text-color);
`;

const Select: React.FC<SelectProps> = ({ id, name, label, className, options, onChange }) => {
  return (
    <div className={className}>
      <StyledLabel htmlFor={id} className="block text-sm font-medium leading-6">
        {label}
      </StyledLabel>
      <div className="mt-2">
        <StyledSelect
          id={id}
          name={name}
          autoComplete="country-name"
          className="p-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-inset sm:max-w-xs sm:text-sm sm:leading-6"
          onChange={(e) => onChange(e.target.value)}
        >
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.value}
            </option>
          ))}
        </StyledSelect>
      </div>
    </div>
  );
};

export default Select;
