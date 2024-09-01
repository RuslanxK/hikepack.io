import React from 'react';
import { Link } from 'react-router-dom';
import {FaChevronUp, FaChevronDown } from 'react-icons/fa';

interface SideBarItemProps {
  to: string;
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
  showArrow?: boolean;
  isOpen?: boolean;
}

const SideBarItem: React.FC<SideBarItemProps> = ({ to, icon: Icon, label, onClick, showArrow, isOpen }) => (
  <li className="mb-2">
    <Link 
      to={to} 
      className="flex items-center p-2 text-sm rounded bg-transparent hover:bg-button-light dark:hover:bg-button-dark" 
      onClick={onClick}
    >
      <Icon className="mr-3" />
      {label}
      {showArrow && (isOpen ? <FaChevronUp className="ml-auto" /> : <FaChevronDown className="ml-auto" />)}
    </Link>
  </li>
);

export default SideBarItem;