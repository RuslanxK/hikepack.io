import React from 'react';
import { GoArrowLeft, GoArrowRight } from "react-icons/go";
import SideItem from './SideItem';
import { Category } from '../../types/category';
import { Item } from '../../types/item';

interface SidePanelProps {
  isVisible: boolean;
  items: Item[];
  toggleVisibility: () => void;
  categories: Category[];

}

const SidePanel: React.FC<SidePanelProps> = ({ isVisible, toggleVisibility, items, categories }) => {

  
  return (
    <div
      className={`bg-primary sm:dark:bg-box dark:bg-theme-bgDark w-1/2 sm:w-56 h-screen fixed right-0 top-0 transition-transform z-40  ${
        isVisible ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <button
        onClick={toggleVisibility}
        className={`fixed sm:top-0 ${isVisible ? "top-16" : "top-20"}  ${isVisible ? "left-0" : "left-[-25px]"} rounded bg-button-orange dark:bg-zinc-500 text-white p-1`}
      >
        {isVisible ? <GoArrowRight size={20} /> : <GoArrowLeft size={20} />}
      </button>
      <div className="p-4 flex flex-col items-center mt-20 sm:mt-0">
        <h2 className="text-lg font-bold text-white mb-4"> Recent Items</h2>
        <ul className="text-base text-gray-100 dark:text-gray-300 max-h-[85vh] overflow-y-auto">
          {items.map(item => (
            <SideItem key={item.id} item={item} categories={categories} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SidePanel;
