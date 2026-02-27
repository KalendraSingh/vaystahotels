import React from 'react';
import Calendar from './Calendar';

const CalendarNewBooking = () => {
  const bookings = [
    {
      id: 1,
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/0e8c00609cc37b138c09a53280ff71671f0da4013111069cb7f0d533a05acddf?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      title: 'Superior room - 1 double bed or 2 twin beds',
      date: '2 Sep, Mon ,12PM to 03 Sep, Tue 11AM, 1 Guest',
      location: 'Mardan Palace, Turkey',
    },
    {
      id: 2,
      image:
        'https://cdn.builder.io/api/v1/image/assets/TEMP/0e8c00609cc37b138c09a53280ff71671f0da4013111069cb7f0d533a05acddf?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      title: 'Superior room - 1 double bed or 2 twin beds',
      date: '2 Sep, Mon ,12PM to 03 Sep, Tue 11AM, 1 Guest',
      location: 'Mardan Palace, Turkey',
    },
    // Add more bookings as needed
  ];

  return (
    <div className='max-w-3xl mx-auto p-6 bg-white rounded-lg'>
      <div className='mb-6'>
        <Calendar />
      </div>

      <h3 className='text-lg font-semibold text-neutral-800'>Newest Booking</h3>

      {bookings.map((booking) => (
        <div
          key={booking.id}
          className='flex items-start gap-4 mt-4 border-t border-gray-200 pt-4'
        >
          <img
            loading='lazy'
            src={booking.image}
            className='w-28 h-20 object-cover rounded-lg'
            alt={booking.title}
          />
          <div className='flex flex-col'>
            <div className='font-medium text-sm text-gray-800'>
              {booking.title}
            </div>
            <div className='mt-1 text-xs text-gray-600'>{booking.date}</div>
            <div className='mt-2 flex items-center text-orange-600 text-xs'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/9b03ed8fbdcc092088057fdd5e368271434805f1337b08fcb07e971f27e64402?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                className='w-4 h-4 mr-1'
                alt='Location icon'
              />
              <div>{booking.location}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CalendarNewBooking;
