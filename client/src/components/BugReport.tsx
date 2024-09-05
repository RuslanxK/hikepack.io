import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_BUG_REPORT } from '../mutations/bugReportMutation';
import Message from './message/Message';
import Spinner from './loading/Spinner'; 


const BugReport: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [addBugReport] = useMutation(ADD_BUG_REPORT);

  const commonButtonStyles = "w-full text-sm p-2 sm:p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const commonInputStyles = "w-full text-sm p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const commonLabelStyles = "block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    setLoading(true); 
    try {
      const { data } = await addBugReport({ variables: { title, description } });
      setLoading(false); 
      if (data.addBugReport.success) {
        setSuccessMessage('Bug report submitted successfully');
        setTitle('');
        setDescription('');
      } else {
        setErrorMessage('Failed to submit bug report');
      }
    } catch (error) {
      setLoading(false); 
      console.error('Error submitting bug report:', error);
      setErrorMessage('Failed to submit bug report');
    }
  };

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className='p-4 sm:p-10'>
      <div className="mb-4 flex items-center">
        <button 
          type="button" 
          className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm" 
          onClick={() => window.history.back()}>
          <FaArrowLeft size={17} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Report a Bug</h1>
      </div>
      <p className="text-base text-left text-gray-600 dark:text-gray-300 mb-8">
        Please provide details about the issue you're experiencing.
      </p>
      <div className="bg-white dark:bg-box p-8 rounded-lg shadow-lg w-full">
        <form onSubmit={handleSubmit} className='mb-5'>

        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Send Message</h2>
          <div className="mb-4">
            <label className={commonLabelStyles} htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              required
              className={`${commonInputStyles} border-gray-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white`}
              placeholder="Enter bug title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className={commonLabelStyles} htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className={`${commonInputStyles} border-zinc-300 dark:border-zinc-600 dark:bg-zinc-700 dark:text-white`}
              placeholder="Describe the bug in detail"
              rows={10}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <button
            type="submit"
            className={`${commonButtonStyles} bg-blue-500 text-white hover:bg-blue-600 flex justify-center items-center`}
            disabled={loading} 
          >
            Submit {loading ? <Spinner w={4} h={4} /> : null}
          </button>
        </form>

        {successMessage && <Message width='w-full' title="" padding="sm:p-5 p-3" titleMarginBottom="" message={successMessage} type="success" />}
        {errorMessage && <Message width='w-full' title="" padding="sm:p-5 p-3" titleMarginBottom="" message={errorMessage} type="error" />}

      </div>
      </div>
    </div>
  );
};

export default BugReport;
