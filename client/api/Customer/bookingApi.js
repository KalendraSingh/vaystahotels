import { axiosPrivate } from '../axios';

export const initiateBookingPayment = ({
  customerId,
  roomSelections,
  hotelId,
  startDate,
  endDate,
  payAmount,
}) => {
  console.log('initiateBookingPayment', {
    customerId,
    roomSelections,
    hotelId,
    startDate,
    endDate,
    payAmount,
  });
  return axiosPrivate.post('/booking/customer/payment', {
    customerId,
    roomSelections,
    hotelId,
    startDate,
    endDate,
    payAmount,
  });
};

export const verifyBookingPayment = (paymentData) => {
  return axiosPrivate.post(
    'booking/customer/payment/verification',
    paymentData
  );
};

export const bookingAtHotel = ({
  customerId,
  roomSelections,
  hotelId,
  startDate,
  endDate,
  payAmount,
  nights,
  totalAmount,
  totalDiscount,
  amountWithGst,
}) => {
  return axiosPrivate.post('/booking/customer/bookingAtHotel', {
    customerId,
    roomSelections,
    hotelId,
    startDate,
    endDate,
    payAmount,
    nights,
    totalAmount,
    totalDiscount,
    amountWithGst,
  });
};

export const initiateBookingAtHotelPayment = ({ dueAmount, bookingId }) => {
  return axiosPrivate.post('/booking/customer/payment/atHotel', {
    dueAmount,
    bookingId,
  });
};

export const verifyBookingAtHotelPayment = (paymentData) => {
  return axiosPrivate.post(
    'booking/customer/payment/verification/atHotel',
    paymentData
  );
};

export const getBookingById = (id) => {
  return axiosPrivate.get(`/booking/customer/booking/${id}`);
};

export const cancelBookingByCustomer = (data) => {
  return axiosPrivate.post(`/booking/customer/payment/cancel`, data);
};

export const getBookingsStatus = (idData) => {
  const { customerId, status } = idData;
  return axiosPrivate.get(`/booking/customer/bookings/${customerId}/${status}`);
};

