import React, { useState } from 'react';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { AddItemToCategoryModalProps } from '../../types/category';
import { ADD_ITEM } from '../../mutations/itemMutation';
import { AddRecentItemVariables, Item } from '../../types/item';
import { useMutation } from '@apollo/client';
import { GET_BAG } from '../../queries/bagQueries';
import Message from '../message/Message';
import { useParams } from 'react-router-dom';

const AddItemToCategoryModal: React.FC<AddItemToCategoryModalProps> = ({ isOpen, onClose, categories, item}) => {

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryId, setCategoryId] = useState('');

  const [addItem] = useMutation<{ addItem: Item }, AddRecentItemVariables>(ADD_ITEM);

  const { id } = useParams<{ id: string }>();

  const handleAddItemSubmit = async () => {

    setLoading(true);
    setError('');

    try {
        await addItem({
          variables: {
            tripId: item.tripId,
            bagId: item.bagId,
            categoryId: categoryId,
            name: item.name,
            qty: item.qty,
            weight: item.weight || 0,
            priority: item.priority || 'low' ,
            worn: item.worn || false,
            link: item.link || ''
          },
          refetchQueries: [{ query: GET_BAG, variables: { id: id } },
           
          ]

        });

        onClose()
        
    } catch (error) {
      console.error('Error adding item:', error);
      setError('Failed to add the item. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = event.target.value;
    setSelectedCategory(selectedValue);

    const selectedCategoryObject = categories.find(category => category.id === selectedValue);
    
    if (selectedCategoryObject) {
      setCategoryId(selectedCategoryObject.id); 
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Item to Category">
    <div className="mb-4 my-2">
    <select
  className="block mb-5 w-full p-2 sm:p-3 text-accent border border-gray-300 rounded-lg dark:bg-black dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
  value={selectedCategory}
  onChange={handleSelectChange}
>
  <option value="" className="text-base dark:text-zinc-500" hidden>Select Category</option>
  {categories
    .filter(category => category.name.trim() !== '')
    .map((category) => (
      <option key={category.id} value={category.id} className='text-black dark:text-zinc-900'>
        {category.name}
      </option>
    ))}
</select>
</div>
<div>
  <button
    className="text-sm bg-primary font-medium w-full text-white p-2 sm:p-3 mb-1 rounded-lg hover:bg-button-hover flex items-center justify-center"
    disabled={loading || selectedCategory === ''}
    onClick={handleAddItemSubmit}
  >
    ADD
    {loading && <Spinner w={4} h={4}/>}
  </button>
  {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" />}
</div>
    </Modal>
  );
};

export default AddItemToCategoryModal;
