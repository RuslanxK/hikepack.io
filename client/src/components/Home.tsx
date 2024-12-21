import React, { useState, useEffect } from 'react';
import { GetTripData } from '../types/trip';
import { useQuery } from '@apollo/client';
import { GET_TRIPS } from '../queries/tripQueries';
import { GET_LATEST_BAG_WITH_DETAILS } from '../queries/bagQueries';
import SingleTrip from './SingleTrip';
import { FaWeight, FaListAlt, FaBox } from 'react-icons/fa';
import AddTripModal from './popups/AddTripModal';
import GridBox from './home/GridBox';
import { GetLatestBagWithDetailsData } from '../types/bag';
import { Link } from 'react-router-dom';
import Message from './message/Message';
import { GET_USER } from '../queries/userQueries';
import Spinner from './loading/Spinner';
import Cookies from 'js-cookie';
import { getSteps } from '../guide/steps';
import { animated } from '@react-spring/web'; 
import Container from '../ui/Container';
import JoyrideWrapper from '../guide/JoyrideWrapper';
import { homeStepsConfig } from '../guide/stepsConfigs';
import { useAnimation } from '../hooks/useAnimation';
import { NameFilterInput, DistanceFilterInput, YearFilterInput, ClearFiltersButton } from './reusables/Filters';
import { useFilterContext } from '../context/FilterContext';
import Grid from '../ui/Grid';
import AddButton from '../ui/AddButton';
import { FaFilter } from 'react-icons/fa';


const Home: React.FC = () => {
  const { loading, error, data } = useQuery<GetTripData>(GET_TRIPS);
  const { loading: latestBagLoading, error: latestBagError, data: latestBagData, refetch: refetchLatestBag } = useQuery<GetLatestBagWithDetailsData>(GET_LATEST_BAG_WITH_DETAILS);
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);
  const { searchName, searchDistance, searchDate } = useFilterContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [totalWeightFromCookie, setTotalWeightFromCookie] = useState<string | null>(null);
  const [walkthroughActive, setWalkthroughActive] = useState(false);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen((prev) => !prev);
  };

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

  const tripTransitions = useAnimation({
    items: filteredTrips || [],
    keys: (trip) => trip.id,
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
        <Message width="w-fit" title="Attention Needed" padding="sm:p-5 p-3" titleMarginBottom="mb-2" message="Something went wrong. Please try again later." type="error" />
      </div>
    );
  }

  return (
    <Container>
      <JoyrideWrapper steps={getSteps(homeStepsConfig)} run={walkthroughActive} />
      <div className="sm:p-5 flex flex-col items-between justify-start space-y-2">
        <div className="mb-5">
        <div className="flex flex-row items-center">
                <h1 className="text-xl font-semibold text-black dark:text-white">Welcome,</h1>
                <span className="text-xl text-black font-semibold ml-1.5 dark:text-white">
                  {userData?.user?.username}
                </span>
              </div>
              <p className="text-base text-black dark:text-gray-300 mt-1 mb-5">
                The journey of a thousand miles begins with a single step.
              </p>
              <div className="flex flex-col sm:flex-row bg-white dark:bg-box rounded-lg p-5">
              <div className="w-full">
              <h2 className="text-xl font-semibold text-black dark:text-white">
                My last planned trips
              </h2>
              <p className="text-base text-black dark:text-gray-300 mt-1">
                Seamless Trip Planning and Bag Organization Made Simple.
              </p>
    
              {data?.trips.length === 0 ? null : (
              <div className="flex flex-col sm:flex-row w-full sm:gap-6 gap-3 sm:items-center mt-5 rounded-lg">
                <div className="flex sm:hidden justify-start w-full mb-4">
        <button
          onClick={toggleMobileFilters}
          className="text-sm flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg"
        >
          <FaFilter />
          {isMobileFiltersOpen ? 'Close Filters' : 'Filters'}
        </button>
      </div>

     
      {isMobileFiltersOpen && (
        <div className="flex flex-col sm:hidden gap-4 mb-4 dark:bg-box p-4 rounded-lg border border-2 border-gray-100">
          <NameFilterInput />
          <DistanceFilterInput />
          <YearFilterInput />
          <ClearFiltersButton />
        </div>
      )}

      {/* Desktop Filters */}
      <div className="hidden sm:flex flex-row gap-6 items-center border border-2 border-gray-100 w-full rounded-lg pl-5 pr-5 pt-3 pb-2 dark:border-zinc-600">
        <NameFilterInput />
        <DistanceFilterInput />
        <YearFilterInput />
        <ClearFiltersButton />
      </div>
       
       </div> )}

              {filteredTrips?.length === 0 && data?.trips.length !== 0 ? (
                <div className="w-full">
                  <Message title="Attention Needed" padding="sm:p-5 p-3" width="w-full" titleMarginBottom="mb-2" message="No trips match your search criteria." type="info" />
                </div>
              ) : null }
            </div>
          </div>
        </div>

      <Grid>
      <AddButton onClick={handleAddTrip} className="add-trip-button" />
      {tripTransitions((style, trip) => (
        <animated.div style={style} key={trip.id}>
          <SingleTrip tripData={trip} />
        </animated.div>
      ))}
    </Grid>

        {latestBagData?.latestBagWithDetails && (
          <div className="text-center justify-center w-full pt-10 pb-5">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              My last bag status
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
                  icon={FaWeight}/>
                <GridBox
                  title="Total Categories"
                  goal=""
                  details={latestBagData.latestBagWithDetails.totalCategories.toString()}
                  icon={FaListAlt}/>
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
    </Container>
  );
};

export default Home;
