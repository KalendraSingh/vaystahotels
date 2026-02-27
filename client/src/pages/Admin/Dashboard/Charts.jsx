import React from 'react';
import RevenueOverview from './RevenueOverview';
import BookedRoom from './BookedRoom';
import CheckInCheckOutCard from './CheckInCheckOutCard';

const Charts = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8'>
      <div className='md:col-span-2'>
        <RevenueOverview />
      </div>
      <div>
        <BookedRoom />
      </div>
      <div>
        <CheckInCheckOutCard />
      </div>
    </div>
  );
};

export default Charts;
