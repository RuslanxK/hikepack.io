import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

interface GridBoxProps {
  children: React.ReactNode;
  passed?: boolean;
}

const GridBox: React.FC<GridBoxProps> = ({ children, passed }) => {
  return (
    <div
      className={`w-full sm:w-72 h-48 p-7 rounded-lg flex flex-col justify-between relative ${
        passed === false
          ? 'bg-red-100 dark:bg-red-900'
          : 'bg-theme-white dark:bg-box'
      }`}
    >
      {children}

      {passed !== undefined && (
        <div className="flex items-center space-x-2 mt-4 absolute right-5 bottom-5">
          {passed ? (
            <>
              <FaCheckCircle size={20} className="text-primary dark:text-button-lightGreen" />
              <span className="text-primary dark:text-button-lightGreen font-semibold">Passed</span>
            </>
          ) : (
            <>
              <FaTimesCircle size={20} className="text-red-500 dark:text-red-400" />
              <span className="text-red-500 dark:text-red-400 font-semibold">Failed</span>
            </>
          )}
        </div>
      )}

    </div>
  );
};

export default GridBox;
