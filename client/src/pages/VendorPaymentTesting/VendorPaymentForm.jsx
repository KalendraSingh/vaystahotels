import React, { useState } from 'react';
import { initiatePayment, verifyPayment } from '../../../api/Vendor/PaymentApi';

const VendorPaymentForm = () => {
  const [vendorId, setVendorId] = useState('');
  const [hotelId, setHotelId] = useState('');
  const [paymentAmount] = useState(15000);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const handlePayment = async () => {
    try {
      const paymentData = await initiatePayment(
        vendorId,
        hotelId,
        paymentAmount
      );

      if (paymentData?.order) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: paymentData.order.amount,
          currency: 'INR',
          name: 'Hotel Booking',
          description: 'Hotel payment for activation',
          order_id: paymentData.order.id,
          handler: async function (response) {
            const paymentVerification = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              vendorId,
              hotelId,
            });

            if (paymentVerification?.message) {
              setPaymentStatus(paymentVerification.message);
            } else {
              setPaymentStatus('Payment verification failed');
            }
          },
          prefill: {
            name: 'Kalendra Singh',
            email: 'sangamjone@gmail.com',
            contact: '917033159',
          },
          theme: {
            color: '#F86800',
          },
        };
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        setPaymentStatus('Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setPaymentStatus('Something went wrong during payment');
    }
  };

  return (
    <div className='p-6'>
      <h2 className='text-2xl font-bold mb-4'>Vendor Payment Form</h2>
      <div className='mb-4'>
        <label className='block text-gray-700'>Vendor ID</label>
        <input
          type='text'
          className='border px-3 py-2 w-full'
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700'>Hotel ID</label>
        <input
          type='text'
          className='border px-3 py-2 w-full'
          value={hotelId}
          onChange={(e) => setHotelId(e.target.value)}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-gray-700'>Payment Amount</label>
        <input
          type='text'
          className='border px-3 py-2 w-full'
          value={paymentAmount}
          disabled
        />
      </div>
      <button
        className='bg-blue-500 text-white px-4 py-2 rounded'
        onClick={handlePayment}
      >
        Pay Now
      </button>

      {paymentStatus && <p className='mt-4'>{paymentStatus}</p>}
    </div>
  );
};

export default VendorPaymentForm;
