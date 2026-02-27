import { useEffect, useState } from 'react';
import { ChevronDownIcon } from 'lucide-react';
import { useAuth } from '../../Hooks/useAuth';
import { getRoomToCart } from '../../../api/Customer/cartApi';
import { getHotelById } from '../../../api/Public/HotelApi';
import {
  initiateBookingPayment,
  verifyBookingPayment,
  bookingAtHotel,
} from '../../../api/Customer/bookingApi';
import { addGuest } from '../../../api/Customer/guestApi';
import { notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import VenderHeader from '../Home/VenderHeader';
export default function BookingForm() {
  const [gstNumber, setGstNumber] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [hotelData, setHotelData] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [paymentType, setPaymentType] = useState('');

  const handleToggle = () => {
    setShowAll(!showAll);
  };

  const { auth } = useAuth();

  const customerId = auth.data && auth.data.id;

  useEffect(() => {
    fetchBookingData();
  }, []);

  const fetchBookingData = async () => {
    try {
      const res = await getRoomToCart({ customerId });
      if (res.status === 200) {
        setCheckoutData(res.data.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddGuest = async (e) => {
    e.preventDefault();
    const allData = {
      ...formData,
      ...gstDetails,
    };
    try {
      const res = await addGuest(allData);
      if (res.status === 201) {
        paymentType === 'payAtHotel' ? handleBookingAtHotel() : handlePayment();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handlePayment = async () => {
    try {
      const res = await initiateBookingPayment(checkoutData);

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
            gstAmount: checkoutData && checkoutData.amountWithGst,
            discountAmount: checkoutData && checkoutData.totalDiscount,
          };
          const paymentResult = await verifyBookingPayment(
            paymentVerificationData
          );
          if (paymentResult.status === 200) {
            window.location.href = `/checkout/booking-confirm?bookingId=${paymentResult.data.booking.id}`;
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

  const {
    amountWithGst,
    createdAt,
    endDate,
    hotelId,
    nights,
    payAmount,
    roomSelections,
    startDate,
    totalAmount,
    totalDiscount,
  } = checkoutData !== null && checkoutData;

  const payAtHotelPrice = payAmount + payAmount * 0.07;

  const categoryDetails =
    roomSelections &&
    roomSelections.map(({ roomCount, adultCount, roomCategoryId }) => ({
      cartRooms: roomCount,
      cartAdult: adultCount,
      roomCategoryId,
    }));

  const totalGuestCount =
    roomSelections &&
    roomSelections.reduce((total, room) => total + room.adultCount, 0);

  const fetchHotelData = async () => {
    try {
      const res = await getHotelById(hotelId);
      if (res.status === 200) {
        setHotelData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const navigate = useNavigate();

  const handleBookingAtHotel = async () => {
    if (!formData.name || !formData.phone || !formData.email) {
      notification.error({
        message: 'Please fill all the fields',
      });
      return;
    }
    try {
      const patAtHotelData = {
        ...checkoutData,
        payAmount: payAtHotelPrice,
      };
      const res = await bookingAtHotel(patAtHotelData);
      if (res.status === 201) {
        notification.success({
          message: 'Room booked successfully',
        });
        navigate(
          `/checkout/booking-confirm/atHotel?bookingId=${res.data.booking.id}`
        );
      } else {
        notification.error({
          message: 'Error during booking',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error during booking',
      });
    }
  };

  useEffect(() => {
    if (hotelId !== undefined) {
      fetchHotelData();
    }
  }, [hotelId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
  });

  const [gstDetails, setGstDetails] = useState({
    gstNumber: '',
    companyName: '',
    address: '',
  });

  return (
    <>
     <VenderHeader/>
    
  <div className='flex flex-col lg:flex-row gap-6 p-6 max-w-6xl mx-auto bg-white'>
  <form
    onSubmit={(e) => handleAddGuest(e)}
    className='w-full lg:w-1/2 space-y-4'
  >
    <div className='bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-lg border border-[#E5C100] shadow'>
      <div className='bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-lg border border-[#E5C100] p-4 rounded-t-lg'>
        <h2 className='text-lg font-semibold text-[#D4AF37]'>
          Primary Guest Details
        </h2>
        <p className='text-sm text-[#B68F00]'>
          All your Details are safe & Secure
        </p>
      </div>
      <div className='p-4 space-y-4'>
        <input
          required
          type='text'
          value={formData.name}
          onChange={(e) =>
            setFormData({ ...formData, name: e.target.value })
          }
          name='name'
          id='name'
          placeholder='Guest Full Name'
          className='w-full p-2 border border-[#E5C100] rounded bg-white'
        />
        <div className='flex'>
          <select className='p-2 border border-[#E5C100] text-[#D4AF37] rounded-l bg-white'>
            <option>+91</option>
          </select>
          <input
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            type='tel'
            placeholder='Mobile Number'
            className='flex-grow p-2 border-t border-b border-r border-[#E5C100] rounded-r bg-white'
          />
        </div>
        <input
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          required
          type='email'
          placeholder='Enter Email Address'
          className='w-full p-2 border border-[#E5C100] rounded bg-white'
        />
        <div className='flex items-center space-x-2'>
          <input
            type='checkbox'
            id='gst'
            name='gst'
            checked={gstNumber}
            onChange={() => setGstNumber(!gstNumber)}
            className='rounded text-[#D4AF37]'
          />
          <label htmlFor='gst' className='text-sm text-[#B68F00]'>
            GST number (Optional)
          </label>
          <ChevronDownIcon className='w-4 h-4 text-[#B68F00]' />
        </div>
        {gstNumber && (
          <>
            <input
              required={gstNumber}
              type='text'
              value={gstDetails.gstNumber}
              onChange={(e) =>
                setGstDetails({ ...gstDetails, gstNumber: e.target.value })
              }
              name='gstNumber'
              placeholder='GSTIN'
              className='w-full p-2 border border-[#E5C100] rounded bg-white'
            />
            <input
              required={gstNumber}
              value={gstDetails.companyName}
              onChange={(e) =>
                setGstDetails({
                  ...gstDetails,
                  companyName: e.target.value,
                })
              }
              name='companyName'
              type='text'
              placeholder='Company Name'
              className='w-full p-2 border border-[#E5C100] rounded bg-white'
            />
            <input
              required={gstNumber}
              name='address'
              value={gstDetails.address}
              onChange={(e) =>
                setGstDetails({
                  ...gstDetails,
                  address: e.target.value,
                })
              }
              type='text'
              placeholder='Company Address'
              className='w-full p-2 border border-[#E5C100] rounded bg-white'
            />
          </>
        )}
      </div>
    </div>
    <div className='flex gap-4'>
      <button
        onClick={() => {
          setPaymentType('payAtHotel');
        }}
        type='submit'
        className='flex-1 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-white py-3 rounded font-semibold'
      >
        Pay@Hotel
        <br />
        <span className='text-sm text-[#7a6c00]'>
          ₹ {parseInt(payAtHotelPrice)} incl GST
        </span>
      </button>
      <button
        type='submit'
        onClick={() => setPaymentType('payNow')}
        className='flex-1 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-white py-3 rounded font-semibold'
      >
        Pay Now
        <br />
        <span className='text-sm text-[#7a6c00]'>₹{payAmount} incl GST</span>
      </button>
    </div>
    <p className='text-center text-green-500 text-sm'>
      Save Extra ₹ {parseInt(payAmount * 0.07)} by paying now
    </p>
  </form>

  <div className='w-full lg:w-1/2 space-y-4'>
    <div className='bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-lg border border-[#E5C100] shadow p-4 space-y-4'>
      <div className='flex justify-between'>
        <div>
          <h3 className='font-semibold text-[12px] md:text-base text-[#B68F00]'>
            {hotelData && hotelData.city}, {hotelData && hotelData.state},
            {hotelData && hotelData.country}
          </h3>
          <p className='text-[12px] md:text-base text-[#B68F00]'>
            {hotelData && hotelData.name}
          </p>
        </div>
        <img
          src={hotelData && hotelData.bannerImage}
          alt='Room'
          className='w-[70px] md:w-[200px] object-cover rounded'
        />
      </div>

      <div className='flex justify-between items-start'>
        <div>
          <p className='text-sm text-gray-600 mt-2'>Amenities</p>
          <div className='flex flex-wrap gap-4 mt-1'>
            {hotelData &&
              hotelData.amenities
                .slice(0, showAll ? hotelData.amenities.length : 4)
                .map((amenity, index) => (
                  <span
                    key={index}
                    className='text-sm text-gray-600 flex items-center gap-2'
                  >
                    <img
                      src={amenity.icon}
                      className='w-4 h-4'
                      alt={`${amenity.name} icon`}
                    />
                    {amenity.name}
                  </span>
                ))}
          </div>
          {hotelData && hotelData.amenities.length > 5 && (
            <button
              onClick={handleToggle}
              className='mt-2 text-[#D4AF37] text-sm'
            >
              {showAll
                ? 'Show Less'
                : `${hotelData.amenities.length - 5} Show More`}
            </button>
          )}
        </div>
      </div>

      <div className='flex justify-between text-sm'>
        <div>
          <p className='text-gray-500'>Check-in</p>
          <p className='font-semibold text-[#B68F00]'>
            {startDate && startDate.slice(0, 10)}
          </p>
        </div>
        <div>
          <p className='text-gray-500'>Check-out</p>
          <p className='font-semibold text-[#B68F00]'>
            {endDate && endDate.slice(0, 10)}
          </p>
        </div>
        <div>
          <p className='text-gray-500'>Guest</p>
          <p className='font-semibold text-[#B68F00]'>{totalGuestCount} Guest</p>
        </div>
      </div>

      <div>
        {roomSelections &&
          roomSelections.map((category, index) => (
            <p key={index} className='text-[#B68F00]'>
              {category.roomCount} {category.categoryName} room,
            </p>
          ))}
      </div>
    </div>

    <div className='bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-lg border border-[#E5C100] shadow p-4 space-y-4'>
      <h3 className='font-semibold text-[#D4AF37]'>Price Details</h3>
      <div className='space-y-2 text-sm text-[#B68F00]'>
        <div className='flex justify-between'>
          <span>Booking Price</span>
          <span>₹{totalAmount}</span>
        </div>
        <div className='flex justify-between font-semibold'>
          <span>Discount Offer</span>
          <span>- ₹{totalDiscount}</span>
        </div>
        <div className='flex justify-between font-semibold'>
          <span>Discounted Price</span>
          <span> ₹{totalAmount - totalDiscount}</span>
        </div>
        <div className='flex justify-between'>
          <span>GST Price</span>
          <span>+ ₹{amountWithGst}</span>
        </div>
      </div>
      <div className='border-t pt-4 text-[#D4AF37] flex justify-between font-semibold'>
        <span>Total Payable</span>
        <span>₹{payAmount}</span>
      </div>
      <p className='text-right text-green-500 text-sm'>
        Total Saving ₹ {totalDiscount}
      </p>
    </div>
  </div>
</div>
 </>

  );
}
