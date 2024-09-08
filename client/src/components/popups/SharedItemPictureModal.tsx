import React from 'react';
import Modal from './Modal';

interface SharedItemPictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageAlt: string;
}

const SharedItemPictureModal: React.FC<SharedItemPictureModalProps> = ({ isOpen, onClose, imageUrl, imageAlt }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Image">
      <div className="text-center">
        <div className="relative w-full max-w-lg mx-auto">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="w-full h-auto object-cover rounded"
          />
        </div>
      </div>
    </Modal>
  );
};

export default SharedItemPictureModal;
