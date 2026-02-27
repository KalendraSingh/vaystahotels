import { useEffect, useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { useAuth } from '../../../Hooks/useAuth';
import { getBookingsStatus } from '../../../../api/Customer/bookingApi';
import Dataloading from '../../../components/DataLoading/DataLoading';
import NoBookingsFound from '../../../components/BookingNotFound/BookingNotFound';
import { cancelBookingByCustomer } from '../../../../api/Customer/bookingApi';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import Review from '../Review/Review';

const tabs = [
  { name: 'Bookings', status: 'ongoing' },
  { name: 'Past Bookings', status: 'past' },
  { name: 'Cancelled Booking', status: 'canceled' },
];

export default function Component() {
  const [activeTab, setActiveTab] = useState(0);
  const [bookingData, setBookingData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const status = tabs[activeTab].status;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');
  const [error, setError] = useState('');

  const { auth } = useAuth();

  const customerId = auth.data && auth.data.id;

  const handleBookingStatus = async () => {
    setIsLoading(true);
    try {
      const idData = {
        status,
        customerId,
      };
      const res = await getBookingsStatus(idData);
      setIsLoading(false);
      if (res.status === 200) {
        setBookingData(res.data);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    const data = {
      bookingId: bookingId,
      reason,
    };

    if (reason.trim().length < 10) {
      setError('Please provide a detailed reason (minimum 10 characters)');
      return;
    }
    try {
      const res = await cancelBookingByCustomer(data);
      if (res.status === 200) {
        setError('');
        setBookingId('');
        setIsSubmitted(true);
        handleBookingStatus();
        setTimeout(() => {
          setIsModalOpen(false);
          setIsSubmitted(false);
          setReason('');
        }, 2000);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleOpenModel = (id) => {
    setBookingId(id);
    setIsModalOpen(true);
  };

  console.log(bookingData);

  useEffect(() => {
    handleBookingStatus();
  }, [status]);

  return (
    <div className='container mx-auto'>
      <div className='flex mb-4 border-b overflow-x-auto'>
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`py-2 px-4 whitespace-nowrap ${
              activeTab === index
                ? 'text-yellow-400 border-b-2 border-yellow-400 font-medium'
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
                className='bg-white p-6 rounded-lg shadow-md flex flex-col md:flex-row gap-6'
              >
                {/* Image Section */}
                <div className='w-full md:w-1/3'>
                  <img
                    src={Hotel.bannerImage}
                    alt='Hotel Room'
                    className='rounded-lg object-cover w-full h-full'
                  />
                </div>

                {/* Details Section */}
                <div className='w-full md:w-2/3 flex flex-col justify-between'>
                  {/* Hotel Info */}
                  <div>
                    <p className='text-gray-700 text-sm flex items-center mb-2'>
                      <MapPin className='w-4 h-4 text-yellow-400 mr-2' />
                      {Hotel.location}{' '}
                    </p>
                    {roomType &&
                      roomType.map((name, index) => (
                        <h3
                          key={index}
                          className='text-lg font-semibold text-gray-900'
                        >
                          {name}
                        </h3>
                      ))}
                    {/* Dates Section */}
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4'>
                      <div>
                        <p className='text-sm text-gray-500'>Check-In</p>
                        <p className='text-sm font-medium text-gray-800 flex items-center'>
                          <Calendar className='w-4 h-4 text-yellow-400 mr-2' />
                          {booking.checkIn.slice(0, 10)}
                        </p>
                      </div>
                      <div>
                        <p className='text-sm text-gray-500'>Check-Out</p>
                        <p className='text-sm font-medium text-gray-800 flex items-center'>
                          <Calendar className='w-4 h-4 text-yellow-400 mr-2' />
                          {booking.checkOut.slice(0, 10)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info and Actions */}
                  <div className='flex flex-col sm:flex-row justify-between items-start sm:items-end mt-6'>
                    {/* Guests and Payment */}
                    <div className='space-y-2'>
                      <div className='flex items-center gap-4'>
                        <p className='text-sm text-gray-500'>Total Guest</p>
                        <p className='font-medium text-gray-900'>
                          {booking.adultCount}
                        </p>
                      </div>
                      <div className='flex items-center gap-4'>
                        <p className='text-sm text-gray-500'>
                          {booking.payment[0].due_amount !== 0
                            ? 'Total Due'
                            : 'Total Paid'}
                        </p>
                        <p className='font-medium text-gray-900'>
                          {booking.payment[0].due_amount !== 0
                            ? booking.payment[0].due_amount.toFixed(2)
                            : booking.payment[0].paid_amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='flex gap-2 items-center justify-end mt-4 sm:mt-0'>
                      {(booking.payment[0].due_amount !== 0 &&
                        booking.status === 'CONFIRMED') ||
                      booking.status === 'CHECKED_IN' ? (
                        <Link
                          to={`/checkout/booking-confirm/atHotel?bookingId=${booking.id}`}
                          className='bg-green-500 text-[10px] sm:text-[12px] md:text-[14px] text-nowrap text-white px-4 py-2 rounded-lg text-center hover:bg-green-600 transition w-full'
                        >
                          Pay Now
                        </Link>
                      ) : null}
                      <Link to={`/booking-details/${booking.id}`}>
                        <button className='bg-yellow-400 text-[10px] sm:text-[12px] md:text-[14px] text-nowrap text-white px-4 py-2 rounded-lg text-center hover:bg-yellow-400 transition w-full'>
                          View Details
                        </button>
                      </Link>

                      {booking.status === 'CHECKED_OUT' ? (
                        <div>
                          <Review hotelId={booking.hotelId} />
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenModel(booking.id)}
                          disabled={booking.status === 'CANCELED'}
                          className={`border border-gray-300 text-[10px] sm:text-[12px] md:text-[14px] text-nowrap text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition w-full ${
                            booking.status === 'CANCELED' &&
                            'opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {booking.status === 'CANCELED'
                            ? 'Canceled'
                            : 'Cancel Booking'}
                        </button>
                      )}
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
      <AnimatePresence>
        {isModalOpen && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className='bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative'
              role='dialog'
              aria-modal='true'
              aria-labelledby='modal-title'
            >
              <button
                onClick={() => setIsModalOpen(false)}
                className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors'
                aria-label='Close modal'
              >
                <FaTimes size={24} />
              </button>

              <h2
                id='modal-title'
                className='text-2xl font-bold text-gray-800 mb-4'
              >
                Confirm Cancellation
              </h2>

              {!isSubmitted ? (
                <form>
                  <div className='mb-4'>
                    <label
                      htmlFor='reason'
                      className='block text-sm font-medium text-gray-700 mb-2'
                    >
                      Please tell us why you're cancelling
                    </label>
                    <textarea
                      id='reason'
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        error ? 'border-red-500' : 'border-gray-300'
                      }`}
                      rows='4'
                      placeholder='Enter your cancellation reason...'
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? 'reason-error' : undefined}
                    ></textarea>
                    {error && (
                      <p
                        id='reason-error'
                        className='mt-2 text-sm text-red-600'
                      >
                        {error}
                      </p>
                    )}
                  </div>
                  <div className='flex justify-end gap-4'>
                    <button
                      type='button'
                      onClick={() => setIsModalOpen(false)}
                      className='px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors'
                    >
                      Keep Booking
                    </button>
                    <button
                      type='button'
                      onClick={handleCancelBooking}
                      className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors'
                    >
                      Confirm Cancellation
                    </button>
                  </div>
                </form>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='text-center py-8'
                >
                  <div className='text-green-500 text-xl mb-4'>✓</div>
                  <p className='text-gray-800 font-medium'>
                    Your booking has been cancelled successfully!
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
