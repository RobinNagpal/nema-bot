import { useState } from 'react';

export interface DropdownProps {
  options: string[];
  handleCreateClick?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
}

const Dropdown = ({ options, handleCreateClick, handleEdit, handleDelete }: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (option: string) => {
    if (option == 'Create') {
      handleCreateClick?.();
    }
    if (option == 'Edit') {
      handleEdit?.();
    }
    if (option == 'Delete') {
      handleDelete?.();
    }
    setIsOpen(false);
  };

  return (
    <div className="">
      <button className="inline-flex items-center px-4 font-medium text-gray-700 bg-white" onClick={() => setIsOpen(!isOpen)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
          />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute z-10 mt-2 rounded-md bg-white shadow-lg">
          {options?.map((option) => (
            <button
              key={option}
              className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
