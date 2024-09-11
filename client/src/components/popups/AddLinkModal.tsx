import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_ITEM_LINK } from '../../mutations/itemMutation'; 
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { AddLinkModalProps } from '../../types/item';
import Message from '../message/Message';
import { GET_ITEM, GET_ITEMS } from '../../queries/itemQueries';

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose, itemId, categoryId, itemLink }) => {

  const [link, setLink] = useState(itemLink || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [updateItemLink] = useMutation(UPDATE_ITEM_LINK);

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      await updateItemLink({
        variables: { id: itemId, link },
        refetchQueries: [{ query: GET_ITEMS, variables: { categoryId: categoryId } }, { query: GET_ITEM, variables: { id: itemId } },]
        
      });

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
            className="block w-full p-2 sm:p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-opacity-10 dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
            placeholder="e.g., https://example.com"
           
          />
      
        
          <button
            type="submit"
            className="mt-4 text-sm bg-orange-400 font-medium w-full text-white p-2 sm:p-3 mb-1 rounded hover:bg-orange-500 flex items-center justify-center"
            disabled={loading}
          >
            SAVE
            {loading && <Spinner w={4} h={4}/>}
          </button>
       
          {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" />}
      </form>
    </Modal>
  );
};

export default AddLinkModal;
