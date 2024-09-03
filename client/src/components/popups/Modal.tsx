import React from 'react';
import { createPortal } from 'react-dom';
import { FaTimes } from 'react-icons/fa';
import { ModalProps } from '../../types/modal';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center w-full">
        <div className="bg-white dark:bg-theme-bgDark p-8 rounded-lg shadow-lg w-full h-full sm:max-w-lg sm:max-h-full relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">{title}</h2>
            <button
              className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
              onClick={onClose}
            >
              <FaTimes size={20} />
            </button>
          </div>
          <div className=" h-full box-border">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.getElementById('modals') as HTMLElement
  );
};

export default Modal;
