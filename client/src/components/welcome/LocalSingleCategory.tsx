import React, { useState, useRef, useCallback } from 'react';
import { FaChevronDown, FaChevronUp, FaPlus } from 'react-icons/fa';
import { TiDelete } from 'react-icons/ti';
import { GrDrag } from 'react-icons/gr';
import { Category } from '../../types/category';
import LocalSingleItem from './LocalSingleItem';
import { Item } from '../../types/item';

interface LocalSingleCategoryProps {
  categoryData: Category;
  onDelete: (id: string) => void;
  onUpdate: (updatedCategory: Category) => void;
  weightUnit?: string;
}

const LocalSingleCategory: React.FC<LocalSingleCategoryProps> = ({
  categoryData,
  onDelete,
  onUpdate,
}) => {
  const [expanded, setExpanded] = useState(true);
  const [categoryName, setCategoryName] = useState(categoryData.name);
  const [items, setItems] = useState(categoryData.items);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  const nameInputRef = useRef<HTMLInputElement>(null);

  // Toggle Expand/Collapse
  const handleRowClick = () => {
    setExpanded(!expanded);
  };

  // Update Category Name
  const handleNameUpdate = () => {
    if (categoryName !== categoryData.name) {
      const updatedCategory = { ...categoryData, name: categoryName };
      onUpdate(updatedCategory);
    }
  };

  // Add a New Item
  const handleAddItem = () => {
    const newItem: Item = {
      id: Date.now().toString(),
      name: 'New Item',
      weight: 0,
      tripId: categoryData.tripId,
      bagId: categoryData.bagId,
      categoryId: categoryData.id,
      qty: 1,
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdate({ ...categoryData, items: updatedItems });
    localStorage.setItem(newItem.id, JSON.stringify(newItem));
  };

  // Update an Item
  const handleUpdateItem = (updatedItem: Item) => {
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    onUpdate({ ...categoryData, items: updatedItems });
    localStorage.setItem(updatedItem.id, JSON.stringify(updatedItem));
  };

  // Delete an Item
  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    onUpdate({ ...categoryData, items: updatedItems });
    localStorage.removeItem(id);
  };

  // Handle Checkbox Selection
  const handleCheckboxChange = useCallback((id: string, checked: boolean) => {
    setCheckedItems((prev) => {
      if (checked) {
        return [...prev, id];
      } else {
        return prev.filter((itemId) => itemId !== id);
      }
    });
  }, []);

  // Delete Selected Items
  const handleDeleteSelectedItems = () => {
    const updatedItems = items.filter((item) => !checkedItems.includes(item.id));
    setItems(updatedItems);
    onUpdate({ ...categoryData, items: updatedItems });

    checkedItems.forEach((id) => localStorage.removeItem(id));
    setCheckedItems([]);
  };

  return (
    <div
      className='mb-2 bg-white dark:bg-box rounded-lg'
      style={{ borderLeft: `8px solid ${categoryData.color}` }}
    >
      {/* Header */}
      <div className='py-2.5 pl-2 pr-2 text-sm flex justify-between items-center cursor-pointer w-full'>
        {/* Drag Handle */}
        <GrDrag
          className='mr-2 text-accent dark:text-gray-400 cursor-grabbing'
          size={17}
        />

        {/* Category Name Input */}
        <input
          ref={nameInputRef}
          type='text'
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          onBlur={handleNameUpdate}
          placeholder='e.g., Clothes'
          className='border-b border-neutral-200 dark:border-neutral-600 px-2 py-1 mr-4 flex-grow bg-transparent focus:outline-none focus:ring-1 focus:ring-button-lightGreen rounded text-gray-800 dark:text-gray-200'
        />

        {/* Action Buttons */}
        <div className='flex items-center'>
          <button onClick={handleRowClick} className='mr-2 text-gray-400 dark:text-gray-500 close-open-category-button'>
            {expanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
          </button>
          <button
            onClick={() => onDelete(categoryData.id)}
            className='text-accent transition-transform duration-200 hover:scale-125'
          >
            <TiDelete size={24} />
          </button>
        </div>
      </div>

      {/* Items Section */}
      {expanded && (
        <div className='px-5 text-sm rounded-b-lg'>
          {items.length > 0 ? (
            <div className='space-y-2'>
              {items.map((item) => (
                <LocalSingleItem
                  key={item.id}
                  itemData={item}
                  onDelete={handleDeleteItem}
                  onUpdate={handleUpdateItem}
                  onCheckboxChange={handleCheckboxChange}
                />
              ))}
            </div>
          ) : (
            null
          )}

          {checkedItems.length > 0 ? (
            <button
              onClick={handleDeleteSelectedItems}
              className='mt-4 mb-4 flex items-center text-red-500 hover:text-red-700 transition-transform duration-200 hover:scale-110'
            >
              <TiDelete className='mr-1' size={19} /> Delete Items
            </button>
          ) : (
            <button
              onClick={handleAddItem}
              className='mt-4 mb-4 flex items-center text-primary hover:text-accent'
            >
              <FaPlus className='mr-1' size={14} /> Add Item
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default React.memo(LocalSingleCategory);
