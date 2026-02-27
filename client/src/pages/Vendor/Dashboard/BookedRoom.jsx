import React from 'react';
import { Flex, Progress } from 'antd';

const BookedRoom = ({ bookedRooms, availableRooms, newBookingsToday }) => {
  const availableRoomsPercentage =
    (availableRooms / (bookedRooms + availableRooms)) * 100;

  const bookedPercentage =
    (newBookingsToday / (bookedRooms + availableRooms)) * 100;

  const totalRooms = bookedRooms + availableRooms;

  return (
    <div className='flex flex-col rounded-none'>
      <div className='flex flex-col px-4 py-8 w-full bg-white rounded-lg fill-white'>
        <div className='flex gap-5 justify-between'>
          <div className='flex flex-col items-start'>
            <div className='flex flex-col justify-center items-center ml-6 md:ml-12 lg:ml-16 text-center'>
              <div className='mr-12 text-2xl font-semibold leading-none text-sky-500'>
                {availableRooms}
              </div>
              <div className='text-sm text-gray-400 py-2'>
                Available Room Today
              </div>
              <div className='py-4'>
                <Progress
                  strokeColor='#FF5733'
                  strokeWidth={14}
                  type='circle'
                  percent={parseInt(availableRoomsPercentage)}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-9 text-sm font-medium text-neutral-800'>
          Booked Room Today
        </div>
        <div className='flex justify-between justify-between mt-5 text-sm'>
          <div className='text-gray-400'>Confirmed Booking</div>
          <div className='font-medium text-right text-neutral-800'>
            {parseInt(newBookingsToday)}/{totalRooms}
          </div>
        </div>
        <div className='flex flex-col items-start mt-1 max-w-full rounded bg-stone-50  w-full md:w-[319px]'>
          <div
            className='flex shrink-0 bg-emerald-500 rounded h-[5px]'
            style={{ width: `${bookedPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookedRoom;
