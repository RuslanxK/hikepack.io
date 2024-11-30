import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { DUPLICATE_TRIP } from '../../mutations/tripMutations';
import { AddTripData, DuplicateTripVars, DuplicateTripModalProps } from '../../types/trip';
import { GET_TRIPS } from '../../queries/tripQueries';
import Message from '../message/Message';

const DuplicateTrip: React.FC<DuplicateTripModalProps> = ({ isOpen, onClose, trip }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [duplicateTrip] = useMutation<AddTripData, DuplicateTripVars>(DUPLICATE_TRIP);

  const handleDuplicateTrip = async () => {
    setLoading(true)

    try {
      await duplicateTrip({ variables: { id: trip.id, name: trip.name, about: trip.about, distance: trip.distance, startDate: trip.startDate, endDate: trip.endDate, imageUrl: trip.imageUrl }, 
        refetchQueries: [{ query: GET_TRIPS }],
        });
      onClose();
     
    } catch (e) {
      setError('Error duplicating trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Duplicate Trip">
      <div className="">
        <p className="mb-5 text-base text-accent dark:text-gray-300">
          Are you sure that you want to duplicate <strong>{trip.name}</strong> ? 
        </p>
        <button
          onClick={handleDuplicateTrip}
          className="text-sm bg-primary font-medium w-full text-white p-2 sm:p-3 mb-1 rounded-lg hover:bg-button-hover flex items-center justify-center"
          disabled={loading}
        >
          DUPLICATE
          {loading && <Spinner w={4} h={4}/>}
        </button>
        {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" /> }
      </div>
    </Modal>
  );
};

export default DuplicateTrip;
