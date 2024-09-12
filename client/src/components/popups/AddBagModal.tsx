import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_TRIP } from '../../queries/tripQueries';
import { ADD_BAG } from '../../mutations/bagMutations';
import { AddBagData, AddBagVars } from '../../types/bag';
import Modal from './Modal';
import Form from '../form/Form';
import Spinner from '../loading/Spinner';
import { AddBagModalProps } from '../../types/bag';
import { useParams } from 'react-router-dom';
import Message from '../message/Message';

const AddBagModal: React.FC<AddBagModalProps> = ({ isOpen, onClose, weightUnit }) => {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [addBag] = useMutation<AddBagData, AddBagVars>(ADD_BAG);

  const handleAddBag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !goal || !id) {
      setError('Name, Description, Goal, and Trip ID are required.');
      return;
    }

    setLoading(true);

    try {
      await addBag({
        variables: { tripId: id, name, description, goal, exploreBags: false },
        refetchQueries: [{ query: GET_TRIP, variables: { id: id } }],
      });
      
      setName('');
      setDescription('');
      setGoal('');
      onClose();
    } catch (e) {
      setError('Error adding bag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderInputField = <T extends string | number>(
    label: string,
    type: string,
    setValue: React.Dispatch<React.SetStateAction<T>>,
    placeholder = '',
    min = '',
    max = ''
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        onChange={(e) => setValue(type === 'number' ? (e.target.value as unknown as T) : e.target.value as T)}
        className="block w-full p-2 sm:p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-opacity-10 dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
        required
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Bag">
    <Form onSubmit={handleAddBag}>
      <div className="flex justify-between space-x-4">
        <div className="w-1/2">
          {renderInputField('Name', 'text', setName, 'e.g., Hiking Bag')}
        </div>
        <div className="w-1/2">
          {renderInputField(`Weight Goal (${weightUnit})`, 'number', setGoal, 'e.g., 12.5', '0', '100')}
        </div>
      </div>
      <div className="w-full">
        {renderInputField('Description', 'text', setDescription, 'e.g., Write something about this bag.')}
      </div>
      <div className="pt-1">
        <button
          type="submit"
          className="mt-3 text-sm bg-button font-medium w-full text-white p-2 sm:p-3 mb-1 rounded hover:bg-button-hover flex items-center justify-center"
          disabled={loading}
        >
          CREATE
          {loading && <Spinner w={4} h={4} />}
        </button>
      </div>
      {error && <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" /> }
    </Form>
  </Modal>
  
  );
};

export default AddBagModal;
