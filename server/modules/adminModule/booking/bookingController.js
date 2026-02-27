import {
  getAdminBookingsStatus,
  getAllBookings,
  getBookingByBookingId,
} from './bookingService.js';

export const getAllBookingsController = async (req, res) => {
  try {
    const { rdata, error } = await getAllBookings();

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching all bookings:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during fetching bookings' });
  }
};

export const getBookingByBookingIdController = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const { rdata, error } = await getBookingByBookingId(bookingId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during getting booking :', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during booking retrieval' });
  }
};

export const getAdminBookingsStatusController = async (req, res) => {
  try {
    const { status } = req.params;
    const { hotelId, startDate, endDate, page = 1, pageSize = 10 } = req.query;

    if (!status) {
      return res.status(400).json({ message: 'Fields are required' });
    }

    const { rdata, error } = await getAdminBookingsStatus(
      hotelId,
      status,
      startDate,
      endDate,
      page,
      pageSize
    );

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching customer bookings:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during fetching bookings' });
  }
};
