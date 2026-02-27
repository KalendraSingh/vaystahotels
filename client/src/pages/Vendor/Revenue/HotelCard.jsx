import React from 'react';

const HotelCard = ({ hotel }) => {
  return (
    <div className='flex flex-col rounded-lg bg-white shadow-md p-5 max-md:px-3'>
      <div className='flex flex-wrap gap-5 justify-between items-center w-full'>
        <div className='flex flex-col min-h-[85px]'>
          <img
            loading='lazy'
            src={hotel.image}
            alt={hotel.name}
            className='object-contain rounded-lg w-[109px] aspect-[1.28]'
          />
        </div>

        <div className='flex flex-col grow'>
          <div className='flex justify-between items-center gap-5'>
            <div className='text-xl font-medium text-neutral-800'>
              {hotel.name}
            </div>
            <div className='text-sm text-gray-400'>Bookings</div>
          </div>

          <div className='flex justify-between mt-2'>
            <div className='flex items-center gap-2 text-xs text-zinc-700'>
              <img src='/icons/location.svg' alt='Location' className='w-3' />
              <span>{hotel.address}</span>
            </div>
            <div className='flex items-center gap-1 text-sm'>
              <span className='font-medium text-neutral-800'>
                {hotel.bookings}
              </span>
              <img
                src='/icons/arrow-up.svg'
                alt='Increase'
                className='w-[5px]'
              />
              <span className='text-xs font-bold text-emerald-500'>
                {hotel.bookingsPercentage}%
              </span>
            </div>
          </div>
        </div>

        <div className='flex-1 h-[31px] border-l border-slate-200 mx-4' />

        <div className='flex flex-col items-center'>
          <span className='text-sm text-gray-400'>Revenue</span>
          <div className='flex items-center gap-1 mt-2'>
            <span className='text-sm font-medium text-neutral-800'>
              {hotel.revenue}
            </span>
            <img src='/icons/arrow-up.svg' alt='Increase' className='w-[5px]' />
            <span className='text-xs font-bold text-emerald-500'>
              {hotel.revenuePercentage}%
            </span>
          </div>
        </div>

        <div className='flex-1 h-[31px] border-l border-slate-200 mx-4' />

        <div className='flex flex-col items-center'>
          <span className='text-sm text-gray-400'>Expense</span>
          <div className='flex items-center gap-1 mt-2'>
            <span className='text-sm font-medium text-neutral-800'>
              {hotel.expense}
            </span>
            <img
              src='/icons/arrow-down.svg'
              alt='Decrease'
              className='w-[5px]'
            />
            <span className='text-xs font-bold text-rose-500'>
              {hotel.expensePercentage}%
            </span>
          </div>
        </div>

        <div className='flex-1 h-[31px] border-l border-slate-200 mx-4' />

        <div className='flex flex-col items-center'>
          <span className='text-sm text-gray-400'>Profit</span>
          <div className='flex items-center gap-1 mt-2'>
            <span className='text-sm font-medium text-neutral-800'>
              {hotel.profit}
            </span>
            <img src='/icons/arrow-up.svg' alt='Increase' className='w-[5px]' />
            <span className='text-xs font-bold text-green-500'>
              {hotel.profitPercentage}%
            </span>
          </div>
        </div>

        <button
          onClick={() => console.log('More details clicked')}
          className='flex items-center gap-2 px-4 py-2 mt-4 text-sm text-white cta rounded-md min-h-[38px]'
        >
          More Details
        </button>
      </div>
    </div>
  );
};

export default HotelCard;
