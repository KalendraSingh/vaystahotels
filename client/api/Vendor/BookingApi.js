import { axiosPrivate } from '../axios';

export const getBookingById = (id) => {
  return axiosPrivate.get(`/vendor/hotelBooking/getVendorBookingById/${id}`);
};

export const getVendorHotelBookinsByStatus = (idData) => {
  const { hotelId, status } = idData;
  return axiosPrivate.get(
    `/vendor/hotelBooking/getVendorBookingsByStatus/${hotelId}/${status}`
  );
};

export const getAllAvailableRooms = (id) => {
  return axiosPrivate.get(`/vendor/hotelBooking/getAllAvailableRooms/${id}`);
};

export const getBookingSummary = (id) => {
  return axiosPrivate.get(`/vendor/hotelBooking/getBookingSummary/${id}`);
};

export const getBookingsChartData = (id) => {
  return axiosPrivate.get(`/vendor/hotelBooking/getBookingsChartData/${id}`);
};
