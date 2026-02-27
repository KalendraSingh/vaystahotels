import { useState, useEffect } from 'react';
import { FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const AdminBookingsFound = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className='min-h-[60vh] w-full flex items-center justify-center p-4'>
      <div
        className={`max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center transform transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        role='alert'
        aria-live='polite'
      >
        <div className='mb-6'>
          <FaCalendarAlt className='w-16 h-16 mx-auto text-color mb-4' />
        </div>

        <h2 className='text-2xl font-bold text-gray-800 mb-2'>
          No Bookings Found
        </h2>
        <p className='text-gray-600 mb-8'>
          Looks like you haven't made any bookings yet. Start exploring and book
          your next experience!
        </p>

        {/* <Link to='/hotels'>
          <button
            className='inline-flex items-center px-6 py-3 cta text-white font-semibold rounded-lg transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            onClick={() => console.log('Navigate to booking page')}
          >
            <FaCalendarAlt className='mr-2' />
            Book Now
          </button>
        </Link> */}
      </div>
    </div>
  );
};

export default AdminBookingsFound;
