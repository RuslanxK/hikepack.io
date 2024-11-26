import React, { useState, useEffect } from 'react';
import { FaPlus, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { useQuery } from '@apollo/client';
import { GET_TRIP } from '../queries/tripQueries';
import { GET_USER } from '../queries/userQueries';
import { useParams, useNavigate } from 'react-router-dom';
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
  const [searchName, setSearchName] = useState('');
  const [searchGoal, setSearchGoal] = useState('');

  const navigate = useNavigate();

  const buttonClass = 'ml-2 text-white bg-button hover:bg-button-hover hover:text-white rounded p-1.5  dark:hover:bg-button-hover';

  const { id } = useParams<{ id: string }>();
  const { loading: loadingTrip, error: errorTrip, data: dataTrip } = useQuery(GET_TRIP, { variables: { id } });
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

  if (loadingTrip || loadingUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (errorUser || errorTrip) {
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

  const filteredBags = trip.bags.filter((bag: any) => {
    const matchesName = bag.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesGoal = searchGoal
      ? parseFloat(bag.goal || "0") <= parseFloat(searchGoal || "0")
      : true;
    return matchesName && matchesGoal;
  });

  return (
    <div className='container mx-auto sm:mt-0 sm:p-0 mt-24 p-2'>
      <div className='p-4 sm:p-10 space-y-6'>
        <div className='flex flex-col lg:flex-row'>
          <div className="w-full flex flex-col">
            <div className='flex flex-row justify-between items-center bg-white dark:bg-box rounded-lg p-5 mb-8'>
              <div className="flex items-center">
                <button 
                  type="button" 
                  className="mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm" 
                  onClick={() => navigate(-1)}>
                  <FaArrowLeft size={17} />
                </button>

                <h1 className='text-xl font-semibold text-black dark:text-white'>
                  {trip.name}
                </h1>
              </div>
              <button type="button" className={buttonClass} onClick={handleUpdateTrip}>
                <AiFillEdit size={19} />
              </button>
            </div>

            <div className="bg-white rounded-lg p-5 w-full dark:bg-box">
              <div className='flex items-center justify-between sm:flex-row flex-col text-center sm:text-left'>
                <div>
                  <h2 className='text-xl font-semibold text-black dark:text-white pb-3'>
                    My Bags
                  </h2>
                  <p className='text-base text-black dark:text-white mb-5'>
                    Organize and manage your bags for trips.
                  </p>
                </div>

                <div className="flex flex-row sm:p-0">
                  <p className="text-sm text-accent dark:text-white flex items-center dark:border-accent border border-2 p-3 rounded-lg mr-2.5">
                    <FaMapMarkerAlt className="mr-1 text-accent dark:text-white" />
                    <b>{trip.distance} {userData?.user?.distance}</b>
                  </p>
                  <p className={`text-sm flex items-center rounded-lg border border-2 dark:border-accent p-3 ${daysLeft === 'Traveled' ? 'text-accent' : 'text-primary'} dark:text-white`}>
                    <FaClock className="mr-1 text-accent dark:text-white" />
                    <b>{daysLeft === 'Traveled' ? 'Traveled' : daysLeft}</b>
                  </p>
                </div>
              </div>

              <hr className="border-t-1 border dark:border-zinc-600 my-4" />

              <div className='flex sm:flex-row flex-col justify-between items-start'>

              <p className="text-accent dark:text-white text-center sm:text-left w-full">
                {trip.about}
              </p>
              

  </div>

  <hr className="border-t-1 border dark:border-zinc-600 my-4" />


  {trip.bags.length > 0 ? <div className='sm:w-full flex sm:flex-row flex-col items-start bg-white dark:bg-box dark:box rounded-b-lg'>

<div className="flex flex-col mb-4 sm:w-64 w-full sm:mr-5 mr-0">
<label htmlFor="search-name" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 w-full">
  Search by Name
</label>
<input
  id="search-name"
  type="text"
  placeholder="Enter bag name"
  value={searchName}
  onChange={(e) => setSearchName(e.target.value)}
  className="p-2 border rounded-lg focus:outline-none text-sm w-full  dark:bg-black dark:border-accent dark:text-white"
/>
</div>

<div className="flex flex-col sm:w-64 w-full sm:mr-5 mr-0">
<label htmlFor="search-goal" className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
  Search by Goal
</label>
<input
  id="search-goal"
  type="range"
  min="0"
  max="100"
  step="1"
  value={searchGoal}
  onChange={(e) => setSearchGoal(e.target.value)}
  className="w-full"
/>
<span className="text-sm text-gray-600 dark:text-gray-400 mt-1">
  Goal until: {searchGoal || 0} {userData.user.weightOption}
</span>
</div>

<button
onClick={() => {
  setSearchName('');
  setSearchGoal('');
}}
className="py-2 px-4 bg-accent hover:bg-gray-500 text-white rounded-lg text-sm focus:outline-none mt-2"
>
Clear Filters
</button>

</div> : null }

</div>



            <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5 mt-8 '>
              <li 
                className='bg-white dark:bg-box flex flex-col items-center justify-center border-2 border-dashed border-accent text-accent rounded-lg p-4 cursor-pointer hover:border-primary dark:hover:border-white' 
                style={{ minHeight: "205px", height: 'calc(100% - 1rem)' }} 
                onClick={handleAddBag}>
                <FaPlus className='text-xl text-accent dark:text-white' />
              </li>
              {filteredBags.map((bag: any) => (
                <SingleBag key={bag.id} bagData={bag} />
              ))}

              {filteredBags.length === 0 && (
                <Message 
                  title="Attention Needed" 
                  padding="sm:p-5 p-3" 
                  width="w-80" 
                  titleMarginBottom="mb-2" 
                  message="No bags match your search criteria." 
                  type="info" 
                />
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
