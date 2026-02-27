import React from 'react';
import BookingList from './BookingLIst';

const bookingsData = [
  {
    id: 1,
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/7758cb108720edadc9e42f5da0910d83bd9fb24cf3e3b997833f5dd58384105c?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    roomType: 'Superior room - 1 double bed or 2 twin beds',
    locationIcon:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/51a8a427b7ea716667b0f78383c7c66efac57247add1455e96cf73f5b2370144?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    location: 'Mardan Palace, Turkey',
    checkIn: '02 Sep, Mon, 12:00 PM',
    checkOut: '03 Sep, Tue, 11:00AM',
    guests: '1 Guest, 1 Room',
    totalPayable: '₹1,867',
  },
  {
    id: 2,
    imageUrl:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/aaa6ddf61b1f3afaec75ced318e281bf0625daa276f511bc3982253b7bc45771?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    roomType: 'Superior room - 1 double bed or 2 twin beds',
    locationIcon:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/b606c0a65548dab0ee1cc8f530f81b54d807921351f14ad68ffbf60b4fd8740a?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    location: 'Mardan Palace, Turkey',
    checkIn: '02 Sep, Mon, 12:00 PM',
    checkOut: '03 Sep, Tue, 11:00AM',
    guests: '1 Guest, 1 Room',
    totalPayable: '₹1,867',
  },
];

const BookingsPage = () => {
  return (
    <div className='container mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>My Bookings</h1>
      <BookingList bookings={bookingsData} />
    </div>
  );
};

export default BookingsPage;
