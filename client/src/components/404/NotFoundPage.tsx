import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-zinc-900 bg-gray-100">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold text-orange-400 dark:text-orange-300 flex flex-row items-center justify-center">
          4<img src="/images/favicon.ico" alt="Logo" className="w-24 h-24 mx-2" />4
        </h1>
        <p className="text-2xl text-gray-800 dark:text-white mt-4">Oops! Page Not Found</p>
        <p className="text-md text-gray-600 dark:text-gray-300 mt-2">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="w-full mt-6 flex justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-7 py-3 font-semibold text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
