import React from 'react';

interface ButtonProps {
  onClick: () => void;
  type: 'button' | 'submit' | 'reset';
  label: string;
}

export function Button(props: ButtonProps) {
  return (
    <button
      onClick={props.onClick}
      type={props.type}
      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
    >
      {props.label}
    </button>
  );
}
