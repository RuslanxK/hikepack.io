import React from 'react';
import { createPortal } from 'react-dom';
import { ModalProps } from '../../types/modal';
import { MdCancel } from "react-icons/md";

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 p-2 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="flex items-center justify-center w-full">
        <div className="bg-white dark:bg-theme-dark p-8 rounded-lg shadow-airbnb w-full h-full sm:max-w-lg sm:max-h-full relative">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-black dark:text-white mb-4">{title}</h2>
            <button
              className="text-black dark:text-white hover:text-accent dark:hover:text-accent"
              onClick={onClose}
            >
               <MdCancel size={20} className='mb-5'/>
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
