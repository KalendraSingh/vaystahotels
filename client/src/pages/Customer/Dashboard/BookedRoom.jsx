import React, { useState, useEffect } from 'react';
import { Flex, Progress } from 'antd';

const BookedRoom = () => {
  const [availableRooms, setAvailableRooms] = useState(720);
  const [bookedRooms, setBookedRooms] = useState(100);
  const [pendingRooms, setPendingRooms] = useState(0);
  const [confirmedBookings, setConfirmedBookings] = useState(150);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await fetch('/api/room-data');
        const data = await response.json();
        setAvailableRooms(data.availableRooms);
        setBookedRooms(data.bookedRooms);
        setPendingRooms(data.pendingRooms);
        setConfirmedBookings(data.confirmedBookings);
      } catch (error) {
        console.error('Error fetching room data:', error);
      }
    };

    fetchRoomData();
  }, []);

  const bookedPercentage = (bookedRooms / 300) * 100;
  const confirmedPercentage = (confirmedBookings / 300) * 100;

  return (
    <div className='flex flex-col rounded-none'>
      <div className='flex flex-col px-4 py-8 w-full bg-white rounded-lg fill-white'>
        <div className='flex gap-5 justify-between'>
          <div className='flex flex-col items-start'>
            <div className='flex flex-col justify-center items-center ml-20 text-center'>
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
                  percent={80}
                />
              </div>
            </div>
          </div>
        </div>
        <div className='mt-9 text-sm font-medium text-neutral-800'>
          Booked Room Today
        </div>
        <div className='flex gap-10 justify-between mt-5 text-sm'>
          <div className='text-gray-400'>Confirmed Booking</div>
          <div className='font-medium text-right text-neutral-800'>
            {confirmedBookings}/300
          </div>
        </div>
        <div className='flex flex-col items-start mt-1 max-w-full rounded bg-stone-50 w-full md:w-[319px]'>
          <div
            className='flex shrink-0 bg-sky-500 rounded h-[5px]'
            style={{ width: `${bookedPercentage}%` }}
          />
        </div>
        <div className='flex justify-between justify-between mt-5 text-sm'>
          <div className='text-gray-400'>Confirmed Booking</div>
          <div className='font-medium text-right text-neutral-800'>
            {confirmedBookings}/300
          </div>
        </div>
        <div className='flex flex-col items-start mt-1 max-w-full rounded bg-stone-50  w-full md:w-[319px]'>
          <div
            className='flex shrink-0 bg-emerald-500 rounded h-[5px]'
            style={{ width: `${confirmedPercentage}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default BookedRoom;
