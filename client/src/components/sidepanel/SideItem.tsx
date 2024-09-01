import React, { useState } from 'react';
import AddItemToCategoryModal from '../popups/AddItemToCategoryModel';
import { Category } from '../../types/category';
import { Item } from '../../types/item';
import { IoMdAddCircle } from "react-icons/io";


interface SideItemProps {
  item: Item
  categories: Category[]
}

const SideItem: React.FC<SideItemProps> = ({ item, categories }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const truncatedName = item.name.length > 13 ? `${item.name.slice(0, 13)}...` : item.name;

  return (
    <li className="mb-2 flex items-center">
      <IoMdAddCircle
        className='mr-2 cursor-pointer text-white transform transition-transform duration-200 hover:scale-125'
        size={28}
        onClick={() => setIsModalOpen(true)}
      /> 
      {truncatedName}
      <AddItemToCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={item}
        categories={categories}
      />
    </li>
  );
};

export default React.memo(SideItem);
