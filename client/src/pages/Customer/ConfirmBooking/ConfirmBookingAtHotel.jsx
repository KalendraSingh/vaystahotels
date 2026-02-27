import {
  CheckCircle,
  Printer,
  Share2,
  MapPin,
  Mail,
  Globe,
  Phone,
} from 'lucide-react';
import DataLoading from '../../../components/DataLoading/DataLoading';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import {
  getBookingById,
  initiateBookingAtHotelPayment,
  verifyBookingAtHotelPayment,
} from '../../../../api/Customer/bookingApi';

export default function BookingConfirmationAtHotel() {
  const componentRef = useRef();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await getBookingById(bookingId);
        console.log('booking Data', response);
        if (response.status === 200) {
          setBookingData(response.data);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
    if (bookingId) {
      fetchBookingData();
    }
  }, [bookingId]);

  if (!bookingData) {
    return <DataLoading />;
  }

  const {
    id,
    customerId,
    adultCount,
    roomCount,
    checkIn,
    checkOut,

    roomDetails: [
      {
        roomCount: roomDetailRoomCount,
        adultCount: roomDetailAdultCount,
        categoryName,
        roomCategoryId,
      } = {},
    ] = [],
    payment: [
      { amount, gstAmount, discountAmount, due_amount, paid_amount } = {},
    ] = [],
    Hotel: {
      name: hotelName,
      city,
      state,
      country,
      location,
      description: hotelDescription,
      bannerImage,
    } = {},
    customer: { name: customerName, email, phone } = {},
  } = bookingData || {};

  const handlePayment = async () => {
    try {
      const data = {
        bookingId: bookingId,
        dueAmount: parseInt(bookingData.payment[0].due_amount),
      };
      const res = await initiateBookingAtHotelPayment(data);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: res.data.amount,
        currency: res.data.currency,
        order_id: res.data.orderId,
        name: 'Aone Hotel',
        description: 'Complete your payment',
        handler: async (response) => {
          const paymentVerificationData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            bookingId: res.data.bookingId,
            amount: res.data.amount,
            gstAmount: bookingData.payment.gstAmount,
          };
          const paymentResult = await verifyBookingAtHotelPayment(
            paymentVerificationData
          );
          console.log('Payment Result:', paymentResult);
          if (paymentResult.status === 200) {
            window.location.href = `/checkout/booking-confirm/atHotel?bookingId=${paymentResult.data.payment.bookingId}`;
          } else {
            window.location.href = '/payment-failed';
          }
        },
        theme: {
          color: '#F86800',
        },
      };
      const rzp1 = new Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error('Payment initiation failed:', error);
      alert('Failed to initiate payment.');
    }
  };

  return (
    <div className='min-h-screen bg-white p-4 md:p-8'>
      <div
        ref={componentRef}
        className='max-w-5xl mx-auto bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] border border-[#E5C100] shadow-lg rounded-lg overflow-hidden'
      >
        <div className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <div className='flex items-center space-x-2'>
              <CheckCircle className='text-green-500 w-6 h-6' />
              <h1 className='text-2xl text-[#D4AF37] font-bol'>
                Booking Confirmed
              </h1>
            </div>
            <div className='flex items-center space-x-4'>
              {/* <button className='text-gray-600 hover:text-gray-800'>
                  <Share2 className='w-5 h-5' />
                </button> */}
              <button
                onClick={() => window.print()}
                className='bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-black px-4 py-2 rounded-md hover:opacity-90 transition duration-300 flex items-center space-x-2'
              >
                <Printer className='w-5 h-5' />
                <span>Print</span>
              </button>
            </div>
          </div>
          <p className='text-[#7a6c00] mb-6'>
            Your Booking is Confirmed! Thank you for choosing our services
          </p>

          <div className='flex flex-col md:flex-row gap-6'>
            <div className='flex-1'>
              <div className='bg-white p-6 rounded-lg mb-6 border border-[#E5C100]'>
                <h2 className='text-xl font-semibold mb-4 text-[#B68F00]'>{hotelName}</h2>
                <p className='text-[#7a6c00] mb-2'>{location}</p>
                <p className='text-[#7a6c00] mb-4 uppercase'>Booking ID: {id}</p>
                <div className='flex justify-between mb-4'>
                  <div>
                    <p className='font-semibold text-[#B68F00]'>Check-in</p>
                    <p>{checkIn.slice(0, 10)}</p>
                  </div>
                  <div>
                    <p className='font-semibold text-[#B68F00]'>Check-Out</p>
                    <p>{checkOut.slice(0, 10)}</p>
                  </div>
                  <div>
                    <p className='font-semibold text-[#B68F00]'>No. of Guest</p>
                    <p>{adultCount} Guest</p>
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <h3 className='text-lg font-semibold mb-4 text-[#D4AF37]'>Primary Guest</h3>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <p className='text-[#7a6c00]'>Name</p>
                    <p className='font-semibold text-[#B68F00]'>{customerName}</p>
                  </div>
                  <div>
                    <p className='text-[#7a6c00]'>Mobile No.</p>
                    <p className='font-semibold text-[#B68F00]'>+91 {phone}</p>
                  </div>
                  <div className='col-span-2'>
                    <p className='text-[#7a6c00]'>Email Address</p>
                    <p className='font-semibold text-[#B68F00]'>{email}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-semibold mb-4 text-[#D4AF37]'>
                  Booking Fare Breakup
                </h3>
                <div className='space-y-2'>
                  <div className='flex justify-between'>
                    <span>Booking Price</span>
                    <span>
                      ₹
                      {due_amount != 0
                        ? (due_amount - gstAmount).toFixed(0)
                        : paid_amount &&
                          (paid_amount + discountAmount - gstAmount).toFixed(0)}
                    </span>
                  </div>
                  <div className='flex justify-between text-green-600'>
                    <span>Discount</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                  <div className='flex justify-between font-semibold'>
                    <span>Discounted Price</span>
                    <span>
                      ₹
                      {due_amount != 0
                        ? (due_amount - gstAmount).toFixed(0)
                        : paid_amount && (paid_amount - gstAmount).toFixed(0)}
                    </span>
                  </div>

                  <div className='flex justify-between'>
                    <span>GST</span>
                    <span>+₹{gstAmount.toFixed(0)}</span>
                  </div>
                  <div className='flex justify-between text-lg font-bold text-[#D4AF37] border-t pt-2'>
                    <span>
                      Total {due_amount != 0 ? 'Due' : paid_amount && 'Paid'}
                    </span>
                    <span>
                      ₹
                      {due_amount != 0
                        ? due_amount.toFixed(0)
                        : paid_amount.toFixed(0)}
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex grow-0 space-x-2 mt-6'>
                <Link
                  to='/hotels'
                  className={` ${due_amount != 0 ? 'w-1/2' : 'w-full'}`}
                >
                  <button
                    className={`bg-gradient-to-br from-[#D4AF37] to-[#FFD700] w-full text-black px-4 py-2 rounded-md hover:opacity-90 transition duration-300`}
                  >
                    Book Another One
                  </button>
                </Link>
                {due_amount != 0 && (
                  <button
                    onClick={handlePayment}
                    className='bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition duration-300 w-1/2'
                  >
                    Pay Now
                  </button>
                )}
              </div>
            </div>

            <div className='md:w-1/3'>
              <img
                src={bannerImage}
                alt='Room'
                width={400}
                height={300}
                className='w-full h-auto rounded-lg mb-6'
              />
              <div className='bg-white p-6 rounded-lg border border-[#E5C100]'>
                <h3 className='text-xl font-semibold mb-4 text-[#B68F00]'>
                  {hotelName}, {city}
                </h3>
                <div className='space-y-3'>
                  <div className='flex items-start space-x-3'>
                    <MapPin className='w-5 h-5 flex-shrink-0 text-[#7a6c00] mt-1' />
                    <p className='text-wrap'>
                      {bookingData && bookingData.Hotel?.location}
                    </p>
                  </div>
                  {bookingData && bookingData.Hotel.website ? (
                    <div className='flex items-start space-x-3'>
                      <Mail className='w-5 h-5 flex-shrink-0 text-[#7a6c00] mt-1' />
                      <a
                        target='_blank'
                        href={bookingData && bookingData.Hotel?.website}
                        className='text-wrap hover:underline text-[#D4AF37]'
                      >
                        website
                      </a>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className='flex items-start space-x-3'>
                    <Globe className='w-5 h-5 flex-shrink-0 text-[#7a6c00] mt-1' />
                    <p className='text-wrap'>
                      {bookingData && bookingData.Hotel?.email}
                    </p>
                  </div>
                  <div className='flex items-start space-x-3'>
                    <Phone className='w-5 h-5 flex-shrink-0 text-[#7a6c00] mt-1' />
                    <p className='text-wrap'>
                      {bookingData && bookingData.Hotel?.phone}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/my-booking')}
                  className='w-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-black mt-6 px-4 py-2 rounded-md hover:opacity-90 transition duration-300 flex items-center justify-center space-x-2'
                >
                  <span>Manage Booking</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
