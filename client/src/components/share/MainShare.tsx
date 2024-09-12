import React, { useEffect, useState } from 'react';
import { FaHeart, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
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
import { GET_SHARED_BAG } from '../../queries/bagQueries';

ChartJS.register(ArcElement, Tooltip, Legend);

const MainShare: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER_SHARED, { variables: { bagId: id }});
  const { data: dataBag, loading: loadingBag, error: errorBag, refetch } = useQuery(GET_SHARED_BAG, { variables: { id } });



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

  if (loadingBag || loadingUser) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (errorUser || errorBag) {
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
      <div className="flex flex-row items-center justify-between space-y-2 w-full">
        <div className="w-full">
          <div className="dark:bg-zinc-800 flex flex-row items-start">
            <div className="w-full flex flex-row items-center justify-between mb-14">
              <img src={'/images/logo-black.png'} width="90px" className="sm:p-0 p-2" alt="logo" onClick={() => navigate('/')} />
              <button 
                onClick={handleLikeToggle} 
                className={`flex items-center space-x-1 p-1.5 rounded-full ${hasLiked ? 'bg-blue-500 text-white' : 'bg-zinc-400 text-zinc-100'} dark:${hasLiked ? 'bg-blue-600 text-white' : 'bg-zinc-600 text-gray-400'}`}
              >
                {hasLiked ? <FaThumbsDown size={15} /> : <FaThumbsUp size={15} />}
                <span className="text-sm w-10">{hasLiked ? 'Unlike' : 'Like'}</span>
              </button>
            </div>
          </div>

          
          <div className='pl-5 pr-5 pb-5'>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white mb-5">
              {bag?.name}
            </h1>
            <p className="text-base text-gray-700 dark:text-gray-200">
              {bag?.description}
            </p>
            </div>
          </div>
      </div>

      {categoriesData.length > 0 && hasCategoriesWithWeight && (
        <div className="w-full flex flex-col sm:flex-row items-center py-10 justify-center sm:space-x-12 space-y-8 sm:space-y-0">
          <div className="flex justify-center items-center">
            <div className="flex items-center space-x-2 p-3 rounded-full">
              <FaHeart size={20} className="text-red-500 animate-pulse" />
              <div className="flex flex-col items-center">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {bag?.likes || 0}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {bag?.likes === 1 ? 'Like' : 'Likes'}
                </span>
              </div>
            </div>
          </div>

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

    
      <footer className="mt-10 p-4 text-center text-gray-700 dark:text-gray-200 flex items-center w-full justify-center">
        <p className="text-sm">Shared by</p>
        <img src={userData.userShared.imageUrl || '/images/default.jpg'} alt='user' className='w-6 h-6 object-cover rounded-full mr-2 ml-2' /> 
        <span className="font-semibold text-blue-600 text-sm">{userData?.userShared?.username}</span>
      </footer>
    </div>
  );
};

export default MainShare;
