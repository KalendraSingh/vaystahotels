import React from 'react';

import CalendarNewBooking from './CalendarNewBooking';
import RatingCard from './RatingCard';

const CalendarRatingCard = () => {
  return (
    <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8'>
      <div>
        <CalendarNewBooking />
      </div>
      <div className='flex flex-col gap-5'>
        <div>
          <h2 className='text-xl font-sm'>Latest Customer Review</h2>
        </div>
        <RatingCard />
        <RatingCard />
        <RatingCard />
      </div>
    </div>
  );
};

export default CalendarRatingCard;
