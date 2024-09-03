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

  const handleAddTrip = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    refetchLatestBag();
  }, [refetchLatestBag]);



  if (loading  || latestBagLoading || loadingUser) {
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
          padding="p-5" 
          titleMarginBottom="mb-2" 
          message="Something went wrong. Please try again later." 
          type="error" 
        />
      </div>
    );
  }

  return (

    <div className='container mx-auto sm:mt-0 sm:p-0 mt-16 p-2'>
    <div className='p-4 sm:p-10 flex flex-col items-start justify-start space-y-2'>
      <div className='mb-5'>
        <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
          Welcome, {userData?.user?.username}
        </h1>
        <p className='text-base text-gray-700 dark:text-gray-300 mt-1'>
          The journey of a thousand miles begins with a single step.
        </p>

        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mt-4'>
          My last planned trips
        </h2>
        <p className='text-base text-gray-600 dark:text-gray-300 mt-1'>
          Seamless Trip Planning and Bag Organization Made Simple.
        </p>
      </div>


      <div className='w-full flex-grow'>
        <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5'>
          <li
            className='flex flex-col items-center justify-center border-2 border-dashed border-gray-500 text-gray-500 dark:text-gray-300 rounded-lg p-4 cursor-pointer dark:hover-border-primary hover:border-primary transition-colors duration-300 ease-in-out'
            style={{ minHeight: '205px', height: 'calc(100% - 1rem)' }}
            onClick={handleAddTrip}
          >
            <FaPlus className='text-xl' />
          </li>

          {data?.trips.length === 0 ?  <Message title="Attention Needed" padding="p-5" width="w-80" titleMarginBottom="mb-2" message="click on the plus icon to add a trip." type="info" /> : null }

          {data?.trips.map((trip: any) => (
            <SingleTrip key={trip.id} tripData={trip} />
          ))}
        </ul>
        
      </div>

      {latestBagData?.latestBagWithDetails && (
        <div className='text-center justify-center w-full pt-10 pb-5'>
          <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
            My last bag status{' '}
            <Link className="text-button hover:text-button-hover hover:underline" to={`bag/${latestBagData.latestBagWithDetails.id}`}>
              {latestBagData.latestBagWithDetails.name.length > 10
                ? `${latestBagData.latestBagWithDetails.name.substring(0, 10)}...` 
                : latestBagData.latestBagWithDetails.name}
            </Link>
          </h1>
          <p className='text-base text-gray-600 dark:text-gray-400 mt-1'>
            Streamline Your Gear, Simplify Your Adventure.
          </p>
    
          <div className='flex justify-center mt-5'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto'>
        <GridBox title="Total Weight" goal={' / ' + latestBagData.latestBagWithDetails.goal.toString() + ' ' + userData?.user?.weightOption } details={latestBagData.latestBagWithDetails.totalWeight.toFixed(2).toString()} icon={FaWeight} />
        <GridBox title="Total Categories" goal={""} details={latestBagData.latestBagWithDetails.totalCategories.toString()} icon={FaListAlt} />
        <GridBox title="Total Items" goal={""} details={latestBagData.latestBagWithDetails.totalItems.toString()} icon={FaBox} />
  </div>
</div>
        </div>
      )}

      <AddTripModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} distanceUnit={userData?.user?.distance}/>

    </div>
    </div>
  );
};

export default Home;
