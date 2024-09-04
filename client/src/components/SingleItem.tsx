import React, { useState, useEffect, useRef } from 'react';
import { SingleItemProps } from '../types/item';
import { FaImage, FaWalking, FaCopy, FaLink } from 'react-icons/fa';
import { GrDrag } from 'react-icons/gr';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMutation } from '@apollo/client';
import { UPDATE_ITEM, ADD_ITEM } from '../queries/itemQueries';
import ItemPictureModal from './popups/ItemPictureModal';
import AddLinkModal from './popups/AddLinkModal';
import { GET_CATEGORIES } from '../queries/categoryQueries';
import { GET_ITEMS, GET_ALL_ITEMS } from '../queries/itemQueries';

const inputClasses = "py-1 px-2 border-gray-200 border text-sm focus:outline-none focus:ring-1 focus:ring-primary dark:bg-box dark:border-neutral-600 dark:text-neutral-200 dark:placeholder-neutral-500";
const iconClasses = "transform transition-transform duration-200 hover:scale-125";

const SingleItem: React.FC<SingleItemProps> = ({ itemData, sendChecked, weightUnit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: itemData.id });
  const style = { transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

  const [isModalPicOpen, setIsModalPicOpen] = useState(false);
  const [isModalLinkOpen, setIsModalLinkOpen] = useState(false);
  const [weightOption, setWeightOption] = useState(itemData.weightOption || weightUnit);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isPriorityDropdownOpen, setIsPriorityDropdownOpen] = useState(false);
  const [tooltipContent, setTooltipContent] = useState('');
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);

  const [updateItem] = useMutation(UPDATE_ITEM);
  const [addItem] = useMutation(ADD_ITEM);

  const priorityClass = itemData.priority === 'low' ? 'bg-emerald-100 dark:bg-emerald-600' : itemData.priority === 'med' ? 'bg-yellow-100 dark:bg-yellow-600' : 'bg-red-100 dark:bg-red-600';

  useEffect(() => {
    if (itemData.weightOption) {
      setWeightOption(itemData.weightOption);
    } else if (weightUnit) {
      setWeightOption(weightUnit);
    }
  }, [itemData.weightOption, weightUnit]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setIsPriorityDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, priorityDropdownRef]);

  const handleBlur = (field: string, value: any) => {
    updateItem({
      variables: { id: itemData.id, [field]: value },
      refetchQueries: [{ query: GET_CATEGORIES, variables: { bagId: itemData.bagId } }, { query: GET_ALL_ITEMS }]
    });
  };

  const handleWeightOptionChange = (unit: string) => {
    setWeightOption(unit);
    setIsDropdownOpen(false);
    updateItem({
      variables: { id: itemData.id, weightOption: unit },
      refetchQueries: [{ query: GET_CATEGORIES, variables: { bagId: itemData.bagId } }, { query: GET_ALL_ITEMS }]
    });
  };

  const handlePriorityChange = (priority: string) => {
    handleBlur('priority', priority);
    setIsPriorityDropdownOpen(false);
  };

  const handleQtyChange = (value: number) => {
    updateItem({ variables: { id: itemData.id, qty: value },
      refetchQueries: [{ query: GET_CATEGORIES, variables: { bagId: itemData.bagId } }]
    });
  };

  const handleWeightChange = (value: number) => {
    updateItem({ variables: { id: itemData.id, weight: value },
      refetchQueries: [{ query: GET_CATEGORIES, variables: { bagId: itemData.bagId } }]
    });
  };

  const handleToggleWorn = () => {
    updateItem({ variables: { id: itemData.id, worn: !itemData.worn },
      refetchQueries: [{ query: GET_CATEGORIES, variables: { bagId: itemData.bagId } }]
    });
  };

  const handlePicModal = () => {
    setIsModalPicOpen(true);
  };

  const handleCopyItem = async () => {
    try {
      await addItem({
        variables: {
          tripId: itemData.tripId,
          bagId: itemData.bagId,
          categoryId: itemData.categoryId,
          name: itemData.name,
          description: itemData.description,
          qty: itemData.qty,
          weight: itemData.weight,
          priority: itemData.priority,
          worn: itemData.worn,
        },
        refetchQueries: [{ query: GET_ITEMS, variables: { categoryId: itemData.categoryId } },
          { query: GET_CATEGORIES, variables: { bagId: itemData.bagId } }
        ]
      });
    } catch (error) {
      console.error("Error copying item:", error);
    }
  };

  const updateChecked = async (e: any) => {
    sendChecked(itemData.id, e.target.checked);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const togglePriorityDropdown = () => setIsPriorityDropdownOpen(!isPriorityDropdownOpen);

  const showTooltip = (content: string) => {
    setTooltipContent(content);
    setTooltipVisible(true);
  };

  const hideTooltip = () => {
    setTooltipVisible(false);
  };

  return (
    <div id='scroll' className="container py-0.5 sm:w-full overflow-x-scroll sm:overflow-x-visible relative" ref={setNodeRef} style={style}>
      <div className='flex flex-row items-center justify-between w-48 space-x-2 sm:w-full'>
      <div className="flex items-center">
        <GrDrag className="mr-2 text-gray-400 dark:text-gray-200 no-outline cursor-grabbing" size={14} {...attributes} {...listeners} />
        <input type="checkbox" id="checkbox-default" onChange={updateChecked} className="w-4 h-4 text-blue-600 border-gray-300"/>
      </div>

      <input 
        type="text" 
        placeholder="e.g., Hiking socks"
        name="name" 
        className={`${inputClasses} w-auto sm:w-full`} 
        defaultValue={itemData.name} 
        onBlur={(e) => handleBlur('name', e.target.value)} 
      />

      <input 
        type="text" 
        placeholder="note" 
        name="description" 
        className={`${inputClasses} w-auto sm:w-full`} 
        defaultValue={itemData.description} 
        onBlur={(e) => handleBlur('description', e.target.value)} 
      />

      <label htmlFor="qty" className="text-xs text-gray-600 dark:text-gray-300 mb-1">Qty</label>
      <input 
        type="number" 
        id="qty" 
        name="qty" 
        className={`${inputClasses} w-16`} 
        min={1} 
        defaultValue={itemData.qty} 
        onChange={(e) => handleQtyChange(+e.target.value)} 
      />

      <label htmlFor="weight" className="text-xs text-gray-600 dark:text-gray-300 mb-1">Weight</label>
      <input 
        type="number" 
        id="weight" 
        name="weight" 
        className={`${inputClasses} w-20`} 
        min={0} 
        defaultValue={itemData.weight} 
        onChange={(e) => handleWeightChange(+e.target.value)} 
      />


  <select
    id="weight-unit-select"
    value={weightOption}
    onChange={(e) => handleWeightOptionChange(e.target.value)} 
    className={`text-gray-900 dark:text-gray-200 focus:outline-none text-sm inline-flex items-center border ${inputClasses}`}
  >
    <option value="lb" className="bg-white dark:bg-zinc-700">lb</option>
    <option value="kg" className="bg-white dark:bg-zinc-700">kg</option>
    <option value="g" className="bg-white dark:bg-zinc-700">g</option>
    <option value="oz" className="bg-white dark:bg-zinc-700">oz</option>
  </select>

    
  <select
    id="priority-select"
    value={itemData.priority}
    onChange={(e) => handlePriorityChange(e.target.value)} 
    className={`text-gray-900 dark:text-gray-200 focus:outline-none text-sm inline-flex items-center border w-48 ${inputClasses} ${priorityClass} rounded-none`} // Add `rounded-none`
  >
    <option value="low" className="bg-emerald-100 dark:bg-emerald-600 dark:text-white">Low Priority</option>
    <option value="med" className="bg-yellow-100 dark:bg-yellow-600 dark:text-white">Med Priority</option>
    <option value="high" className="bg-red-100 dark:bg-red-600 dark:text-white">High Priority</option>
  </select>



      <div className="flex space-x-3 pl-2 relative">
        <FaImage 
          size={14} 
          className={`text-gray-500 dark:text-gray-300 ${iconClasses} ${itemData.imageUrl ? 'text-indigo-400 dark:text-indigo-300' : 'text-gray-500 dark:text-neutral-300'}`} 
          onClick={handlePicModal} 
          onMouseEnter={() => showTooltip('image')}
          onMouseLeave={hideTooltip}
        />
        <FaWalking 
          size={14} 
          className={`${iconClasses} ${itemData.worn ? 'text-green dark:text-green' : 'text-gray-500 dark:text-neutral-300'}`} 
          onClick={handleToggleWorn} 
          onMouseEnter={() => showTooltip(itemData.worn ? 'worn' : 'wear')}
          onMouseLeave={hideTooltip}
        />
        <FaCopy 
          size={14} 
          className={`text-gray-500 dark:text-neutral-400 ${iconClasses}`} 
          onClick={handleCopyItem} 
          onMouseEnter={() => showTooltip('duplicate')}
          onMouseLeave={hideTooltip}
        />
        <FaLink 
          size={14} 
          className={`${iconClasses} ${itemData.link ? 'text-cyan-500 dark:text-cyan-400' : 'text-gray-500 dark:text-neutral-300'}`} 
          onClick={() => setIsModalLinkOpen(true)} 
          onMouseEnter={() => showTooltip('link')}
          onMouseLeave={hideTooltip}
        />

{tooltipVisible && (
  <div
    id="tooltip-default"
    role="tooltip"
    className="w-fit absolute bottom-5 right-5 z-10 px-1.5 py-0.5 text-sm text-white rounded-md bg-orange-300 shadow-sm dark:bg-zinc-500 hidden sm:block"
  >
    {tooltipContent}
    <div className="tooltip-arrow" data-popper-arrow></div>
  </div>
)}
      </div>

      <ItemPictureModal isOpen={isModalPicOpen} onClose={() => setIsModalPicOpen(false)} itemId={itemData.id} itemPicLink={itemData.imageUrl || ''} />
      <AddLinkModal isOpen={isModalLinkOpen} onClose={() => setIsModalLinkOpen(false)} itemId={itemData.id} itemLink={itemData.link} />
    </div>
    </div>
  );
}

export default React.memo(SingleItem);
