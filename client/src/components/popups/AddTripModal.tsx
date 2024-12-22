import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { GET_TRIPS} from '../../queries/tripQueries';
import { ADD_TRIP } from '../../mutations/tripMutations';
import { AddTripData, AddTripVars } from '../../types/trip';
import Modal from './Modal';
import Form from '../form/Form';
import Spinner from '../loading/Spinner';
import { AddTripModalProps } from '../../types/trip';
import Message from '../message/Message';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfigs';
import { getSteps } from '../../guide/steps';
import { createTripStepsConfig } from '../../guide/stepsConfigs';
import JoyrideWrapper from '../../guide/JoyrideWrapper';
import { useJoyride } from '../../hooks/useJoyride';

const AddTripModal: React.FC<AddTripModalProps> = ({ isOpen, onClose, distanceUnit }) => {
  const [name, setName] = useState('');
  const [about, setAbout] = useState('');
  const [distance, setDistance] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  const isJoyrideRun = useJoyride('step-2');

  const [addTrip] = useMutation<AddTripData, AddTripVars>(ADD_TRIP);

  const handleAddTrip = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    let imageUrl = null;

    if (!file) {
      try {
        const getPicture = await fetch(
          `https://api.unsplash.com/search/photos?query=hiking&per_page=20&${process.env.REACT_APP_UNSPLASH_CLIENT}`
        );
        const pictureData = await getPicture.json();
  
        if (pictureData.results && pictureData.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * pictureData.results.length);
          imageUrl = pictureData.results[randomIndex].urls.regular;
        } else {
          throw new Error("No images found in the Unsplash response.");
        }
      } catch (error) {
        console.error('Error fetching Unsplash image:', error);
        setLoading(false);
        setError('Unable to fetch hiking image. Please try again.');
        return;
      }
    }
    
      if (file) {
        try {
          const formData = new FormData();
          formData.append('file', file);
          const { data } = await axios.post(`${API_BASE_URL}/upload-image`, formData, {headers: { 'Content-Type': 'multipart/form-data'}});
          console.log(data)
          imageUrl = data.data.Location; 
        } catch (error) {
          console.error('File upload failed:', error);
          setLoading(false);
          return;
        }
      }
      try {
      await addTrip({ variables: { name, about, distance, startDate, endDate, imageUrl, }, 
      refetchQueries: [{ query: GET_TRIPS }],
      });
  
      setName('');
      setAbout('');
      setDistance('');
      setStartDate('');
      setEndDate('');
      setFile(null);
      setSelectedFileName('');
      onClose();
    } catch (e) {
      setError('Error adding trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleClose = () => {
    setName('');
    setAbout('');
    setDistance('');
    setStartDate('');
    setEndDate('');
    setFile(null);
    setSelectedFileName('');
    setIsFileUploaded(false);
    setError(''); // Reset error state
    onClose();
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
    }
  };




  const renderInputField = (
    label: string,
    type: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    placeholder = '',
    min = '',
    max = ''
  ) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-accent dark:text-gray-300 mb-1">{label} *</label>
      <input
        type={type}
        onChange={(e) => setValue(e.target.value)}
        className="block w-full p-2 sm:p-3 text-black border border-zinc-300 rounded-lg bg-transparent dark:bg-black dark:border-zinc-600 dark:text-white focus:outline-none focus:outline-primary focus:outline-2"
        required
        min={min}
        max={max}
        placeholder={placeholder}
      />
    </div>
  );

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Trip">
      {isJoyrideRun && <JoyrideWrapper steps={getSteps(createTripStepsConfig)} run={true} />}
      <Form onSubmit={handleAddTrip}>
      <div className="flex justify-between space-x-4">
  <div className="w-1/2 trip-name">
    {renderInputField('Name', 'text', setName, 'e.g., Hiking in the Alps')}
  </div>
  <div className="w-1/2 trip-distance">
    {renderInputField(`Distance (${distanceUnit})`, 'number', setDistance, `e.g., 100`, '0')}
  </div>
</div>
<div className="w-full trip-description">
  {renderInputField('Description', 'text', setAbout, 'e.g., A thrilling adventure through the mountains.')}
</div>
<div className="flex justify-between space-x-4">
  <div className="w-1/2 trip-start-date">
    {renderInputField('Start Date', 'date', setStartDate, '', '', endDate)}
  </div>
  <div className="w-1/2 trip-end-date">
    {renderInputField('End Date', 'date', setEndDate, '', startDate)}
  </div>
</div>

<div className="mb-4 trip-image">
  <label className="block text-sm font-medium text-accent dark:text-gray-300 mb-2 mt-1">
    Upload Image
  </label>
  <div
    className={`mb-5 flex justify-center items-center px-6 pt-5 pb-6 border-2 ${
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
         <span>{isFileUploaded ? 'Upload a new file' : 'Upload a file'}</span>
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
      <p className="text-xs text-accent dark:text-gray-400">
        PNG, JPG up to 2MB
      </p>
      
      {selectedFileName && (
        <p className="mt-2 text-sm text-accent dark:text-gray-400 flex items-center">
          {isFileUploaded && (
        <FaCheckCircle className="mr-2 text-green-500" size={24} />
      )}Selected file: {selectedFileName}
        </p>
      )}
    </div>
  </div>
</div>

        <button type="submit" className={`trip-submit-button text-sm ${error ? `bg-accent` : `bg-primary`} font-medium w-full text-white p-2 sm:p-3  mb-1 rounded-lg ${error ? null : 'hover:bg-button-hover'} flex items-center justify-center`}  disabled={loading || error === 'File size should not exceed 2MB'}>
          CREATE
          {loading && <Spinner w={4} h={4}/>}
        </button>
       { error && <div className='mt-3'>
        <Message width='w-full' title="" padding="p-5 sm:p-3" titleMarginBottom="" message={error} type="error" />
        </div>}
      </Form>
    </Modal>
  );
};

export default AddTripModal;
