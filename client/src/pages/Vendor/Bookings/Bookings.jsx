import { useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../../Hooks/useAuth';
import Dataloading from '../../../components/DataLoading/DataLoading';
import NoBookingsFound from '../../../components/BookingNotFound/AdminBookingNotFound';
import { getAllHotelsByVendor } from '../../../../api/Vendor/HotelApi';
import {
  getVendorHotelBookinsByStatus,
  getBookingById,
} from '../../../../api/Vendor/BookingApi';
import { Link } from 'react-router-dom';

const tabs = [
  { name: 'Ongoing Bookings', status: 'ongoing' },
  { name: 'Upcoming Bookings', status: 'upcoming' },
  { name: 'Past Bookings', status: 'past' },
  { name: 'Cancelled Booking', status: 'canceled' },
];

export default function Component() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const status = tabs[activeTab].status;

  const { vendorAuth } = useAuth();

  const vendorId = vendorAuth && vendorAuth.data.id;

  const [hotelsData, setHotelsData] = useState(null);
  const [date, setDate] = useState(null);
  const [hotelId, setHotelId] = useState('');

  const fetchAllHotelsData = async () => {
    try {
      const res = await getAllHotelsByVendor(vendorId);
      if (res.status === 200) {
        setHotelsData(res.data);
        setHotelId(res.data[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllHotelsData();
  }, [vendorId]);

  const handleBookingStatus = async () => {
    setIsLoading(true);
    try {
      const idData = {
        status,
        hotelId,
      };
      const res = await getVendorHotelBookinsByStatus(idData);
      setIsLoading(false);
      if (res.status === 200) {
        setBookingData(res.data);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleBookingStatus();
  }, [status, hotelId]);

  const handleBookingByDate = () => {
    setDate();
  };

  console.log('hotelId', hotelsData);

  return (
    <div className='container mx-auto p-4'>
      <div className='mb-8 flex gap-6 '>
        <label className=' px-4 py-2'>By Hotel:</label>
        <select
          value={hotelId}
          onChange={(event) => setHotelId(event.target.value)}
          className='px-6 py-2'
        >
          {hotelsData &&
            hotelsData.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
        </select>
        <div>
          <input
            type='date'
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className='px-4 py-2'
          />
        </div>
        {/* <div>
          <button onClick={handleBookingByDate} className=' cta px-4 py-2'>
            Apply
          </button>
        </div>
        <div>
          <button className='cta px-4 py-2'>Clear</button>
        </div> */}
      </div>

      <div className='flex mb-4 border-b overflow-x-auto'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 whitespace-nowrap ${
              activeTab === index
                ? 'text-orange-500 border-b-2 border-orange-500 font-medium'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(index)}
          >
            {tab.name}
          </button>
        ))}
      </div>
      <div className='space-y-4'>
        {isLoading ? (
          <Dataloading />
        ) : bookingData && bookingData.length > 0 ? (
          bookingData.map((booking) => {
            const { Hotel, roomDetails } = booking;
            const roomType = roomDetails.flatMap((items) => items.categoryName);
            return (
              <div
                key={booking.id}
                className='bg-white p-4 rounded-lg shadow flex flex-col md:flex-row'
              >
                <div className='w-full md:w-1/4 pr-0 md:pr-4 mb-4 md:mb-0'>
                  <img
                    src={Hotel.bannerImage}
                    alt='Hotel Room'
                    width={150}
                    height={100}
                    className='rounded-lg w-full h-auto'
                  />
                </div>
                <div className='w-full md:w-3/4 flex flex-col justify-between'>
                  <div>
                    <p className='text-gray-600 flex items-center'>
                      <MapPin className='w-4 h-4 mr-1' />
                      {Hotel.name}, {Hotel.city}, {Hotel.state}
                    </p>
                    {roomType &&
                      roomType.map((name, index) => (
                        <h3 key={index} className='text-lg'>
                          {name}
                        </h3>
                      ))}
                    <div className='flex flex-col sm:flex-row justify-between mt-2'>
                      <div className='mb-2 sm:mb-0'>
                        <p className='text-sm text-gray-500'>Check-In</p>
                        <p className='text-sm font-medium flex items-center'>
                          <Calendar className='w-4 h-4 mr-1' />
                          {booking.checkIn.slice(0, 10)}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Check-Out</p>
                        <p className='text-sm font-medium flex items-center'>
                          <Calendar className='w-4 h-4 mr-1' />
                          {booking.checkOut.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mt-4'>
                    <div className='mb-2 flex items-center gap-4 sm:mb-0'>
                      <p className='text-sm text-gray-500'>Total Guest</p>
                      <p className='font-medium'>{booking.adultCount}</p>
                    </div>
                    <div className='mb-2 sm:mb-0 flex items-center gap-4'>
                      <p className='text-sm text-gray-500'>Total Payable</p>
                      <p className='font-medium'>
                        {booking.payment[0].paid_amount ||
                          booking.payment[0].due_amount}
                      </p>
                    </div>
                    <div className='space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto'>
                      <Link
                        to={`/vendor-dashboard/bookings/booking-details/${booking.id}`}
                      >
                        <button className='bg-orange-500 text-white px-4 py-2 rounded w-full sm:w-auto'>
                          View Details
                        </button>
                      </Link>
                      {/* <button className='border border-gray-300 text-gray-600 px-4 py-2 rounded w-full sm:w-auto mt-2 sm:mt-0'>
                        {activeTab === 3 ? 'Remove' : 'Cancel Booking'}
                      </button> */}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <NoBookingsFound />
        )}
      </div>
    </div>
  );
}
