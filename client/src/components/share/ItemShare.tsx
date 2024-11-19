import React, { useState } from 'react';
import { SingleItemShareProps } from '../../types/item';
import { FaWalking, FaEye } from 'react-icons/fa';
import SharedItemPictureModal from '../../components/popups/SharedItemPictureModal'; 

const inputClasses = " rounded border px-2 py-1 bg-white dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-300 focus:outline-none";
const iconClasses = "text-gray-500 dark:text-gray-400";

const ItemShare: React.FC<SingleItemShareProps> = ({ itemData, weightUnit }) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false); 
  const priority = itemData.priority || 'low';
  const priorityClass = itemData.priority === 'low' ? 'bg-emerald-100' : itemData.priority === 'med' ? 'bg-yellow-100' : 'bg-red-100';
  const displayedWeightUnit = itemData.weightOption || weightUnit;

  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };

  const imageUrl = itemData.imageUrl || ''

  return (
    <div id="scroll" className="container py-0.5 sm:w-full overflow-x-scroll sm:overflow-x-visible relative">
      <div className="flex flex-row items-center justify-between w-48 space-x-2 sm:w-full">
       
          <div className="relative w-12 h-12 flex-shrink-0" onClick={imageUrl ? togglePopup : undefined}>
            <img 
              src={imageUrl ? imageUrl : '/images/no-picture.png'} 
              alt={itemData.name} 
              className="w-full h-full object-cover rounded cursor-pointer"
            />
            { imageUrl ? <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-30 rounded">
              <FaEye size={20} className="text-white" />
            </div> : null }
          </div>
        
        <input 
          type="text" 
          placeholder="name" 
          name="name" 
          className={`${inputClasses} w-auto sm:w-full ${itemData.link ? "text-cyan-500 cursor-pointer hover:text-cyan-600" : "text-gray-500"}`} 
          onClick={() => {
            if (itemData.name.length > 0 && itemData.link) {
              window.open(itemData.link, '_blank');
            }
          }}
          defaultValue={itemData.name} 
          readOnly
        />
        <input 
          type="text" 
          placeholder="note" 
          name="description" 
          className={`${inputClasses} w-auto sm:w-full`} 
          defaultValue={itemData.description} 
          readOnly
        />
        <label htmlFor="qty" className="text-xs text-gray-600 dark:text-gray-300 mb-1">Qty</label>
        <input 
          type="number" 
          id="qty" 
          name="qty" 
          className={`${inputClasses} w-16`} 
          min={1} 
          defaultValue={itemData.qty} 
          readOnly
        />
        <label htmlFor="weight" className="text-xs text-gray-600 dark:text-gray-300 mb-1">Weight</label>
        <input 
          type="number" 
          id="weight" 
          name="weight" 
          className={`${inputClasses} w-20`} 
          min={0} 
          readOnly
          defaultValue={itemData.weight} 
        />

        <span className="border px-2 py-1 dark:border-zinc-600 dark:text-gray-300">
          {displayedWeightUnit}
        </span>
        
        <input 
          type="text"
          value={`${priority.charAt(0).toUpperCase() + priority.slice(1)} priority`}
          readOnly
          className={`w-28 text-sm border ring-gray-300 py-1 dark:text-gray-300 dark:border-gray-500 dark:bg-gray-800 focus:outline-none ${priorityClass} cursor-default text-center`}
        />
        <div className="flex space-x-3 pl-2">
          <FaWalking size={14} className={`${iconClasses} ${itemData.worn ? 'text-green' : ''}`} />
        </div>
      </div>

      <SharedItemPictureModal
        isOpen={isPopupOpen}
        onClose={togglePopup}
        imageUrl={imageUrl} 
        imageAlt={itemData.name}
      />
    </div>
  );
};

export default React.memo(ItemShare);
