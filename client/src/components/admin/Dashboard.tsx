import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { FaArrowLeft, FaUsers, FaUser, FaMap, FaHiking, FaShareAlt} from "react-icons/fa";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type TimeFrame = "daily" | "weekly" | "monthly" | "yearly";

type AnalyticsData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  }[];
};

const analyticsData: Record<TimeFrame, AnalyticsData> = {
  daily: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Daily Users",
        data: [5, 10, 7, 15, 20, 18, 12],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  },
  weekly: {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
    datasets: [
      {
        label: "Weekly Users",
        data: [50, 70, 65, 80],
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
  monthly: {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Monthly Users",
        data: [50, 75, 60, 90, 120, 80],
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
    ],
  },
  yearly: {
    labels: ["2020", "2021", "2022", "2023"],
    datasets: [
      {
        label: "Yearly Users",
        data: [500, 700, 900, 1200],
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  },
};

interface DashboardProps {
  liveUsers: number; 
}

const Dashboard: React.FC<DashboardProps> = ({ liveUsers }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("monthly");
  const navigate = useNavigate();

  const stats = {
    users: 250,
    trips: 150,
    bags: 400,
    communityBags: 120,
  };

  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `User Analytics (${timeFrame.charAt(0).toUpperCase() + timeFrame.slice(1)})`,
      },
    },
  };

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-4">
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
            <h1 className="text-xl font-semibold text-black dark:text-white">Dashboard</h1>
          </div>
          <p className="text-left text-accent dark:text-gray-300">
            Overview of application statistics and user analytics.
          </p>
        </div>

        <div className="bg-indigo-800 dark:bg-box text-white p-6 rounded-lg mb-6 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="p-4 bg-white bg-opacity-20 rounded-full">
      <FaUsers size={30} />
    </div>
    <div className="relative">
    
        <div className="w-2 h-2 absolute bg-green rounded-full animate-ping"></div>
     
      <p className="text-sm font-light mt-3">Live Users</p>
      <h2 className="text-4xl font-bold">{liveUsers}</h2>
      <p className="text-sm font-light opacity-70">currently active</p>
    </div>
  </div>
  <div>
    <span className="text-sm bg-white bg-opacity-20  px-4 py-1 rounded-full dark:bg-opacity-20 dark:text-white">
      Real-time
    </span>
  </div>
</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
  {/* Registered Users */}
  <div className="bg-white dark:bg-box p-6 rounded-lg flex items-center">
    <div className="p-4 bg-primary bg-opacity-20 rounded-full">
      <FaUser size={30} className="text-primary" />
    </div>
    <div className="ml-4">
      <h2 className="text-md text-black dark:text-white mb-2">Registered Users</h2>
      <p className="text-2xl font-bold text-primary">{stats.users}</p>
    </div>
  </div>

  {/* Trips Created */}
  <div className="bg-white dark:bg-box p-6 rounded-lg flex items-center">
    <div className="p-4 bg-button-orange bg-opacity-20 rounded-full">
      <FaMap size={30} className="text-button-orange" />
    </div>
    <div className="ml-4">
      <h2 className="text-md text-black dark:text-white mb-2">Trips Created</h2>
      <p className="text-2xl font-bold text-primary">{stats.trips}</p>
    </div>
  </div>

  {/* Bags Created */}
  <div className="bg-white dark:bg-box p-6 rounded-lg flex items-center">
    <div className="p-4 bg-indigo-500 bg-opacity-20 rounded-full">
      <FaHiking size={30} className="text-indigo-500" />
    </div>
    <div className="ml-4">
      <h2 className="text-md text-black dark:text-white mb-2">Bags Created</h2>
      <p className="text-2xl font-bold text-primary">{stats.bags}</p>
    </div>
  </div>

  {/* Shared Bags */}
  <div className="bg-white dark:bg-box p-6 rounded-lg flex items-center">
    <div className="p-4 bg-yellow-400 bg-opacity-20 rounded-full">
      <FaShareAlt size={30} className="text-yellow-400" />
    </div>
    <div className="ml-4">
      <h2 className="text-md text-black dark:text-white mb-2">Shared Bags</h2>
      <p className="text-2xl font-bold text-primary">{stats.communityBags}</p>
    </div>
  </div>
</div>


        <div className="bg-white dark:bg-box p-8 rounded-lg relative hidden sm:block">

        <div className="absolute top-4 right-4 flex gap-3">
    {(["daily", "weekly", "monthly", "yearly"] as TimeFrame[]).map((time) => (
      <button
        key={time}
        className={`px-4 py-2 text-sm font-semibold rounded shadow ${
          timeFrame === time
            ? "bg-indigo-500 text-white hover:bg-indigo-600"
            : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        }`}
        onClick={() => setTimeFrame(time)}
      >
        {time.charAt(0).toUpperCase() + time.slice(1)}
      </button>
    ))}
  </div>
        
          <Bar data={analyticsData[timeFrame]} options={options} />
      
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
