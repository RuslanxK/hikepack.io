import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { FormData } from '../../types/register/formdata';
import { ADD_USER } from '../../mutations/userMutations';
import { useMutation, useQuery } from '@apollo/client';
import { validateStep1, validateStep2 } from '../../utils/validationUtils';
import { CHECK_EMAIL_EXISTENCE } from '../../queries/userQueries';
import Message from '../message/Message';
import useCountries from '../../hooks/useCountries';
import Spinner from '../loading/Spinner';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfigs';

const initialFormData: FormData = { 
  fullName: '', 
  email: '', 
  password: '', 
  confirmPassword: '', 
  profilePicture: null, 
  country: '', 
  dateOfBirth: '', 
  gender: '', 
  distanceUnit: 'miles', 
  weightUnit: 'kg', 
  activityLevel: 'Beginner' 
};

const Register: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [registerError, setRegisterError] = useState<any>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const { countryNameArr } = useCountries();
  const [addUser, { loading: userLoading }] = useMutation(ADD_USER, { onCompleted: () => { navigate('/login'); } });
  const { data } = useQuery(CHECK_EMAIL_EXISTENCE, { variables: { email: formData.email } });

  useEffect(() => {
    if (formData.profilePicture) {
      const objectUrl = URL.createObjectURL(formData.profilePicture);
      setProfilePicturePreview(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setProfilePicturePreview(null);
    }
  }, [formData.profilePicture]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterError(null);
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    if (errors[name]) {
      setErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData((prevData) => ({ ...prevData, profilePicture: e.target.files![0] }));
    }
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1(formData, setErrors)) {
      if (data?.checkEmailExistence) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email already exists',
        }));
        return;
      }
      setStep((prevStep) => prevStep + 1);
    } else if (step === 2 && validateStep2(formData, setErrors)) {
      setStep((prevStep) => prevStep + 1);
    } else if (step === 3) {
      if (formData.profilePicture && formData.profilePicture.size > 2 * 1024 * 1024) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          profilePicture: 'File size should not exceed 2 MB.',
        }));
        return;
      }
      setStep((prevStep) => prevStep + 1);
    } else if (step > 3) {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handlePrevStep = () => setStep((prevStep) => prevStep - 1);


  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    if (loading || userLoading) return;
    setRegisterError(null);
    setLoading(true); 
    let imageUrl = '';
    try {
      if (formData.profilePicture) {
        try {
          const newFormData = new FormData();
          newFormData.append('file', formData.profilePicture);
          const { data } = await axios.post(`${API_BASE_URL}/upload-image`, newFormData, {
            headers: { 'Content-Type': 'multipart/form-data' },
          });
          imageUrl = data.data.Location;
        } catch (error) {
          console.error('File upload failed:', error);
          return;
        }
      }
      await addUser({
        variables: {
          email: formData.email,
          username: formData.fullName,
          password: formData.password,
          birthdate: formData.dateOfBirth,
          weightOption: formData.weightUnit,
          country: formData.country,
          gender: formData.gender,
          distance: formData.distanceUnit,
          activityLevel: formData.activityLevel,
          imageUrl: imageUrl, 
        },
      });
      localStorage.setItem("registrationSuccess", "true");
    } catch (error) {
      setRegisterError("An error occurred")
      console.error('Registration failed:', error);
    } finally {
      setFormData((prevData) => ({ ...prevData, profilePicture: null }));
      setLoading(false); 
    }
  };



  const renderInput = (
    name: keyof FormData,
    label: string,
    type: string = 'text',
    placeholder?: string,
    required?: boolean
  ) => (
    <div className="mb-4">
      <label className="block text-accent text-sm mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        className={`w-full text-sm p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 ${
          errors[name] ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary'
        }`}
        placeholder={placeholder}
      />
      {required && errors[name] && (
        <p className="text-red-500 text-xs mt-1">
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderSelect = (
    name: keyof FormData,
    label: string,
    options: { value: string; label: string }[]
  ) => (
    <div className="mb-4">
      <label className="block text-accent text-sm mb-2">{label}</label>
      <select
        name={name}
        value={formData[name] as string}
        onChange={handleInputChange}
        className="w-full text-sm p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-white">
      <div className="sm:w-full md:w-1/2 bg-cover bg-center relative h-52 sm:h-auto transform scale-x-[-1] sm:scale-x-100" style={{ backgroundImage: `url('/images/hiking.jpg')` }}>
      </div>
      <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
      <img src="/images/logo-black.png" alt="Logo" width={75} className='sm:w-24' />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-10">
        <form className="w-full max-w-sm md:max-w-lg" onSubmit={handleRegister}>
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Register</h2>
            <h3 className="text-sm text-accent">{`Step ${step}: ${
              ['Basic Information', 'Set Your Password', 'Upload Profile Picture', 'Additional Information'][step - 1]
            }`}</h3>
          </div>

          <div className="w-full bg-gray-200 h-2 mb-6 rounded-full">
            <div className="bg-primary h-full rounded-full" style={{ width: `${(step / 4) * 100}%` }}></div>
          </div>

          {step === 1 && (
            <>
              {renderInput('fullName', 'Full Name *', 'text', 'Enter your full name', true)}
              {renderInput('email', 'Email *', 'email', 'Enter your email', true)}
              <button
                type="button"
                onClick={handleNextStep}
                className="w-full bg-primary text-white text-sm p-2 sm:p-3 rounded-lg hover:bg-button-hover transition-colors"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              {renderInput('password', 'Password * (at least 8 characters long numbers and letters)', 'password', 'Enter your password', true)}
              {renderInput('confirmPassword', 'Confirm Password *', 'password', 'Confirm your password', true)}
              <div className="flex flex-col space-y-4 justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-accent text-sm p-2 sm:p-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-primary text-white text-sm p-2 sm:p-3 rounded-lg hover:bg-button-hover transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="mb-4">
                <label className="block text-accent text-sm mb-2">Profile Picture</label>
                {profilePicturePreview ? (
                  <div className="mb-4">
                    <img
                      className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 object-cover"
                      src={profilePicturePreview}
                      alt="Profile Preview"
                    />
                  </div>
                ) : (
                  <div className="mb-4">
                    <img
                      className="w-20 h-20 p-1 rounded-full ring-2 ring-gray-300 dark:ring-gray-500 object-cover"
                      src="/images/default.jpg"
                      alt="Default Avatar"
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept=".png, .jpeg, .jpg"
                  name="file-input"
                  id="file-input"
                  className="block w-full text-sm border border-gray-300 shadow-sm rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary
                  file:bg-gray-50 file:border-0 file:me-4 file:py-3 file:px-4 dark:file:bg-neutral-700 dark:file:text-neutral-400"
                  onChange={handleFileChange}
                />
                {errors.profilePicture && (
                  <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>
                )}
              </div>
              <div className="flex flex-col space-y-4 justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 text-sm p-2 sm:p-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="w-full bg-primary text-white text-sm p-2 sm:p-3 rounded-lg hover:bg-button-hover transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div className="flex flex-wrap -mx-2">
                <div className="w-1/2 px-2">
                  {renderSelect('country', 'Country', countryNameArr.map((country) => ({ value: country, label: country })))}
                </div>
                <div className="w-1/2 px-2">
                  {renderInput('dateOfBirth', 'Date of Birth', 'date')}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-1/2 px-2">
                  {renderSelect('gender', 'Gender', [
                    { value: '', label: 'Select gender' },
                    { value: 'Male', label: 'Male' },
                    { value: 'Female', label: 'Female' },
                    { value: 'Other', label: 'Other' },
                  ])}
                </div>
                <div className="w-1/2 px-2">
                  {renderSelect('distanceUnit', 'Distance Unit', [
                    { value: 'miles', label: 'Miles (mi)' },
                    { value: 'km', label: 'Kilometers (km)' },
                  ])}
                </div>
              </div>
              <div className="flex flex-wrap -mx-2">
                <div className="w-1/2 px-2">
                  {renderSelect('weightUnit', 'Weight Unit', [
                    { value: 'kg', label: 'Kilograms (kg)' },
                    { value: 'lb', label: 'Pounds (lb)' },
                  ])}
                </div>
                <div className="w-1/2 px-2">
                  {renderSelect('activityLevel', 'Activity Level', [
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ])}
                </div>
              </div>
              <div className="flex flex-col space-y-4 justify-between">
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="bg-gray-200 text-gray-700 text-sm p-2 sm:p-3 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Previous
                </button>
                <button
                  type="submit"
                  disabled={loading || userLoading}
                  className="w-full bg-primary text-white text-sm p-2 sm:p-3 rounded-lg hover:bg-button-hover transition-colors"
                >
                 Register  {loading || userLoading ?  <Spinner w={4} h={4} /> : null}
                </button>

                {registerError ? (
                  <Message width="w-full" title="" padding="p-3 sm:p-5" titleMarginBottom="" message={registerError} type="error" />
                ) : null}
              </div>
            </>
          )}

          <div className="mt-4">
            <span className="text-sm text-accent">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
