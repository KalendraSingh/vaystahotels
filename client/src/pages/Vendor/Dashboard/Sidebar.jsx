import React, { useEffect, useState } from 'react';
import {
  FiChevronRight as FiChevronRightCollapse,
  FiChevronLeft as FiChevronLeftCollapse,
  FiHome,
  FiUsers,
  FiBarChart2,
  FiX,
} from 'react-icons/fi';
import { RiHotelLine } from 'react-icons/ri';
import { CiBank } from 'react-icons/ci';
import { GrTransaction } from 'react-icons/gr';
import { TbHotelService } from 'react-icons/tb';
import { FaUserPlus } from 'react-icons/fa6';
import { FaChalkboardUser } from 'react-icons/fa6';

import { FaBuilding, FaUsersCog } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../../Hooks/useAuth';
import { IoExitOutline } from 'react-icons/io5';
import useVendorLogout from '../../../components/common/Logout/useVendorLogout';

const Sidebar = ({
  sidebarOpen,
  sidebarCollapsed,
  activeNav = 'Dashboard',
  toggleSidebar,
  toggleSidebarCollapse,
  handleNavClick,
}) => {
  const items = [
    {
      key: 'sub1',
      label: 'Add New',
      icon: <FaBuilding />,
      children: [
        {
          key: 'g1',
          type: 'group',
          children: [
            {
              key: '1',
              label: (
                <Link to={'/vendor-dashboard/addHotel'}>
                  --Basic Information
                </Link>
              ),
            },
            {
              key: '2',
              label: (
                <Link to={'/vendor-dashboard/images'}>--Add Hotel Images</Link>
              ),
            },
            {
              key: '3',
              label: <Link to={'/vendor-dashboard/addRoom'}> --Add Room</Link>,
            },
            {
              key: '4',
              label: <Link to={'/vendor-dashboard/policy'}> --Policies</Link>,
            },
          ],
        },
      ],
    },
  ];

  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (sidebarCollapsed) {
      toggleSidebarCollapse();
    }
  };

  const { vendorAuth } = useAuth();

  const vendor = vendorAuth.data && vendorAuth.data;

  const locaton = useLocation();
  const pathname = locaton.pathname;

  useEffect(() => {
    pathname.includes('profile') && handleNavClick('Profile');
    pathname.includes('addHotel') && handleNavClick('addHotel');
    pathname.includes('addRoom') && handleNavClick('addRoom');
    pathname.includes('policy') && handleNavClick('policy');
    pathname.includes('manage-hotels') && handleNavClick('ManageProperty');
    pathname.includes('kycform') && handleNavClick('BankKyc');
    pathname.includes('transactions') && handleNavClick('Transactions');
    pathname.includes('bookings') && handleNavClick('Bookings');
    pathname.includes('manage-permission') &&
      handleNavClick('ManagePermission');
  }, [pathname]);
  const logout = useVendorLogout();

  const vendorLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div
        className={`bg-[#27005d]  overflow-y-auto h-screen [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] text-gray-800 ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } space-y-5 pt-20 md:pt-5 py-7 px-2 fixed inset-y-0 left-0 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out flex flex-col justify-between z-30 
      `}
      >
        <div className='relative'>
          <button
            onClick={() => {
              toggleSidebarCollapse();
              setIsOpen(false);
            }}
            className='block w-full  text-white  py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 text-center mb-4'
          >
            {sidebarCollapsed ? (
              <FiChevronRightCollapse />
            ) : (
              <FiChevronLeftCollapse />
            )}
          </button>
          <nav className='flex flex-col gap-4'>
            <Link
              to='/vendor-dashboard'
              onClick={() => handleNavClick('Dashboard')}
              className={`block py-2.5 px-4 rounded  transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                sidebarCollapsed ? 'text-center' : ''
              } ${
                activeNav === 'Dashboard'
                  ? 'bg-gray-200 text-gray-900 '
                  : 'text-white'
              }`}
            >
              <FiHome
                className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
              />
              {!sidebarCollapsed && 'Dashboard'}
            </Link>
            <Link
              to='/vendor-dashboard/profile'
              onClick={() => handleNavClick('Profile')}
              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                sidebarCollapsed ? 'text-center' : ''
              } ${
                activeNav === 'Profile'
                  ? 'bg-gray-200 text-gray-900 '
                  : 'text-white '
              }`}
            >
              <FiUsers
                className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
              />
              {!sidebarCollapsed && 'Profile Setting'}
            </Link>

            {vendor.role === 'vendor' ? (
              <>
                {/* <Menu
                // defaultSelectedKeys={['1']}
                // defaultOpenKeys={['sub1']}
                mode='inline'
                items={items}
              />
               */}

                <div className='block rounded transition duration-200'>
                  <ul className='space-y-2'>
                    <li>
                      <button
                        onClick={toggleDropdown}
                        className={`flex justify-between text-white rounded items-center w-full px-4 py-2.5 hover:bg-gray-200 hover:text-gray-900 
                        ${pathname.includes}
                      `}
                      >
                        <div className='flex items-center gap-2'>
                          <FaBuilding />
                          {sidebarCollapsed ? null : <span>Add New</span>}
                        </div>
                        <div>
                          {sidebarCollapsed ? null : (
                            <svg
                              className={`w-5 h-5 transform ${
                                isOpen ? 'rotate-180' : 'rotate-0'
                              }`}
                              fill='none'
                              stroke='currentColor'
                              viewBox='0 0 24 24'
                              xmlns='http://www.w3.org/2000/svg'
                            >
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth='2'
                                d='M19 9l-7 7-7-7'
                              />
                            </svg>
                          )}
                        </div>
                      </button>

                      {/* Child items (dropdown) */}
                      {isOpen && (
                        <ul className='space-y-1 ml-6 mt-1'>
                          {items[0].children[0].children.map((item, index) => (
                            // <li key={index}>{item.label}</li>
                            <Link
                              key={index}
                              to={item.label.props.to}
                              onClick={() => {
                                handleNavClick(
                                  item.label.props.to.split('/').pop()
                                );
                              }}
                              className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                                sidebarCollapsed ? 'text-center' : ''
                              } ${
                                activeNav ===
                                item.label.props.to.split('/').pop()
                                  ? 'bg-gray-200 text-gray-900 '
                                  : 'text-white'
                              }`}
                            >
                              {!sidebarCollapsed && item.label.props.children}
                            </Link>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                </div>
                <Link
                  to={'/vendor-dashboard/manage-hotels'}
                  onClick={() => handleNavClick('ManageProperty')}
                  className={`block py-2.5 px-4  rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'ManageProperty'
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <RiHotelLine
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Manage Property'}
                </Link>
                <Link
                  to={'/vendor-dashboard/kycform'}
                  onClick={() => handleNavClick('BankKyc')}
                  className={`block py-2.5 px-4 roundedtransition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'BankKyc'
                      ? 'bg-gray-200 text-gray-900'
                      : ' text-white '
                  }`}
                >
                  <CiBank
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Bank KYC'}
                </Link>
                <Link
                  to={'/vendor-dashboard/transactions'}
                  onClick={() => handleNavClick('Transactions')}
                  className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'Transactions'
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <GrTransaction
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Transactions'}
                </Link>
                <Link
                  to={'/vendor-dashboard/bookings'}
                  onClick={() => handleNavClick('Bookings')}
                  className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'Bookings'
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <TbHotelService
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Bookings'}
                </Link>
                <Link
                  to={'/vendor-dashboard/add-staff'}
                  onClick={() => handleNavClick('AddStaff')}
                  className={`block py-2.5 px-4 rounded  transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'AddStaff'
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <FaUserPlus
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Add Staff'}
                </Link>
                <Link
                  to={'/vendor-dashboard/manage-staff'}
                  onClick={() => handleNavClick('ManageStaff')}
                  className={`block py-2.5 px-4 rounded  transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'ManageStaff'
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <FaUsersCog
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Manage Staff'}
                </Link>
                <Link
                  to={'/vendor-dashboard/manage-permission'}
                  onClick={() => handleNavClick('ManagePermission')}
                  className={`block py-2.5 px-4 rounded  transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === 'ManagePermission'
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <FaChalkboardUser
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && 'Manage Permission'}
                </Link>
              </>
            ) : vendor.role === 'vendorStaff' &&
              vendor.permittedRoutes &&
              vendor.permittedRoutes.length > 0 ? (
              vendor.permittedRoutes.map((route, index) => (
                <Link
                  key={index}
                  to={`/vendor-dashboard${route.route}`}
                  onClick={() => handleNavClick(route.routeName)}
                  className={`block py-2.5 px-4 rounded  transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                    sidebarCollapsed ? 'text-center' : ''
                  } ${
                    activeNav === route.routeName
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-white'
                  }`}
                >
                  <FiBarChart2
                    className={`inline-block ${
                      sidebarCollapsed ? 'mr-0' : 'mr-2'
                    }`}
                  />
                  {!sidebarCollapsed && route.routeName}
                </Link>
              ))
            ) : null}

            {vendor.role === 'vendorStaff' &&
            vendor.permittedRoutes &&
            vendor.permittedRoutes.length > 0
              ? vendor.permittedRoutes.map(
                  (route, index) =>
                    route.routeName === 'Manage Property' && (
                      <div
                        key={index}
                        className='block rounded transition duration-200'
                      >
                        <ul className='space-y-2'>
                          <li>
                            <button
                              onClick={toggleDropdown}
                              className={`flex justify-between rounded items-center w-full px-4 py-2.5 hover:bg-gray-200 hover:text-gray-900 
                            ${pathname.includes}
                          `}
                            >
                              <div className='flex items-center gap-2'>
                                <FaBuilding />
                                {sidebarCollapsed ? null : <span>Add New</span>}
                              </div>
                              <div>
                                {sidebarCollapsed ? null : (
                                  <svg
                                    className={`w-5 h-5 transform ${
                                      isOpen ? 'rotate-180' : 'rotate-0'
                                    }`}
                                    fill='none'
                                    stroke='currentColor'
                                    viewBox='0 0 24 24'
                                    xmlns='http://www.w3.org/2000/svg'
                                  >
                                    <path
                                      strokeLinecap='round'
                                      strokeLinejoin='round'
                                      strokeWidth='2'
                                      d='M19 9l-7 7-7-7'
                                    />
                                  </svg>
                                )}
                              </div>
                            </button>
                            {isOpen && (
                              <ul className='space-y-1 ml-6 mt-1'>
                                {items[0].children[0].children.map(
                                  (item, index) => (
                                    // <li key={index}>{item.label}</li>
                                    <Link
                                      key={index}
                                      to={item.label.props.to}
                                      onClick={() => {
                                        handleNavClick(
                                          item.label.props.to.split('/').pop()
                                        );
                                      }}
                                      className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                                        sidebarCollapsed ? 'text-center' : ''
                                      } ${
                                        activeNav ===
                                        item.label.props.to.split('/').pop()
                                          ? 'bg-gray-200 text-gray-900'
                                          : 'text-white'
                                      }`}
                                    >
                                      {!sidebarCollapsed &&
                                        item.label.props.children}
                                    </Link>
                                  )
                                )}
                              </ul>
                            )}
                          </li>
                        </ul>
                      </div>
                    )
                )
              : null}
            <button
              onClick={vendorLogout}
              className={`block py-2.5 text-white px-4 rounded transition duration-200 hover:bg-gray-200 hover:text-gray-900 ${
                sidebarCollapsed ? 'text-center' : 'text-left'
              }`}
            >
              <IoExitOutline
                className={`inline-block ${sidebarCollapsed ? 'mr-0' : 'mr-2'}`}
              />
              {!sidebarCollapsed && 'Logout'}
            </button>
          </nav>
        </div>
        {sidebarOpen && (
          <button
            onClick={toggleSidebar}
            className='md:hidden text-white absolute top-4 right-4 p-2 rounded-md hover:bg-gray-200'
          >
            <FiX className='h-6 w-6' />
          </button>
        )}
      </div>
    </>
  );
};

export default Sidebar;
