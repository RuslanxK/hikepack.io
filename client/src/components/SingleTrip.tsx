import React, { useState} from 'react';
import { SingleTripProps } from '../types/trip';
import { useNavigate } from 'react-router-dom';
import { IoNavigate } from "react-icons/io5";
import DeleteTripModal from './popups/DeleteTripModel';
import { MdDeleteForever } from "react-icons/md";

const SingleTrip: React.FC<SingleTripProps> = ({ tripData }) => {

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const navigate = useNavigate()
  
  const handleViewDetails = () => {
   navigate(`/trip/${tripData.id}`);
  };

  const handleDeleteTrip = () => {
    setIsModalDeleteOpen(true)
}

  return (
    <li
      className={`relative bg-white dark:bg-box shadow-lg rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group cursor-pointer`}>
      <img 
        src={tripData.imageUrl || "/images/placeholder.jpg"} 
        alt={tripData.name} 
        onClick={handleViewDetails}
        className='w-full h-40 object-cover rounded-t-lg'
      />
      <div className='p-3 flex flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm text-gray-900 dark:text-white'>
           {tripData.name.length > 27 ? `${tripData.name.substring(0, 27)}...` : tripData.name}
          </h3>
          <div className='flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200'>
            <IoNavigate 
              className='text-primary cursor-pointer transform transition-transform duration-200 hover:scale-125'
              title='View Details'
              onClick={handleViewDetails}/>

              <MdDeleteForever 
              size={18}
              className='text-red-400 cursor-pointer transform transition-transform duration-200 hover:scale-125'
              title='View Details'
              onClick={handleDeleteTrip}/>
          </div>
        </div>
      </div>

      <DeleteTripModal isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)} trip={tripData} />

    </li>
  );
};

export default React.memo(SingleTrip);
