import React from 'react';
import DashboardStats from './DashboardStats';
import RecentlyVisited from './RecentlyVisited';
import FavoritePlaces from './FavoritePlaces';
import PersonalDetails from './PersonalDetail';
import CurrentBooking from './CurrentBooking';

const MainContent = () => {
  return (
    <main className='flex-1'>
      <div className=' py-4'>
        <DashboardStats />
        <div className='grid gap-3 grid-cols-1 md:grid-cols-3'>
          <div className='md:col-span-2'>
            <RecentlyVisited />
            <CurrentBooking />
          </div>
          <div className=''>
            <PersonalDetails />
          </div>
        </div>
        {/* <FavoritePlaces /> */}
      </div>
    </main>
  );
};

export default MainContent;
