import React from 'react';
import { FaPlus } from 'react-icons/fa';

interface AddButtonProps {
  onClick: () => void;
  className?: string; 
}

const AddButton: React.FC<AddButtonProps> = ({ onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={`bg-white dark:bg-box flex flex-col items-center justify-center border-2 border-dashed border-gray-500 text-gray-500 rounded-lg p-4 cursor-pointer hover:border-primary dark:hover:border-white ${className}`}
      style={{ minHeight: '205px', height: 'calc(100% - 1rem)' }}
    >
      <FaPlus className="text-xl text-accent dark:text-white" />
    </button>
  );
};

export default AddButton;
