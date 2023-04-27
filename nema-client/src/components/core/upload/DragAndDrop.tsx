// src/DragAndDrop.tsx
import { PhotoIcon } from '@heroicons/react/24/solid';
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';

interface DragAndDropProps {
  onUpload: (acceptedFiles: File[]) => void;
  label: string;
}

const StyledDragAndDrop = styled.div`
  .text-color {
    color: var(--text-color);
  }
  .border-color {
    border-color: var(--border-color);
  }
  .primary-color {
    color: var(--primary-color);
  }
  .primary-color:hover {
    color: var(--primary-color-hover);
  }
  .focus-within-primary-color {
    --tw-ring-color: var(--primary-color);
  }
  .hover-primary-color:hover {
    color: var(--primary-color-hover);
  }
`;

const DragAndDrop: React.FC<DragAndDropProps> = ({ label, onUpload }) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onUpload(acceptedFiles);
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
  });

  return (
    <StyledDragAndDrop {...getRootProps()} className="col-span-full">
      <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-color">
        {label}
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-color px-6 py-10">
        <div className="text-center">
          <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
          <div className="mt-4 flex text-sm leading-6 text-color">
            <label
              htmlFor="file-upload"
              className="relative cursor-pointer rounded-md bg-white font-semibold primary-color focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within-primary-color hover-primary-color"
            >
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" {...getInputProps()} />
            </label>
            <p className="pl-1">or drag and drop</p>
          </div>
          <p className="text-xs leading-5 text-color">PDF up to 10MB</p>
        </div>
      </div>
    </StyledDragAndDrop>
  );
};

export default DragAndDrop;
