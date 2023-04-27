import React from 'react';
import styled from 'styled-components';

interface FormProps {
  heading: string;
  infoText: string;
  children: React.ReactNode;
  onSave: (event: React.MouseEvent) => void;
  onCancel?: () => void;
}

const StyledForm = styled.form`
  .border-color {
    border-color: var(--border-color);
  }
  .text-color {
    color: var(--text-color);
  }
  .link-color {
    color: var(--link-color);
  }
  .heading-color {
    color: var(--heading-color);
  }
  .primary-color {
    background-color: var(--primary-color);
  }
  .primary-color:hover {
    background-color: var(--primary-color-hover);
  }
`;

export default function Form(props: FormProps) {
  return (
    <StyledForm className="w-full">
      <div className="space-y-12">
        <div className="border-b border-color pb-12">
          {props.heading && <h2 className="text-base font-semibold leading-7 heading-color">{props.heading}</h2>}
          {props.infoText && <p className="mt-1 text-sm leading-6 text-color">{props.infoText}</p>}
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8">{props.children}</div>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {props.onCancel && (
          <button type="button" className="text-sm font-semibold leading-6 link-color">
            Cancel
          </button>
        )}
        <button
          type="button"
          className="rounded-md primary-color px-3 py-2 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={props.onSave}
        >
          Save
        </button>
      </div>
    </StyledForm>
  );
}
