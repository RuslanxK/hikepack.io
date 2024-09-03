import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { DeleteBagModalProps } from '../../types/bag';
import { DELETE_BAG } from '../../queries/bagQueries';
import { DeleteBagData, DeleteBagVars } from '../../types/bag';
import { GET_BAGS } from '../../queries/bagQueries';
import Message from '../message/Message';
import { GET_ALL_ITEMS } from '../../queries/itemQueries';

const DeleteBagModal: React.FC<DeleteBagModalProps> = ({ isOpen, onClose, bag }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const [deleteBag] = useMutation<DeleteBagData, DeleteBagVars>(DELETE_BAG);

  const handleDeleteTrip = async () => {
    setLoading(true);
    try {
      await deleteBag({
        variables: { id: bag.id },
        refetchQueries: [{ query: GET_BAGS, variables: { tripId: bag.tripId } },
          { query: GET_ALL_ITEMS }
        ],
      });
      onClose();
     
    } catch (e) {
      setError('Error deleting trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Bag">
      <div className="">
        <p className="mb-5 text-base text-gray-700 dark:text-gray-300">
          Are you sure that you want to delete <strong>{bag.name}</strong> ? 
        </p>
        <button
          onClick={handleDeleteTrip}
          className="text-sm bg-red-500 font-medium w-full text-white p-2 sm:p-3 mb-1 rounded hover:bg-red-600 flex items-center justify-center"
          disabled={loading}
        >
          DELETE
          {loading && <Spinner w={4} h={4}/>}
        </button>
        {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" /> }
      </div>
    </Modal>
  );
};

export default DeleteBagModal;
