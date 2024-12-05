import React, { useState, useEffect } from 'react';
import { FaHome, FaBook, FaSearch, FaCog, FaHistory, FaExclamationTriangle, FaUserShield, FaSignOutAlt, FaSun, FaMoon  } from 'react-icons/fa';
import { PiEmptyBold } from "react-icons/pi";
import { GiHiking, GiSchoolBag } from 'react-icons/gi';
import SideBarItem from './SideBarItem';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_LATEST_BAGS } from '../../queries/bagQueries';
import { useQuery } from '@apollo/client';
import Spinner from '../loading/Spinner';
import Message from '../message/Message';
import Cookies from 'js-cookie';
import { GET_USER } from '../../queries/userQueries';
import { googleLogout } from '@react-oauth/google';
import { CgMenuLeftAlt } from 'react-icons/cg';
import { MdCancel } from "react-icons/md";
import SupportUsModal from '../popups/SupportUsModel';


interface SideBarItemProps {
  to: string;
  icon: React.ComponentType;
  label: string;
  onClick?: () => void;
  
}

const SideBar: React.FC = () => {

  const recentBagsRef = React.useRef<HTMLDivElement | null>(null);
  const dropdownRef = React.useRef<HTMLUListElement | null>(null);
  
  const initialTheme = localStorage.getItem('theme') === 'dark';
  const [isDarkTheme, setIsDarkTheme] = useState(initialTheme);
  const [showLatestBags, setShowLatestBags] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);


  const navigate = useNavigate();
  const params = useParams();

  const { data, loading, error, refetch } = useQuery(GET_LATEST_BAGS);
  const { loading: loadingUser, error: errorUser, data: userData } = useQuery(GET_USER);

  useEffect(() => {
    refetch();
  }, [params, refetch]);

  const items: SideBarItemProps[] = [
    { to: "/", icon: FaHome, label: "Home" },
    { to: "#", icon: GiHiking, label: "Recent bags", onClick: () => setShowLatestBags(!showLatestBags) },
    { to: "/articles", icon: FaBook, label: "Articles" },
    { to: "/community-bags", icon: FaSearch, label: "Community Bags" },
    { to: "/settings", icon: FaCog, label: "Settings" },
    { to: "/changelog", icon: FaHistory, label: "Changelog" },
    { to: "/bug-report", icon: FaExclamationTriangle, label: "Report a Bug" },
    ...(userData?.user?.isAdmin
      ? [{ to: "/admin-settings", icon: FaUserShield, label: "Admin settings" }]
      : [])
  ];

  const handleBagClick = (bagId: string) => {
    navigate(`/bag/${bagId}`);
    setShowLatestBags(false)
  };


  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = dropdownRef.current;
      const toggleButton = recentBagsRef.current;
  
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        toggleButton &&
        !toggleButton.contains(event.target as Node)
      ) {
        setShowLatestBags(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkTheme);
  }, [isDarkTheme]);


  

  const handleLogout = () => {
    if (userData?.user?.googleId) {
      googleLogout();
    }
    setIsDarkTheme(false);
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
    Cookies.remove('token');
     window.location.href = '/login'
  };

  return (
    <>
      <div className="flex flex-row-reverse w-full bg-white dark:bg-box justify-between absolute p-4 sm:hidden">
        <button
          className="text-black dark:text-white bg-white dark:bg-box rounded"
          onClick={() => setIsSidebarOpen(true)}>
          <CgMenuLeftAlt className="dark:text-white text-xl" />
        </button>

        <img
          src={isDarkTheme ? '/images/logo-white.png' : '/images/logo-black.png'}
          width={75}
          className='cursor-pointer'
          alt="logo"
          onClick={() => navigate('/')}
        />
      </div>

      <div
        className={`fixed top-0 left-0 h-full transition-transform transform flex flex-col space-between ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full sm:w-56 sm:translate-x-0 z-50 ${isDarkTheme ? 'bg-theme-dark text-white' : 'bg-theme-white text-gray-900'}`}
      >
        <div className="flex sm:flex-col justify-between items-center p-4">
          <img
            src={isDarkTheme ? '/images/logo-white.png' : '/images/logo-black.png'}
            width={90}
            className="pb-2 pl-2 pr-2 sm:p-0 cursor-pointer sm:w-24"
            alt="logo"
            onClick={() => navigate('/')}
          />
          <button
            className="sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <MdCancel size={20} className="text-black dark:text-white dark:hover:text-gray-300 hover:text-accent" />
          </button>
        </div>

        <nav className="flex-grow p-4" ref={recentBagsRef}>
          <ul>
            {items.map(item => (
              <React.Fragment key={item.to}>
                <SideBarItem
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  onClick={item.onClick}
                  showArrow={item.label === "Recent bags"}
                  isOpen={showLatestBags}
                  setIsSidebarOpen={setIsSidebarOpen} 
                />
                {item.label === "Recent bags" && showLatestBags && (
                  <ul className="shadow-airbnb rounded-lg absolute sm:left-4 left-0 p-3 z-50 bg-white dark:bg-theme-bgDark w-full sm:w-48" ref={dropdownRef}>
                    {loading && (
                      <li className="p-1 pl-2 pr-2 text-sm">
                        <Spinner w={4} h={4} />
                      </li>
                    )}
                    
                   {error && (
    <span className="text-sm flex items-center p-2 bg-gray-100 rounded dark:bg-black">
      <PiEmptyBold className="mr-2" size={18}/>
      Error occurs.
    </span>
  )}
  {!data?.latestBags.length && (
    <span className="text-sm flex items-center p-2 bg-gray-100 rounded dark:bg-black">
      <PiEmptyBold className="mr-2" size={18}/>
      No bags yet.
    </span>
  )}
                    {!loading && !error && data?.latestBags?.map((bag: { id: string, name: string }) => (
                      <li
                        key={bag.id}
                         className="p-2 pl-2 pr-2 flex items-center cursor-pointer dark:hover:bg-button hover:bg-button hover:text-white rounded-lg text-sm group"
                        onClick={() => {
                          handleBagClick(bag.id);
                          setIsSidebarOpen(false); 
                        }}
                      >
                        <GiSchoolBag className="mr-2 text-black dark:text-white group-hover:text-white" style={{ marginRight: "10px" }} />
                        <span className='text-black group-hover:text-white dark:text-white'>{bag.name && bag.name.length > 15 ? `${bag.name.substring(0, 15)}...` : bag.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>

     <div className='bg-gray-100 dark:bg-box w-full p-5 rounded-lg flex flex-col items-center justify-center'>
     <button className="flex flex-row justify-center w-full pt-2.5 pb-2.5 pl-4 pr-4 rounded-lg bg-primary text-white hover:bg-button-hover" onClick={() => setIsModalOpen(true)}>
      <img src="/images/coffee-cup.png" width={20} height={20} alt="coffee" />
      <p className="text-sm ml-1.5">Support us</p>
     </button>
     </div>
    </nav>


     <SupportUsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

        <div className="p-4 flex items-center">
          {loadingUser ? (
            <div role="status" className="flex items-center animate-pulse">
              <div className="flex-shrink-0">
                <span className="flex justify-center items-center bg-gray-300 rounded-full w-9 h-9"></span>
              </div>
              <div className="ml-4 mt-2 w-full">
                <p className="h-3 bg-gray-300 rounded-full w-[90px] mb-2.5"></p>
                <p className="h-2 bg-gray-300 rounded-full w-[60px]"></p>
              </div>
            </div>
          ) : errorUser ? (
            <Message width="w-full" title="" padding="p-2" titleMarginBottom="" message="Error occurs" type="error" />
          ) : userData ? (
            <div className="flex items-center">
              <img
                src={userData?.user?.imageUrl || "/images/default.jpg"}
                alt="Profile"
                className="w-9 h-9 rounded-full mr-3 object-cover"
              />
              <div>
                <p className="text-sm font-bold">
                  {userData.user?.username?.length > 30
                    ? `${userData.user.username.substring(0, 30)}...`
                    : userData.user?.username}
                </p>
                <p className="text-sm text-gray-400">{userData.user?.isAdmin ? "Admin" : "Hiker"}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-accent flex items-center">
          <button className="text-black dark:text-white flex items-center w-full p-2 rounded-lg hover:bg-button-light dark:hover:bg-button-dark text-sm" onClick={handleLogout}>
            <FaSignOutAlt className="mr-3 text-black dark:text-white" />
            Logout
          </button>
          <div className="flex items-center justify-center p-4">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only"
                checked={isDarkTheme}
                onChange={toggleTheme}
              />
              <div className="w-16 h-8 bg-button-light rounded-full dark:bg-button-dark flex items-center relative">
                <div className={`dot absolute top-1 bg-white w-6 h-6 rounded-full transition-transform duration-300 ${isDarkTheme ? 'translate-x-8' : 'translate-x-1'}`}></div>
                <FaSun className={`text-yellow-500 absolute left-2 ${isDarkTheme ? 'opacity-50' : 'opacity-100'} text-m`} />
                <FaMoon className={`text-gray-800 absolute right-3 ${isDarkTheme ? 'opacity-100' : 'opacity-50'} text-m`} />
              </div>
            </label>
          </div>
        </div>
      </div>

  
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 sm:hidden"
          onClick={() => setIsSidebarOpen(false)} 
        />
      )}
    </>
  );
};

export default SideBar;
