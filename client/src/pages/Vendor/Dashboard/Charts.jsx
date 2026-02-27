import React from 'react';
import RevenueOverview from './RevenueOverview';
import BookedRoom from './BookedRoom';
import CheckInCheckOutCard from './CheckInCheckOutCard';

const Charts = ({ bookingSummary }) => {
  const {
    allBookings,
    availableRooms,
    bookedRooms,
    checkInsToday,
    checkOutsToday,
    confirmedBookings,
    newBookingsToday,
    totalCheckIns,
    totalCheckOuts,
  } = bookingSummary || {};

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
      <div className='md:col-span-2'>
        <RevenueOverview />
      </div>
      <div>
        <BookedRoom
          bookedRooms={bookedRooms}
          availableRooms={availableRooms}
          newBookingsToday={newBookingsToday}
        />
      </div>
      <div>
        <CheckInCheckOutCard
          checkInsToday={checkInsToday}
          checkOutsToday={checkOutsToday}
        />
      </div>
    </div>
  );
};

export default Charts;
