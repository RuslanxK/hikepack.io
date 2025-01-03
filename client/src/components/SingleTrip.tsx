import React, { useState} from 'react';
import { SingleTripProps } from '../types/trip';
import { useNavigate } from 'react-router-dom';
import { IoNavigate } from "react-icons/io5";
import DeleteTripModal from './popups/DeleteTripModel';
import { MdDeleteForever } from "react-icons/md";
import { HiDocumentDuplicate } from "react-icons/hi2";
import DuplicateTrip from './popups/DuplicateTrip';

const SingleTrip: React.FC<SingleTripProps> = ({ tripData }) => {

  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalDuplicateOpen, setIsModalDuplicateOpen] = useState(false);

  const navigate = useNavigate()
  
  const handleViewDetails = () => {
   navigate(`/trip/${tripData.id}`);
  };

  const handleDeleteTrip = () => {
    setIsModalDeleteOpen(true)
}

const handleDuplicateTrip = () => {
  setIsModalDuplicateOpen(true)
}

  return (
    <div
      className={`relative bg-white dark:bg-box shadow-airbnb rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group`}>
      <button className='bg-white p-1 rounded-full absolute top-2 right-2 transform transition-transform duration-200 hover:scale-125'>
      <HiDocumentDuplicate size={14} className='text-accent' onClick={handleDuplicateTrip} />
      </button>
      <img 
        src={tripData.imageUrl} 
        alt={tripData.name} 
        onClick={handleViewDetails}
        className='w-full h-40 object-cover rounded-t-lg cursor-pointer'
      />
      <div className='p-3 flex flex-col space-y-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm text-black dark:text-white'>
           {tripData.name.length > 32 ? `${tripData.name.substring(0, 28)}...` : tripData.name}
          </h3>
          <div className='flex items-center space-x-2 transition-opacity duration-200'>
            <IoNavigate 
              className='text-primary dark:text-white cursor-pointer transform transition-transform duration-200 hover:scale-125'
              title='View Details'
              onClick={handleViewDetails}/>

              <MdDeleteForever 
              size={18}
              className='text-accent dark:text-white cursor-pointer transform transition-transform duration-200 hover:scale-125'
              title='View Details'
              onClick={handleDeleteTrip}/>
          </div>
        </div>
      </div>

      <DeleteTripModal isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)} trip={tripData} />
      <DuplicateTrip isOpen={isModalDuplicateOpen} onClose={() => setIsModalDuplicateOpen(false)} trip={tripData}/>
    </div>
  );
};

export default React.memo(SingleTrip);
