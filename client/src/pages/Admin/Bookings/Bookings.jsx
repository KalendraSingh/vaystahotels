import { notification } from 'antd';
import { Calendar } from 'lucide-react';
import { MapPin } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NoBookingsFound from '../../../components/BookingNotFound/BookingNotFound';
import DataLoading from '../../../components/DataLoading/DataLoading';
import { adminGetAllBookingsByFilters } from '../../../../api/Admin/bookingsAPI';
import { getAllHotels } from '../../../../api/Public/HotelApi';
import { Pagination } from 'antd';
import AdminBookingsFound from '../../../components/BookingNotFound/AdminBookingNotFound';

const tabs = [
  { name: 'Ongoing Bookings', status: 'ongoing' },
  { name: 'Upcoming Bookings', status: 'upcoming' },
  { name: 'Past Bookings', status: 'past' },
  { name: 'Cancelled Booking', status: 'canceled' },
];

const Bookings = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [bookingData, setBookingData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(null);
  const [hotels, setHotels] = useState([]);

  const fetchBookingsByFilters = async () => {
    const data = {
      status: tabs[activeTab].status,
      hotelId: selectedHotel,
      startDate,
      endDate,
      page,
      pageSize,
    };
    try {
      const response = await adminGetAllBookingsByFilters(data);
      setBookingData(response.data.data);
      setTotalItems(response.data.pagination.total);
      setIsLoading(false);
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchAllHotels();
    fetchBookingsByFilters();
  }, []);

  useEffect(() => {
    fetchBookingsByFilters();
  }, [activeTab, selectedHotel, startDate, endDate, page, pageSize]);

  const fetchAllHotels = async () => {
    try {
      const response = await getAllHotels();
      setHotels(response.data.data);
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.message,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className='container mx-auto p-4'>
        <div className='flex gap-4 items-center mb-4'>
          <select
            name='hotels'
            id='hotels'
            onChange={(e) => setSelectedHotel(e.target.value)}
            value={selectedHotel}
            className='w-56 focus:outline-none border border-gray-300 rounded p-2'
          >
            <option value=''>All Hotels</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>

          <div className='flex items-center gap-2'>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='border border-gray-300 rounded px-4 py-2 focus:outline-none'
            />
          </div>
          <p>To</p>
          <div className='flex items-center gap-2'>
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='border border-gray-300 rounded px-4 py-2 focus:outline-none'
            />
          </div>
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
            <DataLoading />
          ) : bookingData && bookingData.length > 0 ? (
            bookingData.map((booking) => {
              const { Hotel, roomDetails } = booking;
              const roomType = roomDetails
                .map((item) => item.categoryName)
                .join(', ');
              return (
                <div
                  key={booking.id}
                  className='bg-white p-4 rounded-lg shadow-lg flex flex-col md:flex-row'
                >
                  <div className='w-full md:w-1/4 mb-4 md:mb-0'>
                    <img
                      src={Hotel.bannerImage}
                      alt='Hotel Room'
                      className='rounded-lg w-full object-cover'
                    />
                  </div>
                  <div className='w-full md:w-3/4 flex flex-col justify-between p-4'>
                    <div>
                      <p className='text-gray-600 flex items-center mb-2'>
                        <MapPin className='w-4 h-4 mr-1' />
                        {Hotel.name}, {Hotel.city}, {Hotel.state}
                      </p>
                      <h3 className='text-lg font-semibold mb-1'>{roomType}</h3>
                      <div className='flex flex-col sm:flex-row justify-between gap-4 mt-2'>
                        <div>
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
                    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4'>
                      <div>
                        <p className='text-sm text-gray-500'>Total Guests</p>
                        <p className='font-medium'>{booking.adultCount}</p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Payment Status</p>
                        <p className='font-medium'>
                          {booking.payment[0]?.due_amount !== 0
                            ? 'Due'
                            : 'Paid'}
                        </p>
                      </div>
                      <Link
                        to={`/admin-dashboard/bookingDetails/${booking.id}`}
                        className='bg-orange-500 text-white px-4 py-2 rounded text-center w-full sm:w-auto'
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <AdminBookingsFound />
          )}
        </div>
      </div>
      <div className='py-4 flex justify-center'>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={totalItems}
          onChange={onPageChange}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </>
  );
};

export default Bookings;
