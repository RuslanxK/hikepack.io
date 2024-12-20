import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_ITEM } from '../../mutations/itemMutation'; 
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { AddLinkModalProps } from '../../types/item';
import Message from '../message/Message';
import { useParams } from 'react-router-dom';
import { GET_BAG } from '../../queries/bagQueries';

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, itemId, itemLink }) => {

  const [link, setLink] = useState(itemLink || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { id } = useParams<{ id: string }>();

  const [UpdateItem] = useMutation(UPDATE_ITEM);

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await UpdateItem({
        variables: { id: itemId, link },
        refetchQueries: [{ query: GET_BAG, variables: { id: id } }]});
      onClose();
    } catch (e) {
      setError('Error saving link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Item Link">
      <form onSubmit={handleSaveLink}>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            className="block w-full p-2 sm:p-3 text-black border border-zinc-300 rounded-lg bg-transparent dark:bg-black dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
            placeholder="e.g., https://example.com"
          />
      
          <button
            type="submit"
            className="mt-4 text-sm bg-primary font-medium w-full text-white p-2 sm:p-3 mb-1 rounded-lg hover:bg-button-hover flex items-center justify-center"
            disabled={loading}
          >
            SAVE
            {loading && <Spinner w={4} h={4}/>}
          </button>
       
          {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message={error} type="error" />}
      </form>
    </Modal>
  );
};

export default AddLinkModal;
