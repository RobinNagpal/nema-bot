import React from 'react';

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

export function Input(props: InputProps) {
  return (
    <div>
      <label htmlFor={props.id} className="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
      <div className="mt-2">
        <input
          type={props.type}
          name={props.name}
          id={props.id}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder={props.placeholder}
          aria-describedby="email-description"
          onChange={props.onChange}
        />
      </div>
      <p className="mt-2 text-sm text-gray-500" id="email-description">
        {props.placeholder}
      </p>
    </div>
  );
}
