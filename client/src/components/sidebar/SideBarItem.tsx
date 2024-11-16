import React from 'react';
import { Link } from 'react-router-dom';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface SideBarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  showArrow?: boolean;
  isOpen?: boolean;
  setIsSidebarOpen?: (isOpen: boolean) => void;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ to, icon: Icon, label, onClick, showArrow, isOpen, setIsSidebarOpen }) => {
  
  const handleItemClick = () => {
    if (onClick) {
      onClick();
    }
    if (setIsSidebarOpen && label !== 'Recent bags') {
      setIsSidebarOpen(false);
    }
  };

  return (
    <li className="mb-2">
      <Link
        to={to}
        className="group flex items-center p-2 text-sm rounded ease-in-out relative text-black dark:text-white bg-transparent after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-[1.5px] after:w-0 after:bg-primary dark:after:bg-button-lightGreen after:origin-left after:rounded-full hover:after:w-full after:transition-[width] after:duration-300 group-hover:text-primary dark:group-hover:text-button-lightGreen"
        onClick={handleItemClick}>
        <Icon className="mr-3 text-black dark:text-white group-hover:text-primary dark:group-hover:text-button-lightGreen" />
        <span className="group-hover:text-primary dark:group-hover:text-button-lightGreen">{label}</span>
        {showArrow && (isOpen ? <FaChevronUp className="ml-auto group-hover:text-primary dark:group-hover:text-button-lightGreen" /> : <FaChevronDown className="ml-auto group-hover:text-primary dark:group-hover:text-button-lightGreen" />)}
      </Link>
    </li>
  );
};

export default SideBarItem;
