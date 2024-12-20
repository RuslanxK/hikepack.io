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
import { FaArrowRight, FaArrowLeft, FaCloudUploadAlt, FaCheckCircle } from "react-icons/fa";
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfigs';

const images = Array.from({ length: 8 }, (_, i) => `/images/backpack-${i + 1}.jpg`);

const UpdateBagModal: React.FC<UpdateBagModalProps> = ({ isOpen, onClose, bag, weightUnit }) => {
  const { id } = useParams<{ id: string }>();

  const [name, setName] = useState(bag?.name || '');
  const [description, setDescription] = useState(bag?.description || '');
  const [goal, setGoal] = useState(bag?.goal || '');
  const [selectedImage, setSelectedImage] = useState(bag?.imageUrl || images[0]);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(
    bag?.imageUrl && !images.includes(bag.imageUrl) ? 'Current Image' : ''
  );
  const [isDragging, setIsDragging] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(!!selectedFileName);
  const carouselRef = useRef<HTMLDivElement>(null);

  const [updateBag] = useMutation<UpdateBagData, UpdateBagVars>(UPDATE_BAG);

  useEffect(() => {
    
    if (isOpen && images.includes(selectedImage) && carouselRef.current) {
      const selectedIndex = images.indexOf(selectedImage);
      const imageWidth = 120; 
      const containerWidth = carouselRef.current.offsetWidth;
      const scrollPosition = selectedIndex * imageWidth - containerWidth / 2 + imageWidth / 2;
      carouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
    }
  }, [isOpen, selectedImage]);

  const handleUpdateBag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !goal || !id) {
      setError('Name, Description, Goal, and Trip ID are required.');
      return;
    }

    setLoading(true);
    let imageUrl = selectedImage;

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageUrl', bag.imageUrl); 
        const { data } = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.data.Location;
      } catch (error) {
        console.error('File upload failed:', error);
        setLoading(false);
        setError('Error uploading image. Please try again.');
        return;
      }
    }

    try {
      await updateBag({
        variables: { bagId: bag.id, name, description, goal, imageUrl },
        refetchQueries: [{ query: GET_BAG, variables: { id } }]
      });

      onClose();
    } catch (e) {
      setError('Error updating bag. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // const handlePrevImage = () => {
  //   setSelectedImage((prev) => {
  //     const currentIndex = images.indexOf(prev);
  //     const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
  //     return images[newIndex];
  //   });
  //   if (carouselRef.current) {
  //     carouselRef.current.scrollBy({ left: -150, behavior: 'smooth' });
  //   }
  //   resetFileUpload();
  // };

  // const handleNextImage = () => {
  //   setSelectedImage((prev) => {
  //     const currentIndex = images.indexOf(prev);
  //     const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
  //     return images[newIndex];
  //   });
  //   if (carouselRef.current) {
  //     carouselRef.current.scrollBy({ left: 150, behavior: 'smooth' });
  //   }
  //   resetFileUpload();
  // };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size should not exceed 2MB');
        resetFileUpload();
      } else {
        setSelectedFileName(selectedFile.name);
        setFile(selectedFile);
        setIsFileUploaded(true);
        setSelectedImage('');
        setError('');
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setSelectedFileName(droppedFile.name);
      setFile(droppedFile);
      setSelectedImage('');
    }
  };

  const handleClose = () => {
    setError(''); // Reset only the error state
    onClose(); // Call the original onClose function
  };

  const resetFileUpload = () => {
    setFile(null);
    setSelectedFileName('');
    setIsFileUploaded(false);
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
    <Modal isOpen={isOpen} onClose={handleClose} title="Update Bag">
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

        {/* Carousel for predefined images */}
        {/* <div className="my-4">
          <p className="text-center text-sm font-medium mb-2 text-accent dark:text-gray-300">Select an Image</p>
          <div className="relative flex items-center">
            <button
              type="button"
              onClick={handlePrevImage}
              className="absolute left-0 z-10 bg-gray-200 p-2 rounded hover:bg-gray-300 dark:bg-white dark:hover:bg-gray-600">
              <FaArrowLeft size={14} />
            </button> */}

            {/* <div ref={carouselRef} className="overflow-x-auto flex items-center space-x-4 mx-10 p-1">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Backpack ${index + 1}`}
                  onClick={() => {
                    setSelectedImage(img);
                    resetFileUpload();
                  }}
                  className={`h-24 w-24 object-cover rounded-lg cursor-pointer transition-all duration-300 ${
                    selectedImage === img ? 'border-4 border-primary transform scale-105' : 'border border-gray-300'
                  }`}
                />
              ))}
            </div> */}

            {/* <button
              type="button"
              onClick={handleNextImage}
              className="absolute right-0 z-10 bg-gray-200 p-2 rounded hover:bg-gray-300 dark:bg-white dark:hover:bg-gray-600">
              <FaArrowRight size={14} />
            </button>
          </div>
        </div> */}

        <div className="mb-4">
          <div
            className={`mb-5 flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
              isDragging ? 'border-blue-500' : 'border-gray-300'
            } border-dashed rounded-md dark:border-zinc-500`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}>
            <div className="space-y-2 text-center">
              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-button-hover">
                  <span>{isFileUploaded || selectedFileName ? 'Upload a new file' : 'Upload a file'}</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="sr-only"
                    onChange={handleFileSelect}
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-accent dark:text-gray-400">PNG, JPG up to 2MB</p>

              {selectedFileName && (
                <p className="mt-2 text-sm text-accent dark:text-gray-400 flex items-center">
                  {isFileUploaded || selectedFileName ? <FaCheckCircle className="mr-2 text-green-500" size={24} /> : null }
                  Selected file: {selectedFileName}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="pt-1">
          <button
            type="submit"
            className={`text-sm ${error ? `bg-accent` : `bg-primary`} font-medium w-full text-white p-2 sm:p-3  mb-1 rounded-lg ${error ? null : 'hover:bg-button-hover'} flex items-center justify-center`}  disabled={loading || error === 'File size should not exceed 2MB'}>
            UPDATE
            {loading && <Spinner w={4} h={4} />}
          </button>
        </div>
        { error && <div className='mt-3'>
        <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message={error} type="error" />
        </div>}
      </Form>
    </Modal>
  );
};

export default UpdateBagModal;
