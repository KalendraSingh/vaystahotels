import React from 'react';
import {
  initiateBookingPayment,
  verifyBookingPayment,
} from '../../../api/Customer/bookingApi';

const BookingPaymentCard = ({ customer, room, startDate, endDate }) => {
  const handlePayment = async () => {
    const paymentData = {
      customerId: 'e3af2a69-0c41-45ac-ad30-5c3b84f179ac',
      hotelId: 'a469ae68-cfec-42f1-9108-b53b9a463d90',
      roomSelections: [
        {
          roomCategoryId: 'e9777c99-ab51-43b1-ae94-4ea72fcfa894',
          roomCount: 1,
          adultCount: 1,
        },
      ],
      startDate: '2024-10-19',
      endDate: '2024-10-21',
      totalAmount: 1000,
    };

    try {
      const data = await initiateBookingPayment(paymentData);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        order_id: data.orderId,
        name: 'Aone Hotel',
        description: 'Complete your payment',
        handler: async (response) => {
          const paymentVerificationData = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
            bookingId: data.bookingId,
            amount: data.amount,
            gstAmount: 1200,
            discountAmount: 300,
          };
          const paymentResult = await verifyBookingPayment(
            paymentVerificationData
          );

          if (paymentResult.status === 200) {
            alert('Payment successful!');
          } else {
            alert('Payment verification failed.');
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
    <div className='max-w-md mx-auto bg-white shadow-lg rounded-lg overflow-hidden my-5'>
      <img
        className='w-full h-48 object-cover'
        src={room.image}
        alt='Room Image'
      />
      <div className='p-4'>
        <h2 className='text-gray-900 text-xl font-bold mb-2'>{room.name}</h2>
        <p className='text-gray-700 text-base'>
          {`Price: ₹${room.price} / night`}
        </p>
        <p className='text-gray-700 text-base'>
          {`Booking dates: ${startDate} - ${endDate}`}
        </p>
        <p className='text-gray-700 text-base'>
          {`Customer: ${customer.name}`}
        </p>
        <p className='text-gray-700 text-base'>{`Email: ${customer.email}`}</p>
        <button
          className='mt-4 bg-blue-500 text-white px-4 py-2 rounded-lg'
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default BookingPaymentCard;
