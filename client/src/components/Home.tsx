import React, { useState, useEffect } from 'react';
import { GetTripData } from '../types/trip';
import { useQuery } from '@apollo/client';
import { GET_TRIPS } from '../queries/tripQueries';
import { GET_LATEST_BAG_WITH_DETAILS } from '../queries/bagQueries';
import SingleTrip from './SingleTrip';
import { FaPlus, FaWeight, FaListAlt, FaBox } from 'react-icons/fa';
import AddTripModal from './popups/AddTripModal';
import GridBox from './home/GridBox';
import { GetLatestBagWithDetailsData } from '../types/bag';
import { Link } from 'react-router-dom';
import Message from './message/Message';
import { GET_USER } from '../queries/userQueries';
import Spinner from './loading/Spinner';

const Home: React.FC = () => {
  const { loading, error, data } = useQuery<GetTripData>(GET_TRIPS);
  const { loading: latestBagLoading, error: latestBagError, data: latestBagData, refetch: refetchLatestBag } = useQuery<GetLatestBagWithDetailsData>(GET_LATEST_BAG_WITH_DETAILS);
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [searchDistance, setSearchDistance] = useState('');
  const [searchDate, setSearchDate] = useState('');


  const handleAddTrip = () => {
    setIsModalOpen(true);
  };

  
  useEffect(() => {
    refetchLatestBag();
  }, [refetchLatestBag]);

  if (loading || latestBagLoading || loadingUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (errorUser || error || latestBagError) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Message 
          width="w-fit" 
          title="Attention Needed" 
          padding="sm:p-5 p-3" 
          titleMarginBottom="mb-2" 
          message="Something went wrong. Please try again later." 
          type="error" 
        />
      </div>
    );
  }

  const filteredTrips = data?.trips.filter((trip) => {
    const matchesName = trip.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesDistance = searchDistance
      ? parseFloat(trip.distance || "0") <= parseFloat(searchDistance || "0")
      : true;
    const matchesDate = searchDate ? trip.startDate.startsWith(searchDate) : true;
    return matchesName && matchesDistance && matchesDate;
  });



  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-24 p-2">
      <div className="p-4 sm:p-10 flex flex-col items-between justify-start space-y-2">
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row bg-white dark:bg-box rounded-lg p-5">
            <div className='w-full'>
              <div className="flex flex-row items-center">
                <h1 className="text-xl font-semibold text-black dark:text-white">Welcome,</h1>
                <span className="text-lg text-black font-semibold ml-1.5 dark:text-white">{userData?.user?.username}</span>
              </div>
              <p className="text-base text-black dark:text-gray-300 mt-1">
                The journey of a thousand miles begins with a single step.
              </p>

              <h2 className="text-xl font-semibold text-black dark:text-white mt-4">
                My last planned trips
              </h2>
              <p className="text-base text-black dark:text-gray-300 mt-1">
                Seamless Trip Planning and Bag Organization Made Simple.
              </p>

              {data?.trips.length === 0 ? null : (
  <div className="w-full flex flex-col md:flex-row items-start bg-secondary dark:bg-box mt-5 bg-secondary p-4 rounded-lg">
    {/* Group 1: Search by Name */}
    <div className="flex flex-col w-full md:w-1/4 md:mr-10 mb-4 md:mb-0">
      <label
        htmlFor="search-name"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Search by Name
      </label>
      <input
        id="search-name"
        type="text"
        value={searchName}
        onChange={(e) => setSearchName(e.target.value)}
        placeholder="Enter trip name"
        className="p-2 border rounded-lg w-full text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-primary dark:bg-black dark:border-accent"
      />
    </div>

    {/* Group 2: Search by Distance */}
    <div className="flex flex-col w-full md:w-1/4 md:mr-10 mb-4 md:mb-0">
      <label
        htmlFor="search-distance"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Search by Distance
      </label>
      <input
        id="search-distance"
        type="range"
        min="0"
        max="10000"
        value={searchDistance}
        onChange={(e) => setSearchDistance(e.target.value)}
        className="w-full"
      />
      <span className="text-xs text-gray-500 dark:text-gray-400">
        {searchDistance} {userData?.user?.distance}
      </span>
    </div>

    {/* Group 3: Search by Date */}
    <div className="flex flex-col w-full md:w-1/4 md:mr-5 mb-4 md:mb-0">
      <label
        htmlFor="search-date"
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        Search by Date
      </label>
      <input
        id="search-date"
        type="date"
        value={searchDate}
        onChange={(e) => setSearchDate(e.target.value)}
        className="p-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-black dark:border-accent dark:text-white"
      />
    </div>

    {/* Clear Filters Button */}
    <div className="w-full md:w-1/4 flex justify-start md:self-end">
      <input
        type="button"
        value="Clear Filters"
        onClick={() => {
          setSearchName('');
          setSearchDistance('');
          setSearchDate('');
        }}
        className="p-2 border border-2 border-accent bg-accent text-white rounded-lg text-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full md:w-auto cursor-pointer"
      />
    </div>
  </div>
)}

   
            </div>
  
          </div>
        </div>

        <div className="w-full flex-grow">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5">
            <li
              className="bg-white dark:bg-box flex flex-col items-center justify-center border-2 border-dashed border-gray-500 text-gray-500 rounded-lg p-4 cursor-pointer hover:border-primary dark:hover:border-white"
              style={{ minHeight: "205px", height: "calc(100% - 1rem)" }}
              onClick={handleAddTrip}
            >
              <FaPlus className="text-xl text-accent dark:text-white" />
            </li>

            {filteredTrips?.length === 0 ? (
              <Message
                title="Attention Needed"
                padding="sm:p-5 p-3"
                width="sm:w-80"
                titleMarginBottom="mb-2"
                message="No trips match your search criteria."
                type="info"
              />
            ) : (
              filteredTrips?.map((trip: any) => (
                <SingleTrip key={trip.id} tripData={trip} />
              ))
            )}
          </ul>
        </div>

        {latestBagData?.latestBagWithDetails && (
          <div className="text-center justify-center w-full pt-10 pb-5">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My last bag status{" "}
              <Link
                className="text-button dark:text-button-lightGreen hover:text-button-hover hover:underline"
                to={`bag/${latestBagData.latestBagWithDetails.id}`}
              >
                {latestBagData.latestBagWithDetails.name.length > 10
                  ? `${latestBagData.latestBagWithDetails.name.substring(0, 10)}...`
                  : latestBagData.latestBagWithDetails.name}
              </Link>
            </h1>
            <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
              Streamline Your Gear, Simplify Your Adventure.
            </p>

            <div className="flex justify-center mt-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto">
                <GridBox
                  title="Total Weight"
                  goal={` / ${latestBagData.latestBagWithDetails.goal} ${userData?.user?.weightOption}`}
                  details={latestBagData.latestBagWithDetails.totalWeight.toFixed(2)}
                  icon={FaWeight}
                />
                <GridBox
                  title="Total Categories"
                  goal=""
                  details={latestBagData.latestBagWithDetails.totalCategories.toString()}
                  icon={FaListAlt}
                />
                <GridBox
                  title="Total Items"
                  goal=""
                  details={latestBagData.latestBagWithDetails.totalItems.toString()}
                  icon={FaBox}
                />
              </div>
            </div>
          </div>
        )}

        <AddTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} distanceUnit={userData?.user?.distance} />
      </div>
    </div>
  );
};

export default Home;
