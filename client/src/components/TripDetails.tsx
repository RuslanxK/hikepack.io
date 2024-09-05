import React, { useState, useEffect } from 'react';
import { FaPlus, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { GET_TRIP } from '../queries/tripQueries';
import { GET_BAGS } from '../queries/bagQueries';
import { GET_USER } from '../queries/userQueries';
import { useParams, useNavigate } from 'react-router-dom';
import { GetBagsData } from '../types/bag';
import SingleBag from './SingleBag';
import AddBagModal from './popups/AddBagModal';
import { AiFillEdit } from "react-icons/ai";
import { FaArrowLeft } from "react-icons/fa";
import UpdateTripModal from './popups/UpdateTripModal';
import Message from './message/Message';
import dayjs from 'dayjs';
import Spinner from './loading/Spinner';

const TripDetails: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);

  const navigate = useNavigate();

  const buttonClass = 'ml-2 text-white bg-button hover:bg-button-hover hover:text-white focus:ring-4 focus:outline-none focus:ring-orange-300 rounded-full p-1.5 dark:focus:ring-orange-800 dark:hover:bg-button-hover';

  const { id } = useParams<{ id: string }>();
  const { loading: loadingTrip, error: errorTrip, data: dataTrip } = useQuery(GET_TRIP, { variables: { id } });
  const { loading: loadingBags, error: errorBags, data: dataBags } = useQuery<GetBagsData>(GET_BAGS, { variables: { tripId: id }});
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);


  useEffect(() => {
    if (!loadingTrip && !dataTrip?.trip) {
      navigate('/404');
    }
  }, [loadingTrip, dataTrip, navigate]);

  const calculateDaysLeft = (startDate: string) => {
    const today = dayjs().startOf('day');
    const start = dayjs(startDate).startOf('day');
    const diff = start.diff(today, 'day');
    
    if (diff > 0) {
      return diff === 1 ? '1 day left' : `${diff} days left`;
    } else if (diff === 0) {
      return 'Traveled';
    } else {
      return 'Traveled';
    }
  };


  if (loadingTrip || loadingBags || loadingUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (errorUser || errorTrip || errorBags) {
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

  const trip = dataTrip?.trip;
  const daysLeft = calculateDaysLeft(trip.startDate);

  const handleAddBag = () => {
    setIsModalOpen(true);
  };

  const handleUpdateTrip = () => {
    setIsModalUpdateOpen(true);
  };

  return (

    <div className='container mx-auto sm:mt-0 sm:p-0 mt-24 p-2'>
    <div className='p-4 sm:p-10 space-y-6'>
      <div className='flex flex-col lg:flex-row'>
        <div className="w-full flex flex-col space-y-4">
          <div className='flex flex-row justify-between items-center'>
            <div className="flex items-center">
              <button 
                type="button" 
                className="mr-4 text-gray-500 dark:text-gray-100 bg-gray-200 dark:bg-zinc-600 hover:bg-zinc-200 dark:hover:bg-zinc-500 p-2 rounded-full hover:shadow-sm" 
                onClick={() => navigate(-1)}>
                <FaArrowLeft size={17} />
              </button>

              <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
                {trip.name}
              </h1>
            </div>
            
            <button type="button" className={buttonClass} onClick={handleUpdateTrip}>
              <AiFillEdit size={19} />
            </button>
          </div>

          <p className="text-base text-gray-700 dark:text-gray-200 ">
            {trip.about}
          </p>

          <div className="flex items-center space-x-4">
            <p className="text-base font-medium text-gray-700 dark:text-gray-200 flex items-center">
              <FaMapMarkerAlt className="mr-1" />
              {trip.distance} {userData?.user?.distance}
            </p>
            <p className={`text-base font-semibold flex items-center ${daysLeft === 'Traveled' ? 'text-gray-700' : 'text-blue-500'} dark:text-white`}>
              <FaClock className="mr-1" />
              {daysLeft === 'Traveled' ? 'Traveled' : daysLeft}
            </p>
          </div>

          <h2 className='text-xl font-semibold text-gray-900 dark:text-white pt-4'>
            My Bags
          </h2>
          <p className='text-base text-gray-600 dark:text-gray-400 pb-2'>
            Organize and manage your bags for trips.
          </p>

          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5'>
            <li 
              className='flex flex-col items-center justify-center border-2 border-dashed border-gray-500 text-gray-500 dark:text-gray-300 rounded-lg p-4 cursor-pointer dark:hover-border-primary hover:border-primary transition-colors duration-300 ease-in-out' 
              style={{ minHeight: "205px", height: 'calc(100% - 1rem)' }} 
              onClick={handleAddBag}>
              <FaPlus className='text-xl' />
            </li>
            {dataBags?.bags.map((trip) => (
              
              <SingleBag key={trip.id} bagData={trip} />
            ))}

            {dataBags?.bags.length === 0 && (
            <Message title="Attention Needed" padding="sm:p-5 p-3" width="w-80" titleMarginBottom="mb-2" message="click on the plus icon to add a bag." type="info" />
          )}
          </ul>
        </div>
      </div>

      <AddBagModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} weightUnit={userData?.user.weightOption}/> 
      <UpdateTripModal isOpen={isModalUpdateOpen} onClose={() => setIsModalUpdateOpen(false)} trip={trip} distanceUnit={userData?.user?.distance}/>
    </div>
    </div>
  );
}

export default TripDetails;
