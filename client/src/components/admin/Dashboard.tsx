import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const stats = {
    users: 250,
    trips: 150,
    bags: 400,
    communityBags: 120,
  };

  const userAnalytics = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June'],
    datasets: [
      {
        label: 'New Users',
        data: [50, 75, 60, 90, 120, 80],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'User Analytics (Monthly)',
      },
    },
  };

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className="p-4 sm:p-10">
        <div className="bg-white dark:bg-box p-5 rounded-lg mb-8">
          <div className="mb-4 flex items-center">
            <button
              type="button"
              className="mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm"
              onClick={() => window.history.back()}
            >
              <FaArrowLeft size={17} />
            </button>
            <h1 className="text-xl font-semibold text-black dark:text-white">Admin Dashboard</h1>
          </div>
          <p className="text-left text-accent dark:text-gray-300">
            Overview of application statistics and user analytics.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white dark:bg-box p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Registered Users</h2>
            <p className="text-2xl font-semibold text-primary">{stats.users}</p>
          </div>
          <div className="bg-white dark:bg-box p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Trips Created</h2>
            <p className="text-2xl font-semibold text-primary">{stats.trips}</p>
          </div>
          <div className="bg-white dark:bg-box p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Bags Created</h2>
            <p className="text-2xl font-semibold text-primary">{stats.bags}</p>
          </div>
          <div className="bg-white dark:bg-box p-6 rounded-lg shadow">
            <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Community Bags</h2>
            <p className="text-2xl font-semibold text-primary">{stats.communityBags}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-box p-8 rounded-lg shadow">
          <Bar data={userAnalytics} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
