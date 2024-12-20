import React, { useState, ChangeEvent, useEffect } from 'react';
import { GET_EXPLORE_BAGS } from '../queries/bagQueries';
import { GET_USER, GET_USERS } from '../queries/userQueries';
import { useQuery } from '@apollo/client';
import { FaArrowLeft } from "react-icons/fa"; 
import { useNavigate } from 'react-router-dom';
import Message from './message/Message';
import Spinner from './loading/Spinner';

interface Bag {
  id: string;
  name: string;
  description: string;
  goal: string;
  likes: number;
  totalCategories: number;
  totalItems: number;
  owner: string; 
  userDetails: {
    weightOption: string;
  };
}

const ExploreBags: React.FC = () => {
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [likesFilter, setLikesFilter] = useState<string>('');
  const [goalFilter, setGoalFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const itemsPerPage = 10;

  const { loading: bagsLoading, error: bagsError, data: bagsData, refetch } = useQuery(GET_EXPLORE_BAGS);
  const { loading: userLoading, error: userError, data: userData } = useQuery(GET_USER);
  const { loading: usersLoading, error: usersError, data: usersData } = useQuery(GET_USERS);

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const handleSelectChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (
    e: ChangeEvent<HTMLSelectElement>
  ) => {
    setter(e.target.value);
    setCurrentPage(1);
  };

  const getGoalOptions = () => {
    if (!userData) return [];
    const weightOption = userData.user.weightOption;
    return weightOption === 'kg'
      ? ['Under 5 kg', '5-10 kg', '10+ kg']
      : ['Under 10 lb', '10-20 lb', '20+ lb'];
  };

  if (bagsLoading || userLoading || usersLoading) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-center">
        <Spinner w={10} h={10} />
      </div>
    );
  }

  if (bagsError || userError || usersError) {

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

  const filteredBags = bagsData.exploreBags.filter((bag: Bag) => {
    const userMatch = usersData.users.some((user: any) =>
      user.username.toLowerCase().includes(searchFilter.toLowerCase())
    );

    const searchMatch = bag.name.toLowerCase().includes(searchFilter.toLowerCase()) || userMatch;
                    
    const likesMatch = !likesFilter || likesFilter === 'All' ||
                       (likesFilter === '0-10' && bag.likes <= 10) ||
                       (likesFilter === '10-100' && bag.likes > 10 && bag.likes <= 100) ||
                       (likesFilter === '100-1000' && bag.likes > 100 && bag.likes <= 1000) ||
                       (likesFilter === '1000+' && bag.likes > 1000);
    const goalMatch = !goalFilter || goalFilter === 'All' ||
                      (goalFilter === 'Under 5 kg' && parseFloat(bag.goal) < 5) ||
                      (goalFilter === '5-10 kg' && parseFloat(bag.goal) >= 5 && parseFloat(bag.goal) <= 10) ||
                      (goalFilter === '10+ kg' && parseFloat(bag.goal) > 10) ||
                      (goalFilter === 'Under 10 lb' && parseFloat(bag.goal) < 10) ||
                      (goalFilter === '10-20 lb' && parseFloat(bag.goal) >= 10 && parseFloat(bag.goal) <= 20) ||
                      (goalFilter === '20+ lb' && parseFloat(bag.goal) > 20);
    return searchMatch && likesMatch && goalMatch;
  });

  const totalPages = Math.ceil(filteredBags.length / itemsPerPage);
  const paginatedBags = filteredBags.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const baseInputClass = "py-2 px-3 block w-full bg-white rounded-lg text-sm focus:z-10 focus:outline-none";
  const baseDarkInputClass = "dark:bg-neutral-800 dark:placeholder-neutral-400 dark:text-gray-200 bg-gray-50 border dark:border-zinc-700";
  const baseButtonClass = "p-2 min-w-[32px] inline-flex justify-center items-center gap-x-2 text-xs rounded-full text-gray-800 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-neutral-700 dark:focus:bg-neutral-700";

  const renderInput = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, placeholder: string) => (
    <input
      type="text"
      className={`${baseInputClass} ${baseDarkInputClass} ps-9`}
      placeholder={placeholder}
      value={value}
      onChange={(e) => setter(e.target.value)}
    />
  );

  const renderSelect = (value: string, setter: React.Dispatch<React.SetStateAction<string>>, options: string[], allOptionLabel: string) => (
    <select
      className={`${baseInputClass} ${baseDarkInputClass}`}
      value={value}
      onChange={handleSelectChange(setter)}
    >
      <option value="">{allOptionLabel}</option>
      {options.map(option => (
        <option key={option} value={option} className="dark:text-zinc-800">{option}</option>
      ))}
    </select>
  );

  const renderCell = (content: string | number) => (
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 ">
      {content}
    </td>
  );

  return (
    <div className="container mx-auto sm:mt-0 sm:p-0 mt-20 p-3">
    <div className="sm:p-5">
      <div className="bg-white dark:bg-box p-5 rounded-lg mb-5">
      <div className="flex items-center mb-6">
        <button 
          type="button" 
          className={`mr-4 text-white bg-primary hover:bg-button-hover p-2 rounded hover:shadow-sm`} 
          onClick={() => navigate(-1)}>
          <FaArrowLeft size={17} />
        </button>
        <h1 className="text-xl font-semibold dark:text-white">Explore Bags</h1>
      </div>
      <p className="text-base text-accent dark:text-gray-400">
        Discover top-rated bags for every journey. Whether you're conquering remote peaks or exploring dense forests, find your perfect companion.
      </p>
      </div>
     
     
        
          <div className="inline-block min-w-full align-middle">
            <div className="rounded-lg divide-y divide-gray-200 dark:border-neutral-700 dark:divide-neutral-700 bg-white dark:bg-box mb-3">
              <div className="py-4 px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="relative">
                    <label className="sr-only">Search</label>
                    {renderInput(searchFilter, setSearchFilter, "Search by name")}
                    <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-3">
                      <svg className="size-4 text-gray-400 dark:text-neutral-500" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                      </svg>
                    </div>
                  </div>
                  {renderSelect(likesFilter, setLikesFilter, ['0-10', '10-100', '100-1000', '1000+'], 'Likes')}
                  {renderSelect(goalFilter, setGoalFilter, getGoalOptions(), 'Goal')}
                </div>
              </div>
              
               <div id="scroll" className='overflow-x-scroll sm:overflow-x-visible'>
                <div className='w-48 sm:w-full'>
                <table className="w-full divide-y divide-gray-200 dark:divide-neutral-700">
                  <thead className="bg-gray-50 dark:bg-neutral-700">
                    <tr>
                      {['User name', 'Bag name', 'Description', `Goal (${userData.user.weightOption})`, 'Categories', 'Items', 'Likes'].map((header, index) => (
                        <th key={`header-${index}`} scope="col" className="px-6 py-3 text-start text-xs font-medium text-gray-500 uppercase dark:text-neutral-300">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-neutral-700">
                    {paginatedBags.map((bag: Bag) => {
                      const user = usersData.users.find((user: any) => user.id === bag.owner);
                      const truncatedName = bag.name.length > 20 ? `${bag.name.substring(0, 20)}...` : bag.name;
                      const truncatedDescription = bag?.description?.length > 40 ? `${bag.description.substring(0, 40)}...` : bag.description;
  
                      return (
                        <tr 
                          key={bag.id} 
                          className="cursor-pointer"
                          onClick={() => window.location.href = `/share/${bag.id}`}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 dark:text-neutral-200 flex items-center">
                            <img src={user?.imageUrl || '/images/default.jpg'} alt='user' className='w-6 h-6 object-cover rounded-full mr-4' /> 
                            {user?.username}
                          </td>
                          {renderCell(truncatedName)}
                          {renderCell(truncatedDescription)}
                          {renderCell(bag.goal)}
                          {renderCell(bag.totalCategories)}
                          {renderCell(bag.totalItems)}
                          {renderCell(bag.likes)}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                </div>
                </div>
              </div>
              {filteredBags.length > 10 && (
                <div className="py-2 px-4">
                  <nav className="flex items-center space-x-1" aria-label="Pagination">
                    <button 
                      type="button" 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      disabled={currentPage === 1}
                      className={baseButtonClass}>
                      «
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button 
                        key={`page-${page}`} 
                        type="button" 
                        onClick={() => handlePageChange(page)}
                        className={`${baseButtonClass} ${currentPage === page ? 'bg-gray-200 dark:bg-neutral-700' : ''}`}>
                        {page}
                      </button>
                    ))}
                    <button 
                      type="button" 
                      onClick={() => handlePageChange(currentPage + 1)} 
                      disabled={currentPage === totalPages}
                      className={baseButtonClass}>
                      »
                    </button>
                  </nav>
                </div>
              )}
            </div>
       
      { paginatedBags.length > 0 ? null : <Message 
          width="w-full" 
          title="No Bags Found" 
          padding="sm:p-5 p-3" 
          titleMarginBottom="mb-2" 
          message="There are no bags that match your search criteria. Please adjust your filters and try again." 
          type="info" 
        />  }
   
    </div>
  </div>
  
  );
  };


export default ExploreBags;
