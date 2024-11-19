import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { UPDATE_TRIP } from '../../mutations/tripMutations';
import { UpdateTripData, UpdateTripVars } from '../../types/trip';
import Modal from './Modal';
import Form from '../form/Form';
import Spinner from '../loading/Spinner';
import { UpdateTripModalProps } from '../../types/trip';
import Message from '../message/Message';
import { FaCloudUploadAlt, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfigs';
import { GET_TRIP } from '../../queries/tripQueries';

const UpdateTripModal: React.FC<UpdateTripModalProps> = ({ isOpen, onClose, trip, distanceUnit}) => {
  const [name, setName] = useState(trip.name);
  const [about, setAbout] = useState(trip.about);
  const [distance, setDistance] = useState(trip.distance);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [file, setFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState(trip.imageUrl || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState(trip.imageUrl ? 'Current Image' : '');
  const [isDragging, setIsDragging] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);


  useEffect(() => {
    if (isOpen) {
      setName(trip.name);
      setAbout(trip.about);
      setDistance(trip.distance);
      setStartDate(trip.startDate);
      setEndDate(trip.endDate);
      setSelectedFileName(trip.imageUrl ? 'Current Image' : '');
      setFile(null);
      setOriginalImageUrl(trip.imageUrl || '');
      setIsFileUploaded(!!trip.imageUrl);
    }
  }, [isOpen, trip]);

  const [updateTrip] = useMutation<UpdateTripData, UpdateTripVars>(UPDATE_TRIP);

  

  const handleUpdateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !about || !distance || !startDate || !endDate) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    let imageUrl = originalImageUrl;

    if (file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('imageUrl', trip.imageUrl)
      
        const { data } = await axios.post(`${API_BASE_URL}/upload-image`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        imageUrl = data.data.Location;
      } catch (error) {
        console.error('File upload failed:', error);
        setLoading(false);
        return;
      }
    }

    try {
      await updateTrip({
        variables: { id: trip.id, name, about, distance, startDate, endDate, imageUrl },
        refetchQueries: [{ query: GET_TRIP, variables: { id: trip.id } }],});

      setError('');
      onClose();
    } catch (e) {
      setError('Error updating trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 2 * 1024 * 1024) {
        setError('File size should not exceed 2MB');
        setFile(null);
        setSelectedFileName('');
        setIsFileUploaded(false);
      } else {
        setSelectedFileName(selectedFile.name);
        setFile(selectedFile);
        setIsFileUploaded(true);
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
      setIsFileUploaded(true);
    }
  };

  const renderInputField = (
    label: string,
    type: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder = '',
    min = '',
    max = ''
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-accent dark:text-gray-300 mb-1">{label}</label>
      <input
        type={type}
        onChange={(e) => setValue(e.target.value)}
        className="block w-full p-2 sm:p-3 text-black border border-zinc-300 rounded-lg bg-transparent dark:bg-black dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
        required
        value={value}
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Update Trip">
      <Form onSubmit={handleUpdateTrip}>
        <div className="flex justify-between space-x-4">
          <div className="w-1/2">
            {renderInputField('Name', 'text', name, setName, 'e.g., Hiking in the Alps')}
          </div>
          <div className="w-1/2">
            {renderInputField(`Distance (${distanceUnit})`, 'number', distance, setDistance, `e.g., 100`)}
          </div>
        </div>
        <div className="w-full">
          {renderInputField('Description', 'text', about, setAbout, 'e.g., A thrilling adventure through the mountains.')}
        </div>
        <div className="flex justify-between space-x-4">
          <div className="w-1/2">
            {renderInputField('Start Date', 'date', startDate, setStartDate, '', '', endDate)}
          </div>
          <div className="w-1/2">
            {renderInputField('End Date', 'date', endDate, setEndDate, '', startDate)}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-accent dark:text-gray-300 mb-2 mt-1">
            Update Image
          </label>
          <div
            className={`mt-1 flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
              isDragging ? 'border-blue-500' : 'border-gray-300'
            } border-dashed rounded-md dark:border-zinc-500`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-2 text-center">
              <FaCloudUploadAlt className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex justify-center text-sm text-gray-600 dark:text-gray-300">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-medium text-primary hover:text-button-hover"
                >
                  <span>{isFileUploaded || originalImageUrl ? 'Upload a new file' : 'Upload a file'}</span>
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
              <p className="text-xs text-gray-500 dark:text-gray-400">
                PNG, JPG up to 2MB
              </p>
              {selectedFileName && (
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                  {isFileUploaded && <FaCheckCircle className="mr-2 text-green-500" size={24} />}
                  Selected file: {selectedFileName}
                </p>
              )}
            </div>
          </div>
        </div>
        <button type="submit" className="text-sm bg-primary font-medium w-full text-white p-2 sm:p-3 mb-1 rounded-lg hover:bg-button-hover flex items-center justify-center" disabled={loading}>
          UPDATE
          {loading && <Spinner w={4} h={4} />}
        </button>
        {error &&  <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message="Something went wrong. Please try again later." type="error" /> }
      </Form>
    </Modal>
  );
};

export default UpdateTripModal;
