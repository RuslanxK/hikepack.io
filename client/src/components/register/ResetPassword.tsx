import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import Message from '../message/Message';
import Spinner from '../loading/Spinner'; 
import { useMutation } from '@apollo/client';
import { RESET_PASSWORD } from '../../mutations/userMutations';

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{ [key: string]: string }>({});

  const { id } = useParams();
  const navigate = useNavigate();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "password") {
      setPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      setSuccess(data.resetPassword);
      setLoading(false);
    
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    },
    onError: (error) => {
      setError(error.message);
      setLoading(false);
    },
  });

  const validatePassword = () => {
    const errors: { [key: string]: string } = {};
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters long';
    } else if (!strongPasswordRegex.test(password)) {
      errors.password = 'Password must contain at least one letter and one number';
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordReset = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    resetPassword({ variables: { token: id, newPassword: password } });
  };

  return (
    <div className="min-h-screen flex flex-col sm:flex-row bg-white">
     
      <div className="sm:w-full md:w-1/2 bg-cover bg-center relative h-52 sm:h-auto" style={{ backgroundImage: `url('/images/new-password-img.jpg')` }}>
        <div className="absolute top-4 sm:top-8 left-4 sm:left-8">
        <img src="/images/logo-black.png" alt="Logo" width={90} />
        </div>
      </div>

     
      <div className="flex-1 flex flex-col justify-center items-center p-5 sm:p-10">
        <form className="w-full max-w-sm md:max-w-lg" onSubmit={handlePasswordReset}>
          <div className="flex justify-between items-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-black">New Password</h2>
          </div>

          <div className="mb-4">
            <label className="block text-accent text-sm mb-2">New Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={handleInputChange}
              className="w-full text-sm p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter your new password"
              required
            />
            {validationErrors.password && <p className="text-red text-xs mt-1">{validationErrors.password}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-accent text-sm mb-2">Confirm New Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              className="w-full text-sm p-2 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Confirm your new password"
              required
            />
            {validationErrors.confirmPassword && <p className="text-red text-xs mt-1">{validationErrors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white text-sm p-2 sm:p-3 rounded-lg hover:bg-button-hover transition-colors flex items-center justify-center"
            disabled={loading}
          >
            {loading ? <Spinner w={4} h={4} /> : "Reset Password"}
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

export default ResetPassword;
