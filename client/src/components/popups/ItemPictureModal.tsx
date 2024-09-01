import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import Spinner from '../loading/Spinner';
import { ItemPictureModalProps } from '../../types/item';
import Message from '../message/Message';
import axios from 'axios';
import { useMutation } from '@apollo/client';
import { UPDATE_ITEM_PICTURE } from '../../queries/itemQueries';
import { FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../../utils/apiConfigs';

const ItemPictureModal: React.FC<ItemPictureModalProps> = ({ isOpen, onClose, itemId, itemPicLink }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const [updateItem] = useMutation(UPDATE_ITEM_PICTURE);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [selectedFile]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    if (file && file.size > 2 * 1024 * 1024) {
      setSelectedFile(null);
      setError('File size should not exceed 2 MB.');
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
      setError('File size should not exceed 2 MB.');
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
      await updateItem({ variables: { id: itemId, imageUrl } });
      onClose();
    } catch (e) {
      setError('Error updating item picture. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Item Picture">
      <div className="space-y-4 flex flex-col items-center">
        {(preview || itemPicLink) && (
          <div className="flex justify-center">
            <img 
              src={preview || itemPicLink} 
              alt="Selected Preview" 
              className="h-72 w-full object-cover rounded p-2"
            />
          </div>
        )}
        <div
          className={`mt-1 flex justify-center w-full items-center px-6 pt-5 pb-6 border-2 ${
            isDragging ? 'border-blue-500' : 'border-gray-300'
          } border-dashed rounded-md dark:border-zinc-500`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="space-y-1 text-center">
            <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
            <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
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
            <p className="text-xs text-gray-500 dark:text-gray-400">
              PNG, JPG up to 2MB
            </p>
            
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
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
        className="text-sm bg-orange-400 font-medium w-full text-white px-4 py-2.5 mt-4 mb-1 rounded hover:bg-orange-500 flex items-center justify-center"
        onClick={handleSavePicture}
        disabled={loading}
      >
        SAVE {loading && <Spinner w={4} h={4} />}
      </button>
      {error &&  <Message width='w-full' title="" padding="p-5" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" /> }
    </Modal>
  );
};

export default ItemPictureModal;
