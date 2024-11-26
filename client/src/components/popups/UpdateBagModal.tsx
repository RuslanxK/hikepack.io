import React, { useRef, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_BAG } from '../../mutations/bagMutations';
import { GET_BAG } from '../../queries/bagQueries';
import { UpdateBagData, UpdateBagVars, UpdateBagModalProps } from '../../types/bag';
import Modal from './Modal';
import Form from '../form/Form';
import Spinner from '../loading/Spinner';
import { useParams } from 'react-router-dom';
import Message from '../message/Message';
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const images = Array.from({ length: 8 }, (_, i) => `/images/backpack-${i + 1}.jpg`);

const UpdateBagModal: React.FC<UpdateBagModalProps> = ({ isOpen, onClose, bag, weightUnit }) => {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState(bag?.name || '');
  const [description, setDescription] = useState(bag?.description || '');
  const [goal, setGoal] = useState(bag?.goal || '');
  const [selectedImage, setSelectedImage] = useState(bag?.imageUrl || images[0]); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const selectedImageRef = useRef<HTMLImageElement>(null);

  const [updateBag] = useMutation<UpdateBagData, UpdateBagVars>(UPDATE_BAG);

  useEffect(() => {
    if (isOpen && selectedImageRef.current) {
      selectedImageRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [isOpen, selectedImage]);

  const handleUpdateBag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !goal || !id) {
      setError('Name, Description, Goal, and Trip ID are required.');
      return;
    }
    setLoading(true);
    try {
      await updateBag({
        variables: { bagId: bag.id, name, description, goal, imageUrl: selectedImage },
        refetchQueries: [{ query: GET_BAG, variables: { id: id } }]
      });

      onClose();
    } catch (e) {
      setError('Error updating bag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevImage = () => {
    setSelectedImage((prev) => {
      const currentIndex = images.indexOf(prev);
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
      return images[newIndex];
    });
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -150, behavior: 'smooth' });
    }
  };

  const handleNextImage = () => {
    setSelectedImage((prev) => {
      const currentIndex = images.indexOf(prev);
      const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
      return images[newIndex];
    });
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const renderInputField = <T extends string | number>(
    label: string,
    type: string,
    setValue: React.Dispatch<React.SetStateAction<T>>,
    value: T,
    placeholder = '',
    min = '',
    max = ''
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-accent dark:text-gray-300 mb-1">{label} *</label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(type === 'number' ? (e.target.value as unknown as T) : e.target.value as T)}
        className="block w-full p-2 sm:p-3 text-black border border-zinc-300 rounded-lg bg-transparent dark:bg-black dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
        required
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Bag">
      <Form onSubmit={handleUpdateBag}>
        <div className="flex justify-between space-x-4">
          <div className="w-1/2">
            {renderInputField('Name', 'text', setName, name, 'e.g., Hiking Bag')}
          </div>
          <div className="w-1/2">
            {renderInputField(`Goal (${weightUnit})`, 'number', setGoal, goal, 'e.g., 12.5', '0', '100')}
          </div>
        </div>
        <div className="w-full">
          {renderInputField('Description', 'text', setDescription, description, 'e.g., Write something about this bag.')}
        </div>

       
        <div className="my-4">
          <p className="text-center text-sm font-medium mb-2 text-accent dark:text-gray-300">Select an Image</p>
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-0 z-10 bg-gray-200 p-2 rounded hover:bg-gray-300 dark:bg-white dark:hover:bg-gray-600">
              <FaArrowLeft size={14} />
            </button>

            <div
              ref={carouselRef}
              className="overflow-x-auto flex items-center space-x-4 mx-10 p-1"
            >
              {images.map((img, index) => (
                <img
                  key={index}
                  ref={img === selectedImage ? selectedImageRef : null}
                  src={img}
                  alt={`Backpack ${index + 1}`}
                  onClick={() => setSelectedImage(img)}
                  className={`h-32 w-32 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedImage === img
                      ? 'border-4 border-primary transform scale-105'
                      : 'border border-gray-300'
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-0 z-10 bg-gray-200 p-2 rounded hover:bg-gray-300 dark:bg-white dark:hover:bg-gray-600"
            >
              <FaArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            className="mt-3 text-sm bg-primary font-medium w-full text-white p-2 sm:p-3 mb-1 rounded-lg hover:bg-button-hover flex items-center justify-center"
            disabled={loading}
          >
            UPDATE
            {loading && <Spinner w={4} h={4} />}
          </button>
        </div>
        {error && <Message width="w-full" title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" />}
      </Form>
    </Modal>
  );
};

export default UpdateBagModal;
