import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_CHANGELOG } from '../mutations/changeLogMutation';
import Spinner from './loading/Spinner';
import Message from './message/Message';

interface Field {
  label: string;
  id: string;
  placeholder: string;
  type?: string;
  rows?: number;
}

const AdminSettings: React.FC = () => {
  const [addChangeLog] = useMutation(ADD_CHANGELOG);
  const [formValues, setFormValues] = useState<{ [key: string]: string | File }>({});
  const [loadingChangelog, setLoadingChangelog] = useState(false);
  const [successMessageChangelog, setSuccessMessageChangelog] = useState<string | null>(null);
  const [errorMessageChangelog, setErrorMessageChangelog] = useState<string | null>(null);

  const changelogFields: Field[] = [
    { label: 'Version', id: 'version', placeholder: 'Enter version number' },
    { label: 'Changes', id: 'changes', placeholder: 'Describe the changes', type: 'textarea', rows: 12 },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.type === 'file') {
      setFormValues({
        ...formValues,
        [e.target.name]: (e.target as HTMLInputElement).files![0],
      });
    } else {
      setFormValues({
        ...formValues,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmitChangelog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoadingChangelog(true);
    setSuccessMessageChangelog(null);
    setErrorMessageChangelog(null);

    const { version, changes } = formValues;

    try {
      await addChangeLog({
        variables: {
          title: version,
          description: changes,
        },
      });
      setFormValues({});
      setSuccessMessageChangelog('Changelog added successfully!');
    } catch (error) {
      console.error('Error adding changelog:', error);
      setErrorMessageChangelog('Failed to add changelog');
    } finally {
      setLoadingChangelog(false);
    }
  };

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className='p-4 sm:p-10'>
      <div className="bg-white dark:bg-box p-5 rounded-lg mb-8">
      <div className="mb-4 flex items-center">
        <button
          type="button"
          className="mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft size={17} />
        </button>
        <h1 className="text-xl font-semibold text-black dark:text-white">Admin Settings</h1>
      </div>
      <p className="text-left text-accent dark:text-gray-300">
        Manage the app's content by adding changelogs.
      </p>
      </div>

      <div className="bg-white dark:bg-box p-8 rounded-lg">
        <h2 className="text-lg font-semibold text-black dark:text-white mb-6">Add a Changelog</h2>
        <form onSubmit={handleSubmitChangelog}>
          {changelogFields.map(({ label, id, placeholder, type = 'text', rows }) => (
            <div key={id} className="mb-4">
              <label className="block text-accent dark:text-gray-300 text-sm mb-2" htmlFor={id}>
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  id={id}
                  required
                  name={id}
                  value={(formValues[id] as string) || ''}
                  onChange={handleChange}
                  className="w-full text-sm p-2 sm:p-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-theme-bgDark dark:text-white"
                  placeholder={placeholder}
                  rows={rows}
                ></textarea>
              ) : (
                <input
                  type={type}
                  id={id}
                  required
                  name={id}
                  value={type === 'file' ? undefined : (formValues[id] as string) || ''}
                  onChange={handleChange}
                  className="w-full text-sm p-2 sm:p-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary dark:bg-theme-bgDark dark:text-white"
                  placeholder={type === 'file' ? undefined : placeholder}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-primary text-sm text-white p-2 sm:p-3 rounded-lg hover:bg-button-hover focus:outline-none focus:ring-2 focus:ring-primary flex justify-center items-center mb-4"
            disabled={loadingChangelog}
          >
            Submit {loadingChangelog && <Spinner w={4} h={4} />}
          </button>

          {successMessageChangelog && (
            <Message
              width="w-full"
              title=""
              padding="sm:p-5 p-3"
              titleMarginBottom=""
              message={successMessageChangelog}
              type="success"
            />
          )}

          {errorMessageChangelog && (
            <Message
              width="w-full"
              title=""
              padding="sm:p-5 p-3"
              titleMarginBottom=""
              message={errorMessageChangelog}
              type="error"
            />
          )}
        </form>
      </div>
      </div>
    </div>
  );
};

export default AdminSettings;
