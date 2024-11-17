import React from 'react';

interface GridBoxProps {
  title: string;
  details: string;
  goal: string;
  icon: React.ElementType;
}

const GridBox: React.FC<GridBoxProps> = ({ details, title, icon: Icon, goal }) => {
  return (
    <div className='w-full sm:w-72 h-48 bg-theme-white dark:bg-box p-7 rounded-lg flex flex-col justify-between'>
      <h2 className='text-base text-black dark:text-gray-100 text-left'>{title}</h2>
      <Icon size={25} className="text-accent dark:text-white" />
      <p className='text-lg text-black dark:text-gray-50 font-semibold text-left'>{details} {goal}</p>
    </div>
  );
};

export default GridBox;
