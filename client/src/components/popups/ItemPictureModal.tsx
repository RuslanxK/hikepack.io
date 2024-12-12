import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { ItemPictureModalProps } from '../../types/item';
import Message from '../message/Message';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { UPDATE_ITEM_PICTURE } from '../../mutations/itemMutation';
import { FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/apiConfigs';
import { GET_BAG } from '../../queries/bagQueries';
import {useParams } from 'react-router-dom';
import Form from '../form/Form';

const ItemPictureModal: React.FC<ItemPictureModalProps> = ({ isOpen, onClose, itemId, itemPicLink }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const [updateItem] = useMutation(UPDATE_ITEM_PICTURE);

  const { id } = useParams<{ id: string }>();


  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [selectedFile]);


  const handleClose = () => {

      setError('')
      onClose()
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && file.size > 2 * 1024 * 1024) {
      setSelectedFile(null);
      setError('File size should not exceed 2MB');
      setIsFileUploaded(false);
      return;
    }

    setSelectedFile(file);
    setError('');
    setIsFileUploaded(true);
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
    if (droppedFile && droppedFile.size <= 2 * 1024 * 1024) {
      setSelectedFile(droppedFile);
      setIsFileUploaded(true);
      setError('');
    } else {
      setError('File size should not exceed 2MB');
      setIsFileUploaded(false);
    }
  };

  const handleSavePicture = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let imageUrl = '';
    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('imageUrl', itemPicLink);

        const { data } = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.data.Location;
      } catch (error) {
        console.error('File upload failed:', error);
        setError('File upload failed');
        setLoading(false);
        return;
      }
    }

    try {
      await updateItem({ variables: { id: itemId, imageUrl },  
      refetchQueries: [{ query: GET_BAG, variables: { id: id } }]});

      
      onClose();
    } catch (e) {
      setError('Error updating item picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Item Picture">
      <Form onSubmit={handleSavePicture}>
      <div className="space-y-4 flex flex-col items-center">
        {(preview || itemPicLink) && (
          <div className="flex justify-center">
            <img 
              src={preview || itemPicLink} 
              alt="Selected Preview" 
              className="h-72 w-full object-cover  p-2"
            />
          </div>
        )}
        <div
          className={`mt-1 flex justify-center w-full items-center px-6 pt-5 pb-6 border-2 ${
            isDragging ? 'border-primary' : 'border-gray-300'
          } border-dashed rounded-md dark:border-zinc-500`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-accent" />
            <div className="flex justify-center text-sm text-accent dark:text-gray-300">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-primary hover:text-button-hover"
              >
                <span>{isFileUploaded ? 'Upload a new file' : 'Upload a file'}</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-accent dark:text-gray-400">
              PNG, JPG up to 2MB
            </p>
            
            {selectedFile && (
              <p className="mt-2 text-sm text-accent dark:text-gray-400 flex items-center">
                {isFileUploaded && (
                  <FaCheckCircle className="mr-2 text-green-500" size={24} />
                )}
                Selected file: {selectedFile.name}
              </p>
            )}
          </div>
        </div>
      </div>
      <button
        type='submit'
        className={`text-sm ${error ? `bg-accent` : `bg-primary`} font-medium w-full text-white p-2 sm:p-3 mt-4  mb-1 rounded-lg ${error ? null : 'hover:bg-button-hover'} flex items-center justify-center`}  disabled={loading || error === 'File size should not exceed 2MB'}>
        SAVE {loading && <Spinner w={4} h={4} />}
      </button>
      { error && <div className='mt-3'>
        <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message={error} type="error" />
        </div>}
        </Form>
    </Modal>
  );
};

export default ItemPictureModal;
