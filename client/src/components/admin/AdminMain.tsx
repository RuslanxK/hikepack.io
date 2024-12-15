import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const AdminMain = () => {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className="p-4 sm:p-10">
        <div className="bg-white dark:bg-box p-5 rounded-lg mb-8">
          <div className="mb-4 flex items-center">
            <button
              type="button"
              className="mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm"
              onClick={() => navigate(-1)} 
            >
              <FaArrowLeft size={17} />
            </button>
            <h1 className="text-xl font-semibold text-black dark:text-white">Admin Panel</h1>
          </div>
          <p className="text-left text-accent dark:text-gray-300">
            Manage and monitor your application's admin functionalities.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div
            className="flex items-center justify-center p-8 bg-primary text-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate('/dashboard')}
          >
            <h2 className="text-xl font-medium">Go to Admin Dashboard</h2>
          </div>
          <div
            className="flex items-center justify-center p-8 bg-button-purple text-white rounded-lg shadow-lg hover:shadow-xl cursor-pointer transform transition-transform hover:scale-105"
            onClick={() => navigate('/admin-settings')}
          >
            <h2 className="text-xl font-medium">Go to Admin Settings</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMain;
