import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_CHANGELOGS } from '../queries/changeLogQueries';
import Spinner from './loading/Spinner';
import Message from './message/Message';

interface ChangeLog {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
}

interface FormattedChangeLog {
  version: string;
  date: string;
  changes: string[];
}

const Changelog: React.FC = () => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery<{ changeLogs: ChangeLog[] }>(GET_CHANGELOGS);

  if (loading) {
    if (error) {
      console.error('Error fetching changelogs:', error);
    }

    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10}/>
        {error && (
           <Message width='w-fit' title="Attention Needed" padding="p-5" titleMarginBottom="mb-2" message="Something went wrong. Please try again later." type="error" />
        )}
      </div>
    );
  }

  const changelogData: FormattedChangeLog[] = data?.changeLogs?.map((log: ChangeLog): FormattedChangeLog => {
    const date = new Date(log.createdAt);
    return {
      version: log.title,
      date: date.toDateString(),
      changes: log.description.split('\n'),
    };
  }) || [];

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className='p-4 sm:p-10'>
      <div className="min-h-screen">
        <div className="flex items-center mb-4">
          <button
            type="button"
            className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm"
            onClick={() => navigate(-1)}>
            <FaArrowLeft size={17} />
          </button>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-white">Changelog</h1>
        </div>
        <p className="text-base text-left text-gray-600 dark:text-gray-300 mb-8">
          Latest updates and improvements to the app.
        </p>

        {changelogData.length === 0 ? (
          <Message width='w-full' title="No Changelogs Available" padding="p-5" titleMarginBottom="mb-2" message="There are no changelogs available at the moment." type="info" />
        ) : (
          <ul className="space-y-6">
            {changelogData.map((log, index) => (
              <li key={index} className="p-6 bg-white dark:bg-box rounded-lg shadow">
                <div className="flex justify-between items-center">
                  <h2 className="text-md font-semibold text-gray-800 dark:text-white">Version {log.version}</h2>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{log.date}</span>
                </div>
                <ul className="mt-3 space-y-2 text-gray-700 dark:text-gray-300">
                  {log.changes.map((change, idx) => (
                    <li key={idx} className="flex items-start text-sm mt-5">
                      <span className="mr-2 text-green-500">•</span>
                      <p>{change}</p>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
    </div>
  );
};

export default Changelog;
