import React, { useState, useEffect } from 'react';
import { FaImage, FaWalking, FaLink } from 'react-icons/fa';
import { HiDocumentDuplicate } from 'react-icons/hi2';
import { GrDrag } from 'react-icons/gr';
import { Item } from '../../types/item';

interface LocalSingleItemProps {
  itemData: Item;
  onDelete: (id: string) => void;
  onUpdate: (updatedItem: Item) => void;
  onCheckboxChange: (id: string, checked: boolean) => void;
}

const inputClasses =
  'py-1 px-2 rounded border-gray-200 border text-sm focus:outline-none focus:ring-1 focus:ring-button-lightGreen dark:bg-box dark:border-neutral-600 dark:text-neutral-200 dark:placeholder-neutral-500';
const iconClasses = 'text-accent transform transition-transform duration-200 hover:scale-125';

const LocalSingleItem: React.FC<LocalSingleItemProps> = ({
  itemData,
  onDelete,
  onUpdate,
  onCheckboxChange,
}) => {
  const [itemName, setItemName] = useState(itemData.name);
  const [itemDescription, setItemDescription] = useState(itemData.description || '');
  const [itemQty, setItemQty] = useState(itemData.qty || 1);
  const [itemWeight, setItemWeight] = useState(itemData.weight || 0.1);
  const [weightOption, setWeightOption] = useState(itemData.weightOption || 'lb');
  const [priority, setPriority] = useState(itemData.priority || 'low');
  const [worn, setWorn] = useState(itemData.worn || false);
  const [checked, setChecked] = useState(false);

  const priorityClass =
    priority === 'low'
      ? 'bg-emerald-100 dark:bg-primary'
      : priority === 'med'
      ? 'bg-yellow-100 dark:bg-button-yellow'
      : 'bg-red-100 dark:bg-button-orange';

  /**
   * Handle Local Storage Sync
   */
  const updateLocalStorage = (updatedItem: Item) => {
    localStorage.setItem(itemData.id, JSON.stringify(updatedItem));
    onUpdate(updatedItem);
  };

  /**
   * Handle Updates
   */
  const handleUpdate = (field: keyof Item, value: any) => {
    const updatedItem: Item = { ...itemData, [field]: value };
    updateLocalStorage(updatedItem);
  };

  /**
   * Handle Checkbox Selection
   */
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setChecked(isChecked);
    onCheckboxChange(itemData.id, isChecked);
  };

  /**
   * Toggle Worn Status
   */
  const handleToggleWorn = () => {
    setWorn(!worn);
    handleUpdate('worn', !worn);
  };

  /**
   * Duplicate Item
   */
  const handleDuplicate = () => {
    const duplicatedItem: Item = {
      ...itemData,
      id: Date.now().toString(),
      name: `${itemName} (Copy)`,
    };
    localStorage.setItem(duplicatedItem.id, JSON.stringify(duplicatedItem));
    onUpdate(duplicatedItem);
  };

  /**
   * Initialize State from Local Storage
   */
  useEffect(() => {
    const storedItem = localStorage.getItem(itemData.id);
    if (storedItem) {
      const parsedItem: Item = JSON.parse(storedItem);
      setItemName(parsedItem.name);
      setItemDescription(parsedItem.description || '');
      setItemQty(parsedItem.qty || 1);
      setItemWeight(parsedItem.weight || 0.1);
      setWeightOption(parsedItem.weightOption || 'lb');
      setPriority(parsedItem.priority || 'low');
      setWorn(parsedItem.worn || false);
    }
  }, [itemData.id]);

  return (
    <div
      id='scroll'
      className='container sm:w-full overflow-x-scroll sm:overflow-x-visible relative'
    >
      <div className='flex flex-row items-center justify-between w-full space-x-2'>
        {/* Drag Handle and Checkbox */}
        <div className='flex items-center'>
          <GrDrag className='mr-2 text-accent dark:text-gray-400 cursor-grabbing' size={14} />
          <input
            type='checkbox'
            checked={checked}
            onChange={handleCheckboxChange}
            className='w-4 h-4 text-blue-600 border-gray-300 cursor-pointer'
          />
        </div>

        {/* Item Name */}
        <input
          type='text'
          placeholder='e.g., Hiking socks'
          name='name'
          className={`${inputClasses} w-auto sm:w-full`}
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          onBlur={() => handleUpdate('name', itemName)}
        />

        {/* Item Description */}
        <input
          type='text'
          placeholder='note'
          name='description'
          className={`${inputClasses} w-auto sm:w-full`}
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          onBlur={() => handleUpdate('description', itemDescription)}
        />

        {/* Quantity */}
        <label htmlFor='qty' className='text-xs text-gray-600 dark:text-gray-300 mb-1'>
          Qty
        </label>
        <input
          type='number'
          id='qty'
          name='qty'
          className={`${inputClasses} w-16`}
          min={1}
          value={itemQty}
          onChange={(e) => setItemQty(Number(e.target.value))}
          onBlur={() => handleUpdate('qty', itemQty)}
        />

        {/* Weight */}
        <label htmlFor='weight' className='text-xs text-gray-600 dark:text-gray-300 mb-1'>
          Weight
        </label>
        <input
          type='number'
          id='weight'
          name='weight'
          className={`${inputClasses} w-20`}
          min={0}
          value={itemWeight}
          onChange={(e) => setItemWeight(Number(e.target.value))}
          onBlur={() => handleUpdate('weight', itemWeight)}
        />

        {/* Weight Unit */}
        <select
          value={weightOption}
          onChange={(e) => setWeightOption(e.target.value)}
          onBlur={() => handleUpdate('weightOption', weightOption)}
          className={`${inputClasses} w-20`}
        >
          <option value='lb'>lb</option>
          <option value='kg'>kg</option>
          <option value='g'>g</option>
          <option value='oz'>oz</option>
        </select>

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          onBlur={() => handleUpdate('priority', priority)}
          className={`text-black dark:text-gray-200 focus:outline-none text-sm inline-flex items-center border w-48 ${inputClasses} ${priorityClass} cursor-pointer`}
        >
          <option value='low'>Low Priority</option>
          <option value='med'>Med Priority</option>
          <option value='high'>High Priority</option>
        </select>

        {/* Icons */}
        <div className='flex space-x-3 pl-2 relative'>
          <FaImage size={14} className={`${iconClasses}`} />
          <FaWalking size={14} className={`${iconClasses}`} onClick={handleToggleWorn} />
          <HiDocumentDuplicate size={14} className={`${iconClasses}`} onClick={handleDuplicate} />
          <FaLink size={14} className={`${iconClasses}`} />
        </div>
      </div>
    </div>
  );
};

export default React.memo(LocalSingleItem);
