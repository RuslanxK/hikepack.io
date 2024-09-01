import React from 'react';
import { SingleItemShareProps } from '../../types/item';
import { FaWalking } from 'react-icons/fa';

const inputClasses = "border px-2 py-1 bg-white dark:bg-zinc-800 dark:border-zinc-600 dark:text-gray-300 focus:outline-none";
const iconClasses = "text-gray-500 dark:text-gray-400";

const ItemShare: React.FC<SingleItemShareProps> = ({ itemData, weightUnit }) => {
  const priority = itemData.priority || 'low';
  const priorityClass = itemData.priority === 'low' ? 'bg-emerald-100' : itemData.priority === 'med' ? 'bg-yellow-100' : 'bg-red-100';

  const displayedWeightUnit = itemData.weightOption || weightUnit;

  return (
    <div className="flex items-center py-1 space-x-2">
      {itemData.imageUrl && (
        <div className="w-12 h-12 flex-shrink-0">
          <img 
            src={itemData.imageUrl} 
            alt={itemData.name} 
            className="w-full h-full object-cover rounded" 
          />
        </div>
      )}
      <input 
        type="text" 
        placeholder="name" 
        name="name" 
        className={`${inputClasses} w-2/5 ${itemData.link ? "text-cyan-500 cursor-pointer hover:text-cyan-600" : "text-gray-500"}`} 
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
        className={`${inputClasses} w-3/5`} 
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

      <span className="border px-2 py-1 dark:border-zinc-600 dark:text-gray-300 w-[48px]">
        {displayedWeightUnit}
      </span>
       
      <div 
        className={`w-52 text-sm mx-3 flex flex-row pl-2 border ring-gray-300 py-1 dark:text-gray-300 dark:border-gray-500 dark:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-blue-500 ${priorityClass} cursor-default text-center`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)} priority
      </div>
      <div className="flex space-x-3 pl-2">
        <FaWalking size={14} className={`${iconClasses} ${itemData.worn ? 'text-green' : ''}`} />
      </div>
    </div>
  );
}

export default React.memo(ItemShare);
