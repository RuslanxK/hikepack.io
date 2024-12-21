import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string; 
}

const Container: React.FC<ContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`container mx-auto sm:mt-0 sm:p-0 mt-20 p-3 ${className}`}>
      {children}
    </div>
  );
};

export default Container;
