import React, { useState, useEffect } from 'react';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { useQuery, useMutation } from '@apollo/client';
import axios from 'axios';
import useCountries from '../hooks/useCountries';
import { GET_USER_SETTINGS } from '../queries/userQueries';
import { UPDATE_USER } from '../mutations/userMutations';
import Spinner from './loading/Spinner';
import Message from './message/Message';
import { API_BASE_URL } from '../utils/apiConfigs';


const Settings: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '', username: '', birthdate: '', weightOption: '', distance: '',
    gender: '', activityLevel: '', country: '',
  });
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { countryNameArr } = useCountries();
  const navigate = useNavigate();
  
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER_SETTINGS);
  const [updateUser, { loading: updatingUser, error: updateError }] = useMutation(UPDATE_USER);

  useEffect(() => {
    if (userData?.user) {
      setFormData({
        email: userData.user.email || '', username: userData.user.username || '',
        birthdate: userData.user.birthdate || '', weightOption: userData.user.weightOption || '',
        distance: userData.user.distance || '', gender: userData.user.gender || '',
        activityLevel: userData.user.activityLevel || '', country: userData.user.country || '',
      });
      setProfileImage(userData.user.imageUrl);
    }
  }, [userData]);

  useEffect(() => {
    if (selectedFile) {
      const objectUrl = URL.createObjectURL(selectedFile);
      setPreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
    setPreview(null);
  }, [selectedFile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
  
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      
      if (!validTypes.includes(file.type)) {
        setSelectedFile(null);
        setError('Invalid file type. Only JPG, JPEG, and PNG files are allowed.');
        return;
      }
  
      if (file.size > 2 * 1024 * 1024) { 
        setSelectedFile(null);
        setError('File size should not exceed 2 MB.');
        return;
      }
  
      setSelectedFile(file);
      setError('');
    }
  };



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (updatingUser) return;
  
    let imageUrl = profileImage || '';
  
    if (selectedFile) {
      try {
        const uploadData = new FormData();
        uploadData.append('file', selectedFile);
        uploadData.append('imageUrl', userData.user.imageUrl);
  
        const { data } = await axios.post(`${API_BASE_URL}/upload-image`, uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.data.Location;
      } catch (error) {
        setError('File upload failed');
        return;
      }
    }
  
    try {
      await updateUser({
        variables: {
          ...formData,
          id: userData.user.id,
          imageUrl: imageUrl || undefined,
        },
      });
      
      
      setSelectedFile(null);
      setPreview(null); 
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  
  const commonInputStyles = "w-full text-sm p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary";

  if (loadingUser || errorUser || updateError || error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        {loadingUser && <Spinner w={10} h={10} />}
        {(errorUser || updateError || error) && (
          <Message
            width="w-fit"
            title="Attention Needed"
            padding="sm:p-5 p-3"
            titleMarginBottom="mb-2"
            message="Something went wrong. Please try again later."
            type="error"
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className='p-4 sm:p-10'>
      <div className="w-full min-h-screen flex flex-col items-center justify-right">
        <div className="w-full bg-white dark:bg-box p-5 rounded-lg">
          <div className="flex items-center mb-4">
            <button 
              type="button" 
              className={`mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm`} 
              onClick={() => navigate(-1)}>
              <FaArrowLeft size={17} />
            </button>
            <h1 className="text-xl font-semibold text-left dark:text-white">Settings</h1>
          </div>
          <p className="text-base text-left text-accent dark:text-gray-300 mb-8">
            Manage your account settings and personal preferences.
          </p>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img 
                src={preview || profileImage || '/images/default.jpg'} 
                alt="Profile" 
                className="w-28 h-28 object-cover rounded-full border-4 border-gray-200 dark:border-accent"
              />
              <label className="absolute bottom-0 right-0 bg-button-orange hover:bg-button-hover text-white p-2 rounded-full cursor-pointer">
                <FaEdit />
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".png, .jpeg, .jpg"
                  onChange={handleFileChange} 
                />
              </label>
            </div>
          </div>

          <form className="flex flex-wrap" onSubmit={handleSubmit}>
            {[
              { label: 'Email *', type: 'email', name: 'email', value: formData.email },
              { label: 'Username *', type: 'text', name: 'username', value: formData.username },
              { label: 'Birthdate', type: 'date', name: 'birthdate', value: formData.birthdate },
            ].map(({ label, type, name, value }, idx) => (
              <div key={idx} className=" px-0 sm:px-3 w-full md:w-1/2">
                <label className="block text-accent dark:text-gray-300 mb-2 text-sm">{label}</label>
                <input 
                  type={type} 
                  name={name}
                  value={value}
                  onChange={handleInputChange}
                  className={`${commonInputStyles} mb-5 bg-white dark:bg-black border-zinc-300 dark:border-accent text-zinc-900 dark:text-zinc-100`} 
                  required={name === 'username'} 
                  disabled={name === 'email'}
                />
              </div>
            ))}

            {[
              { label: 'Weight Option', name: 'weightOption', options: [
                  { value: 'kg', label: 'Kilograms (kg)' },
                  { value: 'lb', label: 'Pounds (lb)' },
                ], value: formData.weightOption },
              { label: 'Distance', name: 'distance', options: [
                  { value: 'kilometers', label: 'Kilometers (km)' },
                  { value: 'miles', label: 'Miles (mi)' },
                ], value: formData.distance },
              { label: 'Gender', name: 'gender', options: [
                  { value: 'Male', label: 'Male' },
                  { value: 'Female', label: 'Female' },
                  { value: 'Other', label: 'Other' },
                ], value: formData.gender },
              { label: 'Activity Level', name: 'activityLevel', options: [
                  { value: 'Beginner', label: 'Beginner' },
                  { value: 'Intermediate', label: 'Intermediate' },
                  { value: 'Advanced', label: 'Advanced' },
                ], value: formData.activityLevel },
              { label: 'Country', name: 'country', options: countryNameArr.map((country) => (
                  { value: country, label: country }
                )), value: formData.country },
            ].map(({ label, name, options, value }, idx) => (
              <div key={idx} className="sm:px-3 px-0 w-full md:w-1/2">
                <label className="block text-accent dark:text-gray-300 mb-2 text-sm">{label}</label>
                <select 
                  name={name}
                  value={value}
                  onChange={handleInputChange}
                  className={`${commonInputStyles} mb-5 bg-white dark:bg-black border-zinc-300 dark:border-accent text-zinc-900 dark:text-zinc-100`}
                >
                  <option value="" disabled>Select {label}</option>
                  {options.map(option => (
                    <option 
                      key={option.value} 
                      value={option.value}
                      className="dark:text-zinc-900"
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}

              <button 
                type="submit" 
                disabled={updatingUser}
                className=" mt-5 px-6 py-2 bg-primary text-white rounded-lg text-sm hover:bg-button-hover">
                Save Changes {updatingUser ?  <Spinner w={4} h={4} /> : null}
              </button>
            
          </form>
        </div>
      </div>
      </div>
    </div>
  );
}

export default Settings;
