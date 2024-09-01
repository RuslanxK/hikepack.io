import React from 'react';
import { FormProps } from '../../types/form';


const Form: React.FC<FormProps> = ({ onSubmit, children }) => {
  return (
    <form onSubmit={onSubmit}>
      {children}
    </form>
  );
};

export default Form;
