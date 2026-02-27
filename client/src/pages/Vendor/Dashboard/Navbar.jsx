import React from 'react';
import { FiMenu, FiBell, FiUser } from 'react-icons/fi';
import { useAuth } from '../../../Hooks/useAuth';
import { IoExitOutline } from 'react-icons/io5';
import useVendorLogout from '../../../components/common/Logout/useVendorLogout';

const Navbar = ({ toggleSidebar }) => {
  const { vendorAuth } = useAuth();

  const vendorDetails = vendorAuth && vendorAuth.data;

  return (
    <header className='bg-white shadow-md z-10'>
      <div className='flex items-center justify-between p-4'>
        <div className='flex items-center'>
          <button
            onClick={toggleSidebar}
            className='md:hidden p-2 rounded-md hover:bg-gray-100 mr-4'
          >
            <FiMenu className='h-6 w-6' />
          </button>
          <h1 className='text-2xl font-semibold text-gray-800 hidden md:block'>
            Vendor Dashboard 👋
          </h1>
        </div>
        <div className='flex items-center space-x-4'>
          <button className='flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100'>
            <FiUser className='h-6 w-6 text-gray-600' />
            <span className='text-sm font-medium text-gray-700'>
              {vendorDetails.name}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
