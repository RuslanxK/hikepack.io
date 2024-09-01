import { FormData } from '../types/register/formdata';

export const validateStep1 = (formData: FormData, setErrors: (errors: { [key: string]: string }) => void) => {
  const newErrors: { [key: string]: string } = {};

  // Validate Full Name
  if (!formData.fullName) {
    newErrors.fullName = 'Full Name is required';
  } else if (formData.fullName.length < 3) {
    newErrors.fullName = 'Full Name must be at least 3 characters long';
  }

  // Validate Email
  if (!formData.email) {
    newErrors.email = 'Email is required';
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

export const validateStep2 = (formData: FormData, setErrors: (errors: { [key: string]: string }) => void) => {
  const newErrors: { [key: string]: string } = {};

  // Validate Password
  if (!formData.password) {
    newErrors.password = 'Password is required';
  } else if (formData.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters long';
  } else {
    const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!strongPasswordRegex.test(formData.password)) {
      newErrors.password = 'Password must contain at least one letter and one number';
    }
  }

  // Validate Confirm Password
  if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = 'Passwords do not match';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
