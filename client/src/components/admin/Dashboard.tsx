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
import { FaArrowLeft, FaUsers } from "react-icons/fa";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

type Timeframe = "daily" | "weekly" | "monthly" | "yearly";

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

const analyticsData: Record<Timeframe, AnalyticsData> = {
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
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
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
        text: `User Analytics (${timeframe.charAt(0).toUpperCase() + timeframe.slice(1)})`,
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

        <div className="bg-indigo-400 text-white p-6 rounded-lg mb-6 flex items-center justify-between">
  <div className="flex items-center gap-4">
    <div className="p-4 bg-white bg-opacity-20 rounded-full">
      <FaUsers size={30} />
    </div>
    <div className="relative">
    
        <div className="w-2 h-2 absolute  bg-green rounded-full animate-ping"></div>
     
      <p className="text-sm font-light mt-3">Live Users</p>
      <h2 className="text-4xl font-bold">{liveUsers}</h2>
      <p className="text-sm font-light opacity-70">currently active</p>
    </div>
  </div>
  <div>
    <span className="text-sm bg-white text-primary px-4 py-1 rounded-full">
      Real-time
    </span>
  </div>
</div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-600">Registered Users</h2>
            <p className="text-2xl font-semibold text-primary">{stats.users}</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-600">Trips Created</h2>
            <p className="text-2xl font-semibold text-primary">{stats.trips}</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-600">Bags Created</h2>
            <p className="text-2xl font-semibold text-primary">{stats.bags}</p>
          </div>
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-lg font-medium text-gray-600">Community Bags</h2>
            <p className="text-2xl font-semibold text-primary">{stats.communityBags}</p>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          {(["daily", "weekly", "monthly", "yearly"] as Timeframe[]).map((time) => (
            <button
              key={time}
              className={`px-4 py-2 mx-1 text-sm font-medium border rounded ${
                timeframe === time
                  ? "bg-primary text-white"
                  : "bg-white text-gray-800 border-gray-300"
              } hover:bg-primary hover:text-white transition`}
              onClick={() => setTimeframe(time)}
            >
              {time.charAt(0).toUpperCase() + time.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-white p-8 rounded-lg">
          <Bar data={analyticsData[timeframe]} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
