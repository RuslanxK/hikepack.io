import React,  {useState} from 'react';
import { SingleBagProps } from '../types/bag';
import { useNavigate } from 'react-router-dom';
import { IoNavigate } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import DeleteBagModal from './popups/DeleteBagModal';
import DuplicateBag from './popups/DuplicateBag';
import { HiDocumentDuplicate } from "react-icons/hi2";


const SingleBag: React.FC<SingleBagProps> = ({ bagData }) => {
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalDuplicateOpen, setIsModalDuplicateOpen] = useState(false);

  const navigate = useNavigate();

  
  const handleViewDetails = () => {
    navigate(`/bag/${bagData.id}`);
  };

  const handleDeleteBag = () => {
    setIsModalDeleteOpen(true)
}


const handleDuplicateBag = () => {
  setIsModalDuplicateOpen(true)
}


  return (
    <div
      className={`relative bg-white dark:bg-box shadow-airbnb rounded-lg mb-4 transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl group`}>
        <button className='bg-white p-1 rounded-full absolute top-2 right-2 transform transition-transform duration-200 hover:scale-125'>
        <HiDocumentDuplicate size={14} className='text-accent cursor-pointer' onClick={handleDuplicateBag} />
        </button>
      <div className="flex justify-center items-center h-40 bg-white dark:bg-box rounded-t-lg cursor-pointer" onClick={handleViewDetails}>
        <img 
          src={bagData.imageUrl} 
          alt={bagData.name} 
          className='w-full h-40 object-cover rounded-t-lg'
        />
      </div>
      <div className="p-3 flex flex-col space-y-4 bg-white dark:bg-black rounded-b-lg">
        <div className='flex items-center justify-between'>
          <h3 className='text-sm text-black dark:text-white'>
          {bagData.name && bagData.name.length > 28 ? `${bagData.name.substring(0, 28)}...` : bagData.name}
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
              onClick={handleDeleteBag}
            />
           
          </div>
        </div>
      </div>

      <DeleteBagModal isOpen={isModalDeleteOpen} onClose={() => setIsModalDeleteOpen(false)} bag={bagData}  />
      <DuplicateBag isOpen={isModalDuplicateOpen} onClose={() => setIsModalDuplicateOpen(false)} bag={bagData}  />

    </div>
  );
};

export default React.memo(SingleBag);
