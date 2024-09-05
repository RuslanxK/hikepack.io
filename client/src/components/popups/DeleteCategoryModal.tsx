import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { DeleteCategoryModalProps } from '../../types/category';
import { DELETE_CATEGORY } from '../../mutations/categoryMutations';
import { DeleteBagData, DeleteBagVars } from '../../types/bag';
import { GET_CATEGORIES } from '../../queries/categoryQueries';
import { useParams } from 'react-router-dom';
import { GET_ALL_ITEMS } from '../../queries/itemQueries';
import Message from '../message/Message';

const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({ isOpen, onClose, categoryId, categoryName}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

   const { id } = useParams()

  const [deleteCategory] = useMutation<DeleteBagData, DeleteBagVars>(DELETE_CATEGORY);

  const handleDeleteCategory = async () => {
    setLoading(true);
    try {
      await deleteCategory({
        variables: { id: categoryId },
        refetchQueries: [{ query: GET_CATEGORIES, variables: { bagId: id }},
        {query: GET_ALL_ITEMS}
        ],
      });
      onClose();
    } catch (e) {
      setError('Error deleting category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Category">
      <div className="">
        <p className="mb-5 text-base text-gray-700 dark:text-gray-300">
          Are you sure that you want to delete <strong>{categoryName}</strong> ? 
        </p>
        <button
          onClick={handleDeleteCategory}
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

export default DeleteCategoryModal;
