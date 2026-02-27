import axios from '../axios';

export const initiatePayment = async (vendorId, hotelId, paymentAmount) => {
  try {
    const response = await axios.post('/vendor/auth/hotel/payment', {
      vendorId,
      hotelId,
      paymentAmount,
    });
    return response.data;
  } catch (error) {
    console.error('Error initiating payment:', error);
    throw new Error('Payment initiation failed');
  }
};

export const verifyPayment = async (paymentData) => {
  try {
    const response = await axios.post(
      '/vendor/auth/hotel/payment/verification',
      paymentData
    );
    return response.data;
  } catch (error) {
    console.error('Error verifying payment:', error);
    throw new Error('Payment verification failed');
  }
};
