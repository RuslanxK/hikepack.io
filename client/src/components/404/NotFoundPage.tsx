import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-zinc-900 bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-primary flex flex-row items-center justify-center">
          404
        </h1>
        <p className="text-2xl text-gray-800 dark:text-white mt-4">Oops! Page Not Found</p>
        <p className="text-md text-gray-600 dark:text-gray-300 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="w-full mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-7 py-2 text-sm text-white bg-accent rounded-lg hover:bg-gray-400"
          >
            Home page
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
