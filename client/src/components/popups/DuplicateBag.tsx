import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { ADD_BAG } from '../../mutations/bagMutations';
import { DuplicateBagModalProps, DuplicateBagVars, DuplicateBagData } from '../../types/bag';
import { GET_TRIP } from '../../queries/tripQueries';
import Message from '../message/Message';
import { useParams } from 'react-router-dom';

const DuplicateBag: React.FC<DuplicateBagModalProps> = ({ isOpen, onClose, bag }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams<{ id: string }>();

  const tripId = id!;
  const [addBag] = useMutation<DuplicateBagData, DuplicateBagVars>(ADD_BAG);

  const handleDeleteTrip = async () => {
    setLoading(true);

    try {
      await addBag({
        variables: { tripId, name: bag.name, description: bag.description, goal: bag.goal, exploreBags: false },
        refetchQueries: [{ query: GET_TRIP, variables: { id: id } }],
      });
      onClose();
     
    } catch (e) {
      setError('Error deleting trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Duplicate Bag">
      <div className="">
        <p className="mb-5 text-base text-accent dark:text-gray-300">
          Are you sure that you want to duplicate <strong>{bag.name}</strong> ? 
        </p>
        <button
          onClick={handleDeleteTrip}
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

export default DuplicateBag;
