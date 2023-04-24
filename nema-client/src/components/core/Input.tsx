import React from 'react';

export function Input(props: { modelValue?: string; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; label: string; required?: boolean }) {
  return (
    <div className="mb-4">
      <label htmlFor="type">{props.label}:</label>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        id="type"
        name="type"
        value={props.modelValue}
        onChange={props.onChange}
        required={props.required ? true : false}
      />
    </div>
  );
}
