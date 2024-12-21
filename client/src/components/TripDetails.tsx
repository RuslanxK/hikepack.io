import React, { useState } from 'react';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
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
import Spinner from './loading/Spinner';
import { tripDetailsStepsConfig } from '../guide/stepsConfigs';
import { animated } from '@react-spring/web'; 
import { NameFilterInput, GoalFilterInput, PassedFilterInput, ClearFiltersButton } from './reusables/Filters';
import { useFilterContext } from '../context/FilterContext';
import { FaFilter } from 'react-icons/fa';
import JoyrideWrapper from '../guide/JoyrideWrapper';
import { getSteps } from '../guide/steps';
import AddButton from '../ui/AddButton';
import Grid from '../ui/Grid';
import Container from '../ui/Container';
import { useAnimation } from '../hooks/useAnimation';
import { Bag } from '../types/bag';
import { calculateDaysLeft } from '../utils/dateUtils';

const TripDetails: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const { searchName, searchGoal, searchPassed } = useFilterContext();
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const navigate = useNavigate();

  const buttonClass = 'ml-2 text-white bg-button hover:bg-button-hover hover:text-white rounded p-1.5 dark:hover:bg-button-hover edit-trip-button';

  const { id } = useParams<{ id: string }>();
  const { loading: loadingTrip, error: errorTrip, data: dataTrip } = useQuery(GET_TRIP, { variables: { id } });
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);

  const toggleMobileFilters = () => {
    setIsMobileFiltersOpen((prev) => !prev);
  };

  const trip = dataTrip?.trip;

  const filteredBags = trip?.bags?.filter((bag: any) => {
    const matchesName = bag.name.toLowerCase().includes(searchName.toLowerCase());
    const matchesGoal = searchGoal ? parseFloat(bag.goal || '0') <= parseFloat(searchGoal || '0') : true;
    const matchesPassed = searchPassed === '' ? true : searchPassed === 'true' ? bag.passed === true : bag.passed === false;
    return matchesName && matchesGoal && matchesPassed;
  });


  const bagTransitions = useAnimation({
     items: filteredBags || [],
     keys: (bag: Bag) => bag.id,
   });


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

  const daysLeft = calculateDaysLeft(trip.startDate);

  const handleAddBag = () => {
    setIsModalOpen(true);
  };

  const handleUpdateTrip = () => {
    setIsModalUpdateOpen(true);
  };

  return (
<Container>
<JoyrideWrapper steps={getSteps(tripDetailsStepsConfig)} run={true} />
      <div className='sm:p-5 space-y-6'>
        <div className='flex flex-col lg:flex-row'>
          <div className="w-full flex flex-col">
            <div className='flex flex-row justify-between items-center bg-white dark:bg-box rounded-lg p-5 mb-5'>
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
                <AiFillEdit size={19}  />
              </button>
            </div>

            <div className="bg-white rounded-lg p-5 w-full dark:bg-box mb-5">
              <div className='flex sm:flex-row sm:justify-between sm:items-center flex-col sm:text-left'>
                <div>
                  <h2 className='text-xl font-semibold text-black dark:text-white pb-3'>
                    My Bags
                  </h2>
                  <p className='text-base text-black dark:text-white mb-5'>
                    Organize and manage your bags for trips.
                  </p>
                </div>

                <div className="flex flex-row sm:p-0">
                  <p className="text-sm text-black dark:text-white font-semibold flex items-center dark:border-accent border border-2 border-gray-200 p-3 rounded-lg mr-2.5">
                    <FaMapMarkerAlt className="mr-2 text-primary dark:text-white" size={18} />
                   <span className='mr-1'>Distance:</span>
                   { trip.distance} {userData?.user?.distance}
                  </p>
                  <p className={`text-sm flex items-center font-semibold rounded-lg border-gray-200 border border-2 dark:border-accent p-3 ${daysLeft === 'Traveled' ? 'text-black' : 'text-emerald-500'} dark:text-white`}>
                    <FaClock className="mr-2 text-primary dark:text-white" size={18} />
                    {daysLeft === 'Traveled' ? 'Traveled' : daysLeft}
                  </p>
                </div>
              </div>

              <div className='flex sm:flex-row flex-col justify-between items-start'>
              <p className="text-accent dark:text-white sm:text-left w-full mt-5 sm:mt-0">
                <b className='text-black dark:text-white'>Description:</b> {trip.about}
              </p>
              </div>


          {trip.bags.length > 0 ? (
          <div className="flex flex-col sm:flex-row w-full sm:gap-6 gap-3 sm:items-center mt-5 rounded-lg">
          <div className="flex sm:hidden justify-start w-full mb-4">
         <button
           onClick={toggleMobileFilters}
           className="text-sm flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg">
           <FaFilter />
           {isMobileFiltersOpen ? 'Close Filters' : 'Filters'}
         </button>
         </div>
         <div className={`${isMobileFiltersOpen ? 'flex flex-col gap-2' : 'hidden'} sm:flex sm:flex-row sm:gap-5 items-center border border-2 border-gray-100 w-full rounded-lg pl-5 pr-5 pt-3 sm:pb-2 pb-5 dark:border-zinc-600`}>
         <NameFilterInput />
         <GoalFilterInput />
         <PassedFilterInput />
         <ClearFiltersButton />
         </div>
         </div>
         ) : null}

        {filteredBags.length === 0 && trip.bags.length !== 0 ? (
        <div className="w-full mt-5"> 
        <Message 
        title="Attention Needed" 
        padding="sm:p-5 p-3" 
        width="w-full" 
        titleMarginBottom="mb-2" 
        message="No bags match your search criteria." 
        type="info"/></div>) : null}</div>
        
         <Grid>
            <AddButton onClick={handleAddBag} className="add-bag-button" />
              {bagTransitions((style, bag) => (
               <animated.div style={style}>
                <SingleBag key={bag.id} bagData={bag} />
                </animated.div>
              ))}
            </Grid>
          </div>
        </div>

        <AddBagModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} weightUnit={userData?.user.weightOption}/> 
        <UpdateTripModal isOpen={isModalUpdateOpen} onClose={() => setIsModalUpdateOpen(false)} trip={trip} distanceUnit={userData?.user?.distance}/>
      </div>
    </Container>
  );
}

export default TripDetails;
