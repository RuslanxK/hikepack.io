import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useMutation } from '@apollo/client';
import { ADD_CHANGELOG } from '../queries/changeLogQueries';
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
    <div className="container mx-auto p-4 sm:p-10">
      <div className="mb-4 flex items-center">
        <button
          type="button"
          className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm"
          onClick={() => window.history.back()}
        >
          <FaArrowLeft size={17} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Admin Settings</h1>
      </div>
      <p className="text-left text-gray-600 dark:text-gray-300 mb-8">
        Manage the app's content by adding changelogs.
      </p>

      <div className="bg-white dark:bg-box p-8 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-6">Add a Changelog</h2>
        <form onSubmit={handleSubmitChangelog}>
          {changelogFields.map(({ label, id, placeholder, type = 'text', rows }) => (
            <div key={id} className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor={id}>
                {label}
              </label>
              {type === 'textarea' ? (
                <textarea
                  id={id}
                  required
                  name={id}
                  value={(formValues[id] as string) || ''}
                  onChange={handleChange}
                  className="w-full text-sm px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
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
                  className="w-full text-sm px-4 py-3 border border-gray-300 dark:border-zinc-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-zinc-700 dark:text-white"
                  placeholder={type === 'file' ? undefined : placeholder}
                />
              )}
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-sm text-white py-3 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex justify-center items-center mb-4"
            disabled={loadingChangelog}
          >
            Submit {loadingChangelog && <Spinner w={4} h={4} />}
          </button>

          {successMessageChangelog && (
            <Message
              width="w-full"
              title=""
              padding="p-5"
              titleMarginBottom=""
              message={successMessageChangelog}
              type="success"
            />
          )}

          {errorMessageChangelog && (
            <Message
              width="w-full"
              title=""
              padding="p-5"
              titleMarginBottom=""
              message={errorMessageChangelog}
              type="error"
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default AdminSettings;
