import React from 'react';

const BookingCard = ({ booking }) => {
  return (
    <div className='py-3.5 pr-6 pl-3 w-full bg-white rounded-lg max-md:pr-5 max-md:max-w-full'>
      <div className='flex gap-5 max-md:flex-col'>
        <div className='flex flex-col w-[41%] max-md:ml-0 max-md:w-full'>
          <div className='flex grow gap-5 justify-between max-md:mt-10'>
            <div className='flex flex-col min-h-[108px]'>
              <img
                loading='lazy'
                src={booking.imageUrl}
                alt={booking.roomType}
                className='object-contain flex-1 rounded-lg aspect-[1.02] w-[110px]'
              />
            </div>
            <div className='flex flex-col my-auto font-medium'>
              <div className='text-base text-neutral-800'>
                {booking.roomType}
              </div>
              <div className='flex gap-2 self-start mt-6 text-sm text-zinc-700'>
                <img
                  loading='lazy'
                  src={booking.locationIcon}
                  alt='Location'
                  className='object-contain shrink-0 self-start aspect-[0.79] w-[15px]'
                />
                <div className='basis-auto'>{booking.location}</div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex flex-col ml-5 w-[59%] max-md:ml-0 max-md:w-full'>
          <div className='grow max-md:mt-10 max-md:max-w-full'>
            <div className='flex gap-5 max-md:flex-col'>
              <div className='flex flex-col w-[38%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col grow text-sm text-neutral-400 max-md:mt-10'>
                  <div className='self-start leading-6'>Check-In</div>
                  <div className='font-medium text-zinc-700'>
                    {booking.checkIn}
                  </div>
                  <div className='self-start mt-3.5 leading-6'>Check-Out</div>
                  <div className='mt-1 font-medium text-zinc-700 max-md:mr-2.5'>
                    {booking.checkOut}
                  </div>
                </div>
              </div>
              <div className='flex flex-col ml-5 w-[27%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col grow text-sm text-neutral-400 max-md:mt-10'>
                  <div className='self-start leading-6'>Total Guest</div>
                  <div className='font-medium text-zinc-700'>
                    {booking.guests}
                  </div>
                  <div className='mt-3.5 leading-6 max-md:mr-0.5'>
                    Total Payable
                  </div>
                  <div className='self-start mt-1 font-medium text-zinc-700'>
                    {booking.totalPayable}
                  </div>
                </div>
              </div>
              <div className='flex flex-col ml-5 w-[35%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col self-stretch my-auto w-full text-sm leading-none max-md:mt-10'>
                  <button className='gap-2 self-stretch py-2.5 pr-6 pl-6 text-center text-white bg-yellow-400 rounded-md min-h-[38px] max-md:px-5'>
                    View Details
                  </button>
                  <button className='self-center mt-5 text-center text-neutral-800'>
                    Cancel Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
