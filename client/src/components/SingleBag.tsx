import React,  {useState} from 'react';
import { SingleBagProps } from '../types/bag';
import { useNavigate } from 'react-router-dom';
import { IoNavigate } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import DeleteBagModal from './popups/DeleteBagModal';

const SingleBag: React.FC<SingleBagProps> = ({ bagData }) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const navigate = useNavigate();

  

  const handleViewDetails = () => {
    navigate(`/bag/${bagData.id}`);
  };

  const handleDeleteBag = () => {
    setIsModalDeleteOpen(true)
}


  return (
    <div
      className={`relative bg-white dark:bg-box shadow-lg rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group`}>
      <div className="flex justify-center items-center h-40 bg-white dark:bg-box rounded-t-lg">
        <img 
          src="/images/backpack.png" 
          alt={bagData.name} 
          className='w-16 h-16 object-contain cursor-pointer'
          onClick={handleViewDetails}
        />
      </div>
      <div className='p-3 flex flex-col space-y-4 bg-secondary dark:bg-zinc-800 rounded-b-lg'>
        <div className='flex items-center justify-between'>
          <h3 className='text-sm text-gray-900 dark:text-white'>
          {bagData.name && bagData.name.length > 28 ? `${bagData.name.substring(0, 28)}...` : bagData.name}
          </h3>
          <div className='flex items-center space-x-2 transition-opacity duration-200'>

          <IoNavigate 
              className='text-button cursor-pointer transform transition-transform duration-200 hover:scale-125'
              title='View Details'
              onClick={handleViewDetails}/>

             <MdDeleteForever 
              size={18}
              className='text-red-400 cursor-pointer transform transition-transform duration-200 hover:scale-125'
              title='View Details'
              onClick={handleDeleteBag}
            />
           
          </div>
        </div>
      </div>

      <DeleteBagModal isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)} bag={bagData}  />

    </div>
  );
};

export default React.memo(SingleBag);
