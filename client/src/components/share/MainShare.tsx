import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa';
import { UPDATE_LIKES_BAG } from '../../mutations/bagMutations';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import { Category } from '../../types/category';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import CategoryChart from '../chart/CategoryChart';
import CategoryTable from '../chart/CategoryTable';
import CategoryShare from './CategoryShare';
import Message from '../message/Message';
import { GET_USER_SHARED } from '../../queries/userQueries';
import Spinner from '../loading/Spinner';
import { GET_SHARED_BAG, GET_ALL_USER_BAGS } from '../../queries/bagQueries';
import { GET_TRIP } from '../../queries/tripQueries';
import { FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import { Bag } from '../../types/bag';
import { IoArrowForwardCircle } from "react-icons/io5";


ChartJS.register(ArcElement, Tooltip, Legend);

const MainShare: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER_SHARED, { variables: { bagId: id }});
  const { data: dataBag, loading: loadingBag, error: errorBag, refetch } = useQuery(GET_SHARED_BAG, { variables: { id } });
  const { data: allBags, loading: loadingAllBags, error: errorAllBags } = useQuery(GET_ALL_USER_BAGS);

  const { data: dataTrip, loading: loadingTrip, error: errorTrip } = useQuery(GET_TRIP, {
    variables: { id: dataBag?.sharedBag?.tripId }, 
    skip: !dataBag || !dataBag.sharedBag?.tripId,  
  });


 
  const [updateLikes] = useMutation(UPDATE_LIKES_BAG);
  const [categoriesData, setCategoriesData] = useState<Category[]>([]);
  const [hasLiked, setHasLiked] = useState(false);


  useEffect(() => {
    if (dataBag?.sharedBag?.categories) {
      setCategoriesData(dataBag?.sharedBag?.categories.slice().sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [dataBag?.sharedBag?.categories]);

  useEffect(() => {
    const likedBags = JSON.parse(localStorage.getItem('likedBags') || '[]');
    if (likedBags.includes(id)) {
      setHasLiked(true);
    }
  }, [id]);

  const handleLikeToggle = async () => {
    const likedBags = JSON.parse(localStorage.getItem('likedBags') || '[]');
    const isLiked = likedBags.includes(id);

    if (!isLiked) {
      await updateLikes({ variables: { bagId: id, increment: 1 } });
      likedBags.push(id);
      localStorage.setItem('likedBags', JSON.stringify(likedBags));
      setHasLiked(true);
      refetch()
     
    
    } else {
      await updateLikes({ variables: { bagId: id, increment: -1 } });
      const updatedLikes = likedBags.filter((bagId: string) => bagId !== id);
      localStorage.setItem('likedBags', JSON.stringify(updatedLikes));
      setHasLiked(false);
      refetch()
     
    
    }
  };

  const bag = dataBag?.sharedBag;
  const trip = dataTrip?.trip;
  const userBags = allBags?.allUserBags?.filter((bag: Bag) => bag.id !== id && bag.exploreBags === true);


  if (loadingBag || loadingUser || loadingTrip || loadingAllBags) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (errorUser || errorBag || errorTrip || errorAllBags) {
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

  const hasCategoriesWithWeight = categoriesData.some(category => category.totalWeight > 0);

  return (
    <div className="container mx-auto p-4 w-full sm:w-10/12">
      <div className="flex flex-row items-center justify-between space-y-2 w-full bg-white dark:bg-box p-5 rounded-lg">
              <img src={'/images/logo-black.png'} width={90} className="sm:p-0 p-2" alt="logo" onClick={() => navigate('/')} />
              <button 
                onClick={handleLikeToggle} 
                className={`flex items-center space-x-1 pt-1.5 pb-1.5 pl-2 pr-2 rounded-lg ${hasLiked ? 'bg-primary text-white' : 'bg-zinc-400 text-zinc-100'} dark:${hasLiked ? 'bg-primary text-white' : 'bg-zinc-600 text-gray-400'}`}
              >
                <span className="text-sm w-10">{hasLiked ? 'Unlike' : 'Like'}</span>
              </button>
      </div>


          <div className='p-5 bg-white dark:bg-box rounded-lg my-5'>

       <div className="text-center text-accent dark:text-gray-200 flex items-center justify-start w-full">
        <img src={userData.userShared.imageUrl || '/images/default.jpg'} alt='user' className='w-6 h-6 object-cover rounded-full mr-2 ml-2' /> 
        <p className="text-sm mr-1">Shared by:</p>
        <span className="font-semibold text-primary text-sm">{userData?.userShared?.username}</span>
        </div>

            <div className='flex items-center my-4'>
            <span className='text-sm text-accent mr-2 font-semibold'>TRIP:</span>
            <h1 className="text-xl font-semibold text-black dark:text-white">
             {trip.name}
            </h1>
            </div>

            <p className="text-base text-accent dark:text-gray-200">
              {trip.about}
            </p>

            <div className="flex-row mt-5">
            <p className="text-sm text-accent dark:text-white flex items-center dark:border-accent border border-2 p-3 rounded-lg mb-5">
              <FaMapMarkerAlt className="mr-1 text-accent dark:text-white" />
              Distance {trip.distance} {userData?.userShared?.distance}
            </p>
            <p className={` text-sm flex items-center rounded-lg border border-2 dark:border-accent p-3 text-accent dark:text-white`}>
              <FaClock className="mr-1 text-accent dark:text-white" />
              {trip.startDate}
            </p>
            </div>
       </div>
     

      
      <div className='p-5 bg-white dark:bg-box rounded-lg'>
      <div className='flex items-center mb-5'>
      <span className='text-sm text-accent mr-2 font-semibold'>BAG:</span>
            <h1 className="text-xl font-semibold text-black dark:text-white">
              {bag.name}
            </h1>
            </div>
            
            <p className="text-base text-accent dark:text-gray-200">
              {bag.description}
            </p>
       </div>
     

      {categoriesData.length > 0 && hasCategoriesWithWeight && (
        <div className="w-full flex flex-col sm:flex-row items-center py-10 justify-center sm:space-x-12 space-y-8 sm:space-y-0 bg-white dark:bg-box rounded-lg my-5">
           {bag?.likes > 0 && (
      <div className="flex justify-center items-center">
        <div className="flex items-center space-x-2 p-3 rounded-full">
          <FaHeart size={20} className="text-red-500 animate-pulse" />
          <div className="flex flex-col items-center">
            <span className="font-semibold text-gray-900 dark:text-white">
              {bag?.likes}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {bag?.likes === 1 ? 'Like' : 'Likes'}
            </span>
          </div>
        </div>
      </div>
    )}

          <div className="sm:w-64 h-64">
            <CategoryChart categories={dataBag.sharedBag.categories} weightUnit={userData?.userShared?.weightOption} />
          </div>
          <div className="w-full sm:w-fit">
            <CategoryTable categories={dataBag.sharedBag.categories} weightUnit={userData?.userShared?.weightOption} />
          </div>
        </div>
      )}

      <div className="overflow-hidden">
        <div className="w-full mt-5">
          {categoriesData.map((category) => (
            <CategoryShare key={category.id} categoryData={category} weightUnit={userData?.userShared?.weightOption} />
          ))}
        </div>
      </div>



      {userBags.length > 0 && (
      <div className="my-10">
        <h2 className="text-center text-xl font-normal text-black">
          Discover More Hiking Bags of  <span className="font-semibold text-primary">{userData?.userShared?.username}</span>
        </h2>
      </div>
    )}

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-5 my-5'>
      {userBags.map((bag: Bag) => {
  return (
    <div
      key={bag.id} className="bg-white dark:bg-box rounded-lg p-5 relative shadow-airbnb transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer group hover:opacity-80"
      onClick={() => window.open(`/share/${bag.id}`, '_blank')}
    >
      <img
        src="/images/backpack.png"
        alt={bag.name}
        className="w-14 h-14 object-contain cursor-pointer text-center mb-5"
      />
      <h3 className="font-semibold mb-2">
        {bag.name && bag.name.length > 28
          ? `${bag.name.substring(0, 28)}...`
          : bag.name}
      </h3>
      <p className="text-accent text-sm">
        {bag.description && bag.description.length > 50
          ? `${bag.description.substring(0, 50)}...`
          : bag.description}
      </p>
      <IoArrowForwardCircle
        className="absolute text-primary dark:text-white cursor-pointer transform transition-transform duration-200 hover:scale-125 opacity-0 group-hover:opacity-100"
        title="View Details"
        size={30}
        style={{
          bottom: '10',
          right: '10',
         
          fontSize: '3rem',
        }}
      />
    </div>
  );
})}

      </div>
    </div>
  );
};

export default MainShare;
