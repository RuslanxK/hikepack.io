import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_TRIP } from '../../mutations/tripMutations';
import { DeleteTripData, DeleteTripVars } from '../../types/trip';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { DeleteTripModalProps } from '../../types/trip';
import { GET_TRIPS } from '../../queries/tripQueries';
import Message from '../message/Message';
import { GET_ALL_ITEMS } from '../../queries/itemQueries';
import { GET_LATEST_BAG_WITH_DETAILS } from '../../queries/bagQueries';

const DeleteTripModal: React.FC<DeleteTripModalProps> = ({ isOpen, onClose, trip}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const [deleteTrip] = useMutation<DeleteTripData, DeleteTripVars>(DELETE_TRIP);

  const handleDeleteTrip = async () => {
    setLoading(true);
    try {
      await deleteTrip({
        variables: { id: trip.id },
        refetchQueries: [{ query: GET_TRIPS }, {query: GET_ALL_ITEMS,}, {query: GET_LATEST_BAG_WITH_DETAILS}],
      });
      onClose();
    } catch (e) {
      setError('Error deleting trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Trip">
      <div className="">
        <p className="mb-5 text-base text-gray-700 dark:text-gray-300">
          Are you sure that you want to delete <strong>{trip.name}</strong> ? 
        </p>
        <button
          onClick={handleDeleteTrip}
          className="text-sm bg-red-500 font-medium w-full text-white p-2 sm:p-3 mb-1 rounded hover:bg-red-600 flex items-center justify-center"
          disabled={loading}
        >
          DELETE
          {loading && <Spinner w={4} h={4} />}
        </button>
        {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" /> }
      </div>
    </Modal>
  );
};

export default DeleteTripModal;
