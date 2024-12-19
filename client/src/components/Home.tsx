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
import Cookies from 'js-cookie';
import Joyride, { Step } from 'react-joyride';
import { useTransition, animated } from '@react-spring/web'; 


const Home: React.FC = () => {
  const { loading, error, data } = useQuery<GetTripData>(GET_TRIPS);
  const { loading: latestBagLoading, error: latestBagError, data: latestBagData, refetch: refetchLatestBag } = useQuery<GetLatestBagWithDetailsData>(GET_LATEST_BAG_WITH_DETAILS);
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchName, setSearchName] = useState('');
  const [searchDistance, setSearchDistance] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [totalWeightFromCookie, setTotalWeightFromCookie] = useState<string | null>(null);

  const [walkthroughActive, setWalkthroughActive] = useState(false);


  const filteredTrips = data?.trips.filter((trip) => {
    const matchesName = trip.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesDistance = searchDistance
      ? parseFloat(trip.distance || '0') <= parseFloat(searchDistance || '0')
      : true;
  
    const matchesDate = searchDate
      ? new Date(trip.startDate).getFullYear() === parseInt(searchDate, 10)
      : true;
  
    return matchesName && matchesDistance && matchesDate;
  });

  const tripTransitions = useTransition(filteredTrips || [], {
    keys: (trip) => trip.id,
    from: { opacity: 0, transform: 'translateY(20px)' },
    enter: { opacity: 1, transform: 'translateY(0)' },
    leave: { opacity: 0, transform: 'translateY(-20px)' },
  });


  useEffect(() => {
    const weight = Cookies.get('totalWeight');
    setTotalWeightFromCookie(weight || '0');
  }, []);

  const handleAddTrip = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    refetchLatestBag();
  }, [refetchLatestBag]);


  
  useEffect(() => {
    if (!loading && !loadingUser && !latestBagLoading) {
      setWalkthroughActive(true);
    }
  }, [loading, loadingUser, latestBagLoading]);

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


  
  
  const steps: Step[] = [
    {
      target: '.add-trip-button',
      content: 'Start planning your next adventure by adding a new trip here!',
      placement: 'bottom',
      disableBeacon: true
      
    },
   
  ];

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-20 p-3">
      <Joyride
        steps={steps}
        run={walkthroughActive}
        continuous={true}
        showSkipButton
        styles={{
          options: {
            arrowColor: '#f0f0f0',
            backgroundColor: '#ffffff',
            overlayColor: 'rgba(0, 0, 0, 0.4)',
            primaryColor: '#1d4ed8',
            textColor: '#000',
            zIndex: 1000,
          },
          buttonNext: {
            display: 'none',
          }
        }}
        callback={(data) => {
          if (data.status === 'finished' || data.status === 'skipped') {
            setWalkthroughActive(false);
          }
        }}
      />

      <div className="sm:p-5 flex flex-col items-between justify-start space-y-2">
        <div className="mb-5">
          <div className="flex flex-col sm:flex-row bg-white dark:bg-box rounded-lg p-5">
            <div className="w-full">
              <div className="flex flex-row items-center">
                <h1 className="text-xl font-semibold text-black dark:text-white">Welcome,</h1>
                <span className="text-xl text-black font-semibold ml-1.5 dark:text-white">
                  {userData?.user?.username}
                </span>
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
                <div className="w-full flex flex-col md:flex-row items-start bg-gray-100 border dark:border-black dark:bg-black mt-5 p-4 rounded-lg">
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

                  <div className="flex flex-col w-full md:w-1/4 md:mr-5 mb-4 md:mb-0">
  <label
    htmlFor="search-date"
    className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
  >
    Search by Year
  </label>
  <input
    id="search-date"
    type="number"
    value={searchDate}
    onChange={(e) => setSearchDate(e.target.value)}
    placeholder="Enter year (e.g., 2025)"
    className="p-2 border rounded-lg w-full text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:bg-black dark:border-accent dark:text-white"
  />
</div>

                  <div className="w-full md:w-1/4 flex justify-start md:self-end">
                    <input
                      type="button"
                      value="Clear Filters"
                      onClick={() => {
                        setSearchName('');
                        setSearchDistance('');
                        setSearchDate('');
                      }}
                      className="p-2 border border-2 dark:border-accent bg-accent text-white rounded-lg text-sm hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 w-full md:w-auto cursor-pointer"
                    />
                  </div>
                </div>
              )}
              {filteredTrips?.length === 0 && data?.trips.length !== 0 ? (
                <div className="w-full mt-5">
                  <Message
                    title="Attention Needed"
                    padding="sm:p-5 p-3"
                    width="w-full"
                    titleMarginBottom="mb-2"
                    message="No trips match your search criteria."
                    type="info"
                  />
                </div>
              ) : null }
            </div>
          </div>
        </div>

        <div className="w-full flex-grow">
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5">
            <li
              className="bg-white dark:bg-box flex flex-col items-center justify-center border-2 border-dashed border-gray-500 text-gray-500 rounded-lg p-4 cursor-pointer hover:border-primary dark:hover:border-white add-trip-button"
              style={{ minHeight: '205px', height: 'calc(100% - 1rem)' }}
              onClick={handleAddTrip}
            >
              <FaPlus className="text-xl text-accent dark:text-white" />
            </li>

            {tripTransitions((style, trip) => (
              <animated.div style={style}>
                <SingleTrip key={trip.id} tripData={trip} />
              </animated.div>
            ))}
          </ul>
        </div>

        {latestBagData?.latestBagWithDetails && (
          <div className="text-center justify-center w-full pt-10 pb-5">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My last bag status{' '}
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
                  details={totalWeightFromCookie || '0'}
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
