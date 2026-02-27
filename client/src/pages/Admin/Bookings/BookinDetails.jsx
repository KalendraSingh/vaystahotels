import { CheckCircle, Printer, MapPin, Mail, Globe, Phone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminGetBookingById } from '../../../../api/Admin/bookingsAPI';
import { notification } from 'antd';

export default function BookingDetails() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState({});

  const getBookingDetails = async () => {
    try {
      const response = await adminGetBookingById(bookingId);
      setBookingData(response.data);
    } catch (error) {
      notification.error({ message: 'Error fetching booking details' });
      navigate('admin-dashboard/bookings');
    }
  };

  useEffect(() => {
    getBookingDetails();
  }, []);

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      {Object.keys(bookingData).length === 0 ? (
        ''
      ) : (
        <>
          <button
            onClick={() => navigate('/admin-dashboard/bookings')}
            className='w-24 bg-orange-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center justify-center'
          >
            Back
          </button>
          <div className='max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-4'>
            <div className='p-6'>
              <div className='flex flex-col md:flex-row gap-6'>
                <div className='flex-1 space-y-6'>
                  <div className='bg-gray-50 p-6 rounded-lg'>
                    <h2 className='text-2xl font-semibold mb-2'>
                      {bookingData.Hotel?.name}
                    </h2>
                    <p className='text-gray-600'>
                      {bookingData.Hotel?.city}, {bookingData.Hotel?.state},{' '}
                      {bookingData.Hotel?.country}
                    </p>
                    <p className='text-gray-500'>Booking ID: {bookingId}</p>
                    <div className='flex justify-between mt-4'>
                      <div>
                        <p className='font-semibold'>Check-in</p>
                        <p>{bookingData.checkIn?.slice(0, 10)}</p>
                      </div>
                      <div>
                        <p className='font-semibold'>Check-Out</p>
                        <p>{bookingData.checkOut?.slice(0, 10)}</p>
                      </div>
                      <div>
                        <p className='font-semibold'>No. of Guest</p>
                        <p>{bookingData.adultCount} Guest</p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gray-50 p-6 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Guest Information
                    </h3>
                    <div className='grid grid-cols-2 gap-4'>
                      <div>
                        <p className='text-gray-600'>Name</p>
                        <p className='font-semibold'>
                          {bookingData.customer?.name}
                        </p>
                      </div>
                      <div>
                        <p className='text-gray-600'>Mobile No.</p>
                        <p className='font-semibold'>
                          +91 {bookingData.customer?.phone}
                        </p>
                      </div>
                      <div className='col-span-2'>
                        <p className='text-gray-600'>Email Address</p>
                        <p className='font-semibold'>
                          {bookingData.customer?.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className='bg-gray-50 p-6 rounded-lg'>
                    <h3 className='text-lg font-semibold mb-4'>
                      Booking Fare Breakup
                    </h3>
                    <div className='flex justify-between text-lg font-bold text-blue-600'>
                      <span>Total</span>
                      <span>₹{bookingData.payment?.[0]?.amount || 0}</span>
                    </div>
                  </div>
                </div>

                <div className='md:w-1/3'>
                  <img
                    src={bookingData.Hotel?.bannerImage}
                    alt='Room'
                    width={400}
                    height={300}
                    className='w-full h-auto rounded-lg mb-6'
                  />
                  <div className='bg-gray-50 p-6 rounded-lg'>
                    <h3 className='text-xl font-semibold mb-4'>
                      {bookingData.Hotel?.name}, {bookingData.Hotel?.city}
                    </h3>
                    <div className='space-y-3'>
                      <div className='flex items-start space-x-3'>
                        <MapPin className='w-5 h-5 text-gray-600' />
                        <p>{bookingData.Hotel?.location}</p>
                      </div>
                      {bookingData.Hotel?.website && (
                        <div className='flex items-start space-x-3'>
                          <Globe className='w-5 h-5 text-gray-600' />
                          <a
                            href={bookingData.Hotel?.website}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 hover:text-blue-600'
                          >
                            Website
                          </a>
                        </div>
                      )}
                      <div className='flex items-start space-x-3'>
                        <Mail className='w-5 h-5 text-gray-600' />
                        <p>{bookingData.Hotel?.email}</p>
                      </div>
                      <div className='flex items-start space-x-3'>
                        <Phone className='w-5 h-5 text-gray-600' />
                        <p>{bookingData.Hotel?.phone}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
