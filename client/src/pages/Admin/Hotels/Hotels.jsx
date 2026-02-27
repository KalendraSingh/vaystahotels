import React, { useState } from 'react';
import { MapPin, Tv, Wifi, Shield, ChevronDown } from 'lucide-react';

const hotels = [
  {
    id: 1,
    name: 'The Millennium Hilton',
    location: 'Paradise Island, Bahamas',
    image:
      'https://res.cloudinary.com/sangamjone/image/upload/v1725603432/Img/wirewings/AoneHotel/image_2_modeic.png',
    price: 240,
    status: 'Active',
    amenities: ['Smart TV', 'Free Wifi', '24/7 Security'],
  },
  {
    id: 2,
    name: 'The Leela Palace',
    location: 'Kodihalli, Bangalore',
    image:
      'https://res.cloudinary.com/sangamjone/image/upload/v1725603430/Img/wirewings/AoneHotel/image_3_owa0wx.png',
    price: 180,
    status: 'Active',
    amenities: ['Smart TV', 'Free Wifi', '24/7 Security'],
  },
  {
    id: 3,
    name: 'Golden Palms Avenue',
    location: 'Tumkur Main Rd, Bangalore',
    image:
      'https://res.cloudinary.com/sangamjone/image/upload/v1727418665/Img/wirewings/AoneHotel/6d0f389b2249bfef5b1a06c90b5a8e16_1000x1000_c9krxo.jpg',
    price: 240,
    status: 'Inactive',
    amenities: ['Smart TV', 'Free Wifi', '24/7 Security'],
  },
];

const Select = ({ placeholder, options, onChange }) => (
  <div className='relative'>
    <select
      onChange={onChange}
      className='appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 w-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500'
    >
      <option value=''>{placeholder}</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <ChevronDown className='absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
  </div>
);

const Button = ({ children, className }) => (
  <button className={`px-4 py-2 rounded-md ${className}`}>{children}</button>
);

const Card = ({ children }) => (
  <div className='bg-white rounded-lg overflow-hidden shadow-md'>
    {children}
  </div>
);

const HotelDashboard = () => {
  const [priceFilter, setPriceFilter] = useState('');
  const [hotelFilter, setHotelFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');

  return (
    <div className='container mx-auto p-4 bg-gray-100 min-h-screen'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold'>Hotel Management</h1>
        <div className='text-sm text-gray-500'>Dashboard {'>'} Hotels</div>
      </div>
      <div className='flex justify-end gap-2 mb-6'>
        <Select
          placeholder='Price'
          options={[
            { value: '100', label: 'Under $100' },
            { value: '200', label: 'Under $200' },
            { value: '300', label: 'Under $300' },
          ]}
          onChange={(e) => setPriceFilter(e.target.value)}
        />
        <Select
          placeholder='Hotels'
          options={hotels.map((hotel) => ({
            value: hotel.name,
            label: hotel.name,
          }))}
          onChange={(e) => setHotelFilter(e.target.value)}
        />
        <Select
          placeholder='Top rated'
          options={[
            { value: '5', label: '5 Stars' },
            { value: '4', label: '4 Stars' },
            { value: '3', label: '3 Stars' },
          ]}
          onChange={(e) => setRatingFilter(e.target.value)}
        />
        <Button className='bg-orange-500 hover:bg-orange-600 text-white'>
          + Add new Property
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {hotels.map((hotel) => (
          <Card key={hotel.id}>
            <div className='relative'>
              <img
                src={hotel.image}
                alt={hotel.name}
                className='w-full h-48 object-cover'
              />
              <span
                className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  hotel.status === 'Active'
                    ? 'bg-green-500 text-white'
                    : 'bg-yellow-500 text-white'
                }`}
              >
                {hotel.status}
              </span>
              <span className='absolute bottom-2 right-2 bg-gray-900 text-white px-2 py-1 text-xs rounded-full'>
                42 Photos
              </span>
            </div>
            <div className='p-4'>
              <h2 className='text-xl font-semibold mb-2'>{hotel.name}</h2>
              <p className='text-gray-600 mb-2 flex items-center text-sm'>
                <MapPin className='w-4 h-4 mr-1' /> {hotel.location}
              </p>
              <div className='flex space-x-4 mb-2'>
                <div className='flex items-center'>
                  <Tv className='w-4 h-4 mr-1 text-gray-500' />
                  <span className='text-xs'>Smart TV</span>
                </div>
                <div className='flex items-center'>
                  <Wifi className='w-4 h-4 mr-1 text-gray-500' />
                  <span className='text-xs'>Free Wifi</span>
                </div>
                <div className='flex items-center'>
                  <Shield className='w-4 h-4 mr-1 text-gray-500' />
                  <span className='text-xs'>24/7 Security</span>
                </div>
              </div>
              <p className='text-xs text-blue-600'>+ All other amenities</p>
            </div>
            <div className='bg-gray-50 p-4 flex justify-between items-center'>
              <div>
                <p className='text-xs text-gray-600'>Starting from</p>
                <p className='text-lg font-semibold'>${hotel.price}/night</p>
              </div>
              <Button className='border border-orange-500 text-orange-500 hover:bg-orange-50'>
                Edit Details
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HotelDashboard;
