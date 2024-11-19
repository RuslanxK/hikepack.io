import React, { useState, useEffect} from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { CategoryProps } from '../../types/category';
import {  Item } from '../../types/item';
import ItemShare from './ItemShare'

const CategoryShare: React.FC<CategoryProps> = ({ categoryData, weightUnit }) => {
  const [expanded, setExpanded] = useState(true);

  const [itemsData, setItemsData] = useState<Item[]>([]);

  useEffect(() => {
    if (categoryData.items) {
      setItemsData(categoryData.items.slice().sort((a, b) => (a.order ?? 0) - (b.order ?? 0)));
    }
  }, [categoryData.items]);

  const handleRowClick = () => {
    setExpanded(!expanded);
  };

  
  return (
    <div className="mb-2">
      <div className="cursor-pointer bg-white dark:bg-zinc-800 w-full rounded-t-lg">
        <div className="py-2.5 pl-2 pr-2 text-sm w-full">
          <div className="flex justify-between items-center w-full">
            <input
              type="text"
              readOnly
              defaultValue={categoryData.name}
              placeholder='name'
              className="border-b border-gray-300 dark:border-gray-600 px-2 py-1 mr-4 flex-grow bg-transparent focus:outline-none w-full text-gray-800 dark:text-gray-200"/>
            <div className="flex items-center">
              <span className="mr-2 text-gray-400 dark:text-gray-500" onClick={handleRowClick}>
                {expanded ? <FaChevronUp size={13}/> : <FaChevronDown size={13}/>}
              </span>
            </div>
          </div>
        </div>
      </div>
      {expanded && (
        <div className="w-full">
          <div className="px-5 pb-5 text-sm w-full bg-white dark:bg-zinc-800 rounded-b-lg">
            <div className="w-full">
                  {itemsData.map((item) => (
                    <ItemShare key={item.id} itemData={item} weightUnit={weightUnit}  />
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(CategoryShare);
