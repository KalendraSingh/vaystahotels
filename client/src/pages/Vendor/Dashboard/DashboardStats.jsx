import React from 'react';
import { TbLogout } from 'react-icons/tb';
import { TbLogout2 } from 'react-icons/tb';
import { MdBookmarkBorder } from 'react-icons/md';
import { PiShoppingBagOpenBold } from 'react-icons/pi';

const DashboardStats = ({ bookingSummary }) => {
  console.log('bookingSummary', bookingSummary);
  const { bookedRooms, confirmedBookings, totalCheckIns, totalCheckOuts } =
    bookingSummary || {};

  return (
    <>
      <div>
        <h1 className='text-2xl py-2 font-semibold'>Statistics</h1>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <div className='bg-white rounded-lg shadow-md p-6 flex gap-12 items-center'>
          <div>
            <h2 className='text-xl  text-gray-400 mb-4 text-nowrap'>
              New Bookings
            </h2>
            <p className='text-4xl font-bold text-[#00B67A]'>
              {confirmedBookings}
            </p>
          </div>
          <div>
            <MdBookmarkBorder className=' h-12 w-12  text-[#00B67A]' />
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6 flex gap-12 items-center'>
          <div>
            <h2 className='text-xl  mb-4 text-gray-400 text-nowrap'>
              Schedule Rooms
            </h2>
            <p className='text-4xl font-bold text-[#19AFFF]'>{bookedRooms}</p>
          </div>
          <div>
            <PiShoppingBagOpenBold className=' h-12 w-12  text-[#19AFFF]' />
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6 flex gap-12 items-center'>
          <div>
            <h2 className='text-xl text-gray-400 mb-4 text-nowrap'>Check In</h2>
            <p className='text-4xl font-bold text-[#FD6A05]'>{totalCheckIns}</p>
          </div>
          <div>
            <TbLogout2 className='h-12 w-12 text-[#FD6A05]' />
          </div>
        </div>
        <div className='bg-white rounded-lg shadow-md p-6  flex gap-12 items-center'>
          <div>
            <h2 className='text-xl text-gray-400 mb-4 text-nowrap'>
              Check Out
            </h2>
            <p className='text-4xl font-bold text-[#EB5757]'>
              {totalCheckOuts}
            </p>
          </div>
          <div>
            <TbLogout className='h-12 w-12 text-[#EB5757]' />
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardStats;
