import React, { useRef, useState } from 'react';
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
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

const images = Array.from({ length: 8 }, (_, i) => `/images/backpack-${i + 1}.jpg`);

const AddBagModal: React.FC<AddBagModalProps> = ({ isOpen, onClose, weightUnit }) => {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [goal, setGoal] = useState('');
  const [selectedImage, setSelectedImage] = useState(images[0]); 
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

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
        variables: {
          tripId: id,
          name,
          description,
          goal,
          exploreBags: false,
          imageUrl: selectedImage, 
        },
        refetchQueries: [{ query: GET_TRIP, variables: { id: id } }],
      });

      setName('');
      setDescription('');
      setGoal('');
      setSelectedImage(images[0]); 
      onClose();
    } catch (e) {
      setError('Error adding bag. Please try again.');
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
    placeholder = '',
    min = '',
    max = ''
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-accent dark:text-gray-300 mb-1">
        {label} *
      </label>
      <input
        type={type}
        onChange={(e) =>
          setValue(
            type === 'number'
              ? (e.target.value as unknown as T)
              : e.target.value as T
          )
        }
        className="block w-full p-2 sm:p-3 text-black border border-zinc-300 rounded-lg bg-transparent dark:bg-black dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
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
            {renderInputField(
              `Weight Goal (${weightUnit})`,
              'number',
              setGoal,
              'e.g., 12.5',
              '0',
              '100'
            )}
          </div>
        </div>
        <div className="w-full">
          {renderInputField(
            'Description',
            'text',
            setDescription,
            'e.g., Write something about this bag.'
          )}
        </div>

        <div className="my-4">
          <p className="text-center text-sm font-medium mb-2 text-accent dark:text-gray-300">Select an Image</p>
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-0 z-10 bg-gray-200 p-2 rounded hover:bg-gray-300 dark:bg-white dark:hover:bg-gray-600"
            >
              <FaArrowLeft size={14} />
            </button>

            <div
              ref={carouselRef}
              className="overflow-x-auto flex items-center space-x-4 mx-10 p-1"
            >
              {images.map((img, index) => (
                <img
                  key={index}
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
            CREATE
            {loading && <Spinner w={4} h={4} />}
          </button>
        </div>
        {error && (
          <Message
            width="w-full"
            title=""
            padding="p-5 sm:p-3"
            titleMarginBottom=""
            message="Something went wrong. Please try again later."
            type="error"
          />
        )}
      </Form>
    </Modal>
  );
};

export default AddBagModal;
