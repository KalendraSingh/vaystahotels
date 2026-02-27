import React, { useEffect, useState } from 'react';
import { IoIosLogOut } from 'react-icons/io';
import {
  FiChevronRight as FiChevronRightCollapse,
  FiChevronLeft as FiChevronLeftCollapse,
  FiUsers,
  FiBarChart2,
  FiX,
  FiMenu,
} from 'react-icons/fi';

import { MdOutlineReviews } from 'react-icons/md';
import { FaBuilding, FaHome } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userLogout } from '../../../../api/Customer/AuthApi';
import { notification } from 'antd';

const Sidebar = ({
  sidebarOpen,
  sidebarCollapsed,
  activeNav = 'Profile',
  toggleSidebar,
  toggleSidebarCollapse,
  handleNavClick,
}) => {
  const navigate = useNavigate();
  const handleUserlogOut = async () => {
    const res = await userLogout();
    if (res.status === 200) {
      navigate('/');
      window.location.reload();
      notification.success({
        message: 'User logout successfully!',
      });
    }
  };

  const location = useLocation();
  const path = location.pathname;
  useEffect(() => {
    path.includes('customer-profile') && handleNavClick('Profile');
    path.includes('my-booking') && handleNavClick('ManageProperty');
    path.includes('rating-review') && handleNavClick('RatingReview');
  }, [path]);

  return (
    <div
      className={`bg-slate-700 text-white ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } space-y-5 pt-20 md:pt-5 py-7 px-2 fixed inset-y-0 left-0 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between z-30`}
    >
      <div>
        <nav className='flex flex-col gap-4'>
          <button
            onClick={toggleSidebarCollapse}
            className='block w-max py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 text-center mb-4'
          >
            {sidebarCollapsed ? <FiMenu /> : <FiMenu />}
          </button>
          <Link
            to='/'
            onClick={() => handleNavClick('Profile')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : ''
            } ${activeNav === '' ? 'bg-gradient-to-r from-[#FFD700] to-[#E5C100] text-white' : ''}`}
          >
            <FaHome
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'Home'}
          </Link>
          <Link
            to='/customer-profile'
            onClick={() => handleNavClick('Profile')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : ''
            } ${activeNav === 'Profile' ? 'bg-[#FFD700] text-white' : ''}`}
          >

            {/* bg-gradient-to-r from-[#FFD700] to-[#E5C100] hover:shadow-lg hover:brightness-110 transition-all duration-200 */}
            <FiUsers
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'Profile Setting'}
          </Link>

          <Link
            to={'/my-booking'}
            onClick={() => handleNavClick('ManageProperty')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : ''
            } ${
              activeNav === 'ManageProperty' ? 'bg-[#FFD700] text-white' : ''
            }`}
          >
            <FiBarChart2
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'My Booking'}
          </Link>

          {/* <a
            href='#'
            onClick={() => handleNavClick('RatingReview')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : ''
            } ${
              activeNav === 'RatingReview' ? 'bg-[#F86800] text-white' : ''
            }`}>
            <MdOutlineReviews
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'Rating & Review'}
          </a> */}
          <div
            className={`absolute bottom-12  mb-6 py-2.5 pr-10 ${
              sidebarCollapsed ? '' : 'w-[260px]'
            } `}
          >
            <Link
              onClick={handleUserlogOut}
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                sidebarCollapsed ? 'text-center' : ''
              } ${activeNav === 'Promotions' ? 'bg-[#FFD700] text-white' : ''}`}
            >
              <IoIosLogOut
                className={`inline-block  ${
                  sidebarCollapsed ? 'mr-0 ' : 'mr-2'
                }`}
              />
              {!sidebarCollapsed && 'Logout'}
            </Link>
          </div>
        </nav>
      </div>
      {sidebarOpen && (
        <button
          onClick={toggleSidebar}
          className='md:hidden absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200'
        >
          <FiX className='h-6 w-6' />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
