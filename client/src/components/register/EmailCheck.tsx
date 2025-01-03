import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import Message from '../message/Message';
import Spinner from '../loading/Spinner'; 
import { useMutation } from '@apollo/client';
import { SEND_RESET_PASSWORD_LINK } from '../../mutations/userMutations';

const EmailCheck: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const [sendResetPasswordLink] = useMutation(SEND_RESET_PASSWORD_LINK, {
    onCompleted: (data) => {
      setSuccess(data.sendResetPasswordLink);
      setLoading(false);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const handleEmailCheck = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    sendResetPasswordLink({ variables: { email } });
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-white">
  
      <div className="sm:w-full md:w-1/2 bg-cover bg-center relative h-52 sm:h-auto" style={{ backgroundImage: `url('/images/reset-password-background.jpg')` }}>
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
         <img src="/images/logo-white.png" alt="Logo" width={75} className='sm:w-24'/>
        </div>
      </div>

    
      <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-10">
        <form className="w-full max-w-sm md:max-w-lg" onSubmit={handleEmailCheck}>
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">Reset Password</h2>
          </div>

          <div className="mb-4">
            <label className="block text-accent text-sm mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleInputChange}
              className="w-full text-sm p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your email"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white text-sm p-2 sm:p-3 rounded-lg hover:bg-button-hover transition-colors flex items-center justify-center"
            disabled={loading}
          >
            Send Reset Link {loading ? <Spinner w={4} h={4} /> : null}
          </button>

          <div className="mt-4 mb-4 flex flex-col sm:flex-row justify-between">
            <span className="text-sm text-accent mb-2 sm:mb-0">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </span>
            <span className="text-sm text-accent">
              <Link to="/login" className="text-primary hover:underline">
                Back to Login
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

export default EmailCheck;
