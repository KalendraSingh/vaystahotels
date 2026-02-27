import { axiosPrivate } from '../axios';

export const adminGetAllBookingsByFilters = async ({
  status,
  hotelId,
  startDate,
  endDate,
  page,
  pageSize,
}) => {
  return await axiosPrivate.get(
    `/admin/bookings/getBookingsByStatus/${status}`,
    {
      params: { startDate, endDate, hotelId, page, pageSize },
    }
  );
};

export const adminGetAllBookings = async () => {
  return await axiosPrivate.get('/admin/bookings/getAllBookings');
};

export const adminGetBookingById = async (bookingId) => {
  return await axiosPrivate.get(`/admin/bookings/getBookingById/${bookingId}`);
};
