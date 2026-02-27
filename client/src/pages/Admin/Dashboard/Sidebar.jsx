import React, { useEffect } from 'react';

import {
  FiChevronLeft as FiChevronLeftCollapse,
  FiChevronRight as FiChevronRightCollapse,
  FiHome,
  FiUsers,
  FiX,
} from 'react-icons/fi';
import { GiMoneyStack } from 'react-icons/gi';
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2';
import { LuLogOut, LuSettings, LuUser2, LuUsers } from 'react-icons/lu';
import { RiUserSettingsLine } from 'react-icons/ri';
import { TbHotelService } from 'react-icons/tb';

import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import { adminLogout } from '../../../../api/Admin/AuthApi';

const Sidebar = ({
  sidebarOpen,
  sidebarCollapsed,
  activeNav = 'Dashboard',
  toggleSidebar,
  toggleSidebarCollapse,
  handleNavClick,
}) => {
  const { adminAuth } = useAuth();

  const role = adminAuth && adminAuth.data.role;
  const permissions = adminAuth && adminAuth.data.permittedRoutes;

  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    path.includes('profile') && handleNavClick('Profile');
    path.includes('addStaff') && handleNavClick('Add Staff');
    path.includes('createRole') && handleNavClick('Add Role');
    path.includes('customers') && handleNavClick('Customers');
    path.includes('vendors') && handleNavClick('Vendors');
    path.includes('hotels') && handleNavClick('hotels');
    path.includes('payments') && handleNavClick('payments');
    path.includes('manageStaff') && handleNavClick('Manage Staff');
    path.includes('managePermissions') && handleNavClick('Manage Permissions');
    path.includes('bookings') && handleNavClick('bookings');
  }, [path]);

  const logout = async () => {
    try {
      const res = await adminLogout();
      if (res.status === 200) {
        window.location.href = '/admin-login';
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      className={`overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] h-screen bg-white text-gray-800 ${
        sidebarCollapsed ? 'w-16' : 'w-64'
      } space-y-5 pt-20 md:pt-5 py-7 px-2 fixed inset-y-0 left-0 transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between z-30`}
    >
      <div className='relative'>
        <button
          onClick={toggleSidebarCollapse}
          className='block  bg-white top-0 w-full  py-2.5 px-4  transition duration-200 hover:bg-gray-200 hover:text-gray-900 text-center mb-4'
        >
          {sidebarCollapsed ? (
            <FiChevronRightCollapse />
          ) : (
            <FiChevronLeftCollapse />
          )}
        </button>
        <nav className='flex flex-col gap-4'>
          <Link
            to='/admin-dashboard'
            onClick={() => handleNavClick('Dashboard')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : ''
            } ${activeNav === 'Dashboard' ? 'bg-[#F86800] text-white' : ''}`}
          >
            <FiHome
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'Dashboard'}
          </Link>
          <Link
            to='/admin-dashboard/profile'
            onClick={() => handleNavClick('Profile')}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : ''
            } ${activeNav === 'Profile' ? 'bg-[#F86800] text-white' : ''}`}
          >
            <LuUser2
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'Profile'}
          </Link>
          {role.name === 'admin' ? (
            <>
              <Link
                to='/admin-dashboard/addStaff'
                onClick={() => handleNavClick('Add Staff')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${
                  activeNav === 'Add Staff' ? 'bg-[#F86800] text-white' : ''
                }`}
              >
                <LuUsers
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Add Staff'}
              </Link>
              <Link
                to='/admin-dashboard/manageStaff'
                onClick={() => handleNavClick('Manage Staff')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${
                  activeNav === 'Manage Staff' ? 'bg-[#F86800] text-white' : ''
                }`}
              >
                <LuUsers
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Manage Staff'}
              </Link>

              <Link
                to='/admin-dashboard/createRole'
                onClick={() => handleNavClick('Add Role')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${activeNav === 'Add Role' ? 'bg-[#F86800] text-white' : ''}`}
              >
                <RiUserSettingsLine
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Add Role'}
              </Link>
              <Link
                to='/admin-dashboard/managePermissions'
                onClick={() => handleNavClick('Manage Permissions')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${
                  activeNav === 'Manage Permissions'
                    ? 'bg-[#F86800] text-white'
                    : ''
                }`}
              >
                <LuSettings
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Manage Permissions'}
              </Link>
              <Link
                to='/admin-dashboard/customers'
                onClick={() => handleNavClick('Customers')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${
                  activeNav === 'Customers' ? 'bg-[#F86800] text-white' : ''
                }`}
              >
                <FiUsers
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Customers'}
              </Link>
              <Link
                to='/admin-dashboard/Vendors'
                onClick={() => handleNavClick('Vendors')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${activeNav === 'Vendors' ? 'bg-[#F86800] text-white' : ''}`}
              >
                <FiUsers
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Vendors'}
              </Link>
              <Link
                to='/admin-dashboard/hotels'
                onClick={() => handleNavClick('hotels')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${activeNav === 'hotels' ? 'bg-[#F86800] text-white' : ''}`}
              >
                <HiOutlineBuildingOffice2
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Manage Hotels'}
              </Link>
              <Link
                to='/admin-dashboard/payments'
                onClick={() => handleNavClick('payments')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${activeNav === 'payments' ? 'bg-[#F86800] text-white' : ''}`}
              >
                <GiMoneyStack
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Vendor Payments'}
              </Link>
              <Link
                to='/admin-dashboard/bookings'
                onClick={() => handleNavClick('bookings')}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${activeNav === 'bookings' ? 'bg-[#F86800] text-white' : ''}`}
              >
                <TbHotelService
                  className={`inline-block ${
                    sidebarCollapsed ? 'mr-0' : 'mr-2'
                  }`}
                />
                {!sidebarCollapsed && 'Bookings'}
              </Link>
            </>
          ) : (
            role &&
            role?.name === 'adminStaff' &&
            permissions.map((permission, index) => (
              <Link
                key={index}
                to={permission.route}
                onClick={() => handleNavClick(permission.routeName)}
                className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                  sidebarCollapsed ? 'text-center' : ''
                } ${
                  activeNav === permission.routeName
                    ? 'bg-[#F86800] text-white'
                    : ''
                }`}
              >
                {permission.icon === 'FiUsers' ? (
                  <FiUsers
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                ) : permission.icon === 'LaUsers' ? (
                  <LuUsers
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                ) : permission.icon === 'HiOutlineBuildingOffice2' ? (
                  <HiOutlineBuildingOffice2
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                ) : permission.icon === 'GiMoneyStack' ? (
                  <GiMoneyStack
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                ) : permission.icon === 'LuLogOut' ? (
                  <LuLogOut
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                ) : (
                  <LuSettings
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                )}
                {!sidebarCollapsed && permission.routeName}
              </Link>
            ))
          )}

          <button
            onClick={logout}
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
              sidebarCollapsed ? 'text-center' : 'text-left'
            }`}
          >
            <LuLogOut
              className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
            />
            {!sidebarCollapsed && 'Logout'}
          </button>
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
