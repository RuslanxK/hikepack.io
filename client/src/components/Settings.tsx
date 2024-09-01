import React, { useState, useEffect } from 'react';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import { useQuery, useMutation } from '@apollo/client';
import axios from 'axios';
import useCountries from '../hooks/useCountries';
import { GET_USER, UPDATE_USER } from '../queries/userQueries';
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
  
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);
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
    if (file && file.size > 2 * 1024 * 1024) {
      setSelectedFile(null);
      setError('File size should not exceed 2 MB.');
    } else {
      setSelectedFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const commonInputStyles = "w-full text-sm p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500";

  if (loadingUser || errorUser || updateError || error) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        {loadingUser && <Spinner w={10} h={10} />}
        {(errorUser || updateError || error) && (
          <Message
            width="w-fit"
            title="Attention Needed"
            padding="p-5"
            titleMarginBottom="mb-2"
            message="Something went wrong. Please try again later."
            type="error"
          />
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-10">
      <div className="w-full min-h-screen flex flex-col items-center justify-right">
        <div className="w-full">
          <div className="flex items-center mb-4">
            <button 
              type="button" 
              className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm" 
              onClick={() => navigate(-1)}>
              <FaArrowLeft size={17} />
            </button>
            <h1 className="text-xl font-semibold text-left dark:text-white">Settings</h1>
          </div>
          <p className="text-base text-left text-gray-600 dark:text-gray-300 mb-8">
            Manage your account settings and personal preferences.
          </p>

          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <img 
                src={preview || profileImage || '/images/default.jpg'} 
                alt="Profile" 
                className="w-28 h-28 object-cover rounded-full border-4 border-gray-300 dark:border-gray-700"
              />
              <label className="absolute bottom-0 right-0 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full cursor-pointer">
                <FaEdit />
                <input 
                  type="file" 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
            </div>
          </div>

          <form className="flex flex-wrap justify-center" onSubmit={handleSubmit}>
            {[
              { label: 'Email', type: 'email', name: 'email', value: formData.email },
              { label: 'Username', type: 'text', name: 'username', value: formData.username },
              { label: 'Birthdate', type: 'date', name: 'birthdate', value: formData.birthdate },
            ].map(({ label, type, name, value }, idx) => (
              <div key={idx} className="px-3 w-full md:w-1/2">
                <label className="block text-gray-600 dark:text-gray-300 mb-2 text-sm">{label}</label>
                <input 
                  type={type} 
                  name={name}
                  value={value}
                  onChange={handleInputChange}
                  className={`${commonInputStyles} mb-5 bg-white dark:bg-box border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100`} 
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
              <div key={idx} className="px-3 w-full md:w-1/2">
                <label className="block text-gray-600 dark:text-gray-300 mb-2 text-sm">{label}</label>
                <select 
                  name={name}
                  value={value}
                  onChange={handleInputChange}
                  className={`${commonInputStyles} mb-5 bg-white dark:bg-box border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100`}
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

            <div className="px-3 w-full">
              <button 
                type="submit" 
                className="px-6 py-2 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700">
                Save Changes {updatingUser ?  <Spinner w={4} h={4}/> : null}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;
