import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../../mutations/userMutations';
import { LoginFormData } from '../../types/login/login';
import Message from '../message/Message';
import Spinner from '../loading/Spinner'; 
import Cookies from 'js-cookie';
import axios from 'axios';
import { useGoogleLogin } from '@react-oauth/google';
import { API_BASE_URL } from '../../utils/apiConfigs';


const initialFormData: LoginFormData = {
  email: '',
  password: '',
};

const Login: React.FC = () => {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");

  const [loginUser, { loading }] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      if (data.loginUser.user.verifiedCredentials) {
        Cookies.set('token', data.loginUser.token, { expires: 1 });
        window.location.href = '/'
      } else {
        setError("Your account is not verified. Please check your email to verify your account.");
      }
    },
    onError: (error) => {
        setError(error.message);
    },
  });

  useEffect(() => {
    const registrationSuccess = localStorage.getItem('registrationSuccess');
    if (registrationSuccess === 'true') {
      setSuccess("Account created successfully. Please check your email to verify your account.");
      localStorage.removeItem('registrationSuccess');
    }
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      await loginUser({ variables: formData });
    } catch (err) {
      console.error(err);
    }
  };

  const loginWithGoogle = useGoogleLogin({

    onSuccess: async (response) => {
      const { access_token } = response;
      if (access_token) {
        try {
          const serverResponse = await axios.post(`${API_BASE_URL}/api/google-login`, { token: access_token });
          if (serverResponse.data.token) {
            Cookies.set('token', serverResponse.data.token, { expires: 1 });
            window.location.href = '/';
          }
        } catch (error) {
          console.log('Error verifying Google token:', error);
          setError('Google login failed. Please try again.');
        }
      } else {
        console.error("No access token received from Google");
        setError('Google login failed. No access token received.');
      }
    },
    onError: (error: any) => {

      console.log('Login Failed:', error)
      setError(error);
    }
  });

  const handleGoogleLoginClick = (e: any) => {
    e.preventDefault();
    loginWithGoogle();
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-white">
    <div className="sm:w-full md:w-1/2 bg-cover bg-center relative h-52 sm:h-auto transform scale-x-[-1] sm:scale-x-100" style={{ backgroundImage: `url('/images/hiking-login.png')` }}>
    </div>
    <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
        <img src="/images/logo-black.png" alt="Logo" className="h-6 sm:h-8" />
      </div>

    {/* Form Section */}
    <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-10">
      <form className="w-full max-w-sm md:max-w-lg" onSubmit={handleLogin}>
        <div className="flex justify-between items-center mb-10 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Login</h2>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full text-sm p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 text-sm mb-2">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full text-sm p-2 sm:p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white text-sm p-2 sm:p-3 rounded hover:bg-blue-600 transition-colors flex items-center justify-center"
          disabled={loading}
        >
          Login {loading && <Spinner w={4} h={4} />}
        </button>

        <button
          onClick={handleGoogleLoginClick}
          className="w-full bg-transparent text-gray-800 text-sm p-2 sm:p-3 mt-3 rounded flex items-center hover:outline-none border border-gray-300 justify-center hover:ring-2 hover:ring-blue-500"
        >
          <FaGoogle className='mr-2 sm:mr-3'/>
          Sign in with Google 
        </button>

        <div className="mt-4 mb-4 flex flex-col sm:flex-row justify-between">
          <span className="text-sm text-gray-600 mb-2 sm:mb-0">
            Don't have an account?{' '}
            <Link to="/register" className="text-blue-500 hover:underline">
              Register
            </Link>
          </span>
          <span className="text-sm text-gray-600">
            <Link to="/reset-password" className="text-blue-500 hover:underline">
              Forgot your password?
            </Link>
          </span>
        </div>

        {error ? (
          <Message width='w-full' title="" padding="p-3 sm:p-5" titleMarginBottom="" message={error} type="error" />
        ) : (
          success && <Message width='w-full' title="" padding="p-3 sm:p-5" titleMarginBottom="" message={success} type="success" />
        )}
      </form>
    </div>
  </div>
  );
};

export default Login;
