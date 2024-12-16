import React from 'react';

interface CardProps {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

const Card: React.FC<CardProps> = ({ title, icon, onClick }) => (
  <div
    className="flex items-center justify-between p-6 bg-white dark:bg-box rounded-lg shadow-md hover:shadow-lg cursor-pointer transform transition-transform hover:scale-105 border dark:border-accent"
    onClick={onClick}
  >
    <div>
      <h2 className="text-lg font-semibold text-gray-800 dark:text-white">{title}</h2>
    </div>
    <div className="text-primary dark:text-gray-300">{icon}</div>
  </div>
);

export default Card;
