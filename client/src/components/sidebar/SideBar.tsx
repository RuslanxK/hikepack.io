import React, { useState, useEffect } from 'react';
import { FaHome, FaBook, FaSearch, FaCog, FaHistory, FaBug, FaUserShield, FaSignOutAlt, FaSun, FaMoon } from 'react-icons/fa';
import { GiHiking, GiSchoolBag } from 'react-icons/gi';
import { FaBasketShopping } from "react-icons/fa6";
import SideBarItem from './SideBarItem';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_LATEST_BAGS } from '../../queries/bagQueries';
import { useQuery } from '@apollo/client';
import Spinner from '../loading/Spinner';
import Message from '../message/Message';
import Cookies from 'js-cookie';
import { GET_USER } from '../../queries/userQueries';
import { googleLogout } from '@react-oauth/google';
import { CgMenuLeftAlt, CgClose } from 'react-icons/cg';

interface SideBarItemProps {
  to: string;
  icon: React.ComponentType;
  label: string;
  onClick?: () => void;
}

const SideBar: React.FC = () => {
  const initialTheme = localStorage.getItem('theme') === 'dark';
  const [isDarkTheme, setIsDarkTheme] = useState(initialTheme);
  const [showLatestBags, setShowLatestBags] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


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
    { to: "/shop", icon: FaBasketShopping, label: "Shop hiking gear" },
    { to: "/explore-bags", icon: FaSearch, label: "Explore bags" },
    { to: "/settings", icon: FaCog, label: "Settings" },
    { to: "/changelog", icon: FaHistory, label: "Changelog" },
    { to: "/bug-report", icon: FaBug, label: "Report a Bug" },
    ...(userData?.user?.isAdmin
      ? [{ to: "/admin-settings", icon: FaUserShield, label: "Admin settings" }]
      : [])
  ];

  const handleBagClick = (bagId: string) => {
    navigate(`/bag/${bagId}`);
  };


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
    navigate('/');
  };

  return (
    <>
      <div>
        <button
          className="sm:hidden p-2 absolute right-0 top-2 right-3 text-black dark:text-white"
          onClick={() => setIsSidebarOpen(true)}
        >
          <CgMenuLeftAlt className="text-xl" />
        </button>

        <img
          src={isDarkTheme ? '/images/logo-white.png' : '/images/logo-black.png'}
          width="90px"
          className='sm:hidden p-2 z-30 absolute right-0 top-2 left-3 cursor-pointer'
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
            width="90px"
            className='pb-2 pl-2 pr-2 sm:p-0 cursor-pointer'
            alt="logo"
            onClick={() => navigate('/')}
          />
          <button
            className="sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          >
            <CgClose className="text-xl" />
          </button>
        </div>

        <nav className="flex-grow p-4">
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
                  <ul className="mt-1 mb-2">
                    {loading && (
                      <li className="p-1 pl-2 pr-2 text-sm">
                        <Spinner w={4} h={4} />
                      </li>
                    )}
                    {error && (
                      <Message width='w-full' title="Error occurs" padding="p-2" titleMarginBottom="" message="" type="error" />
                    )}
                    {!data?.latestBags.length && (
                      <Message title="No bags yet." padding="p-2" width="w-full" titleMarginBottom="" message="" type="info" />
                    )}
                    {!loading && !error && data?.latestBags?.map((bag: { id: string, name: string }) => (
                      <li
                        key={bag.id}
                        className="p-2 pl-2 pr-2 flex items-center cursor-pointer dark:hover:bg-button-dark hover:bg-button-light rounded text-sm"
                        onClick={() => {
                          handleBagClick(bag.id);
                          setIsSidebarOpen(false); 
                        }}
                      >
                        <GiSchoolBag style={{ marginRight: "10px" }} />
                        {bag.name && bag.name.length > 18 ? `${bag.name.substring(0, 18)}...` : bag.name}
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </nav>

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
                src={userData.user?.imageUrl ? userData.user.imageUrl : "/images/default.jpg"}
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

        <div className="p-4 border-t border-gray-300 dark:border-gray-600 flex items-center">
          <button className="flex items-center w-full p-2 rounded hover:bg-button-light dark:hover:bg-button-dark text-sm" onClick={handleLogout}>
            <FaSignOutAlt className="mr-3" />
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
