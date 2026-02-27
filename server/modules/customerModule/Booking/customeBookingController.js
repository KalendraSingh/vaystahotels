import {
  createCustomerPayment,
  verifyPayment,
  retryPayment,
  checkIn,
  checkOut,
  cancelBooking,
  createCustomerBookingAtHotel,
  createPaymentAtHotel,
  verifyDuePayment,
} from '../../payment/customerPaymentService.js';

import {
  getAllGuests,
  updateGuest,
  deleteGuest,
  getGuestById,
  createGuest,
} from '../../booking/bookingService.js';

import {
  getCustomerBookings,
  getBookingByBookingId,
  getCustomerBookingsStatus,
} from './customerBookingService.js';

import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const customerPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'customerId',
      'startDate',
      'endDate',
      'payAmount',
      'hotelId',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await createCustomerPayment(data);

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error during customer payment:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const customerPaymentVerificationController = async (req, res) => {
  console.log(req.body);
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'orderId',
      'paymentId',
      'signature',
      'bookingId',
      'amount',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }
    console.log(data);

    const { rdata, rerror } = await verifyPayment(data);

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during customer payment verification:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const retryPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'bookingId',
      'amount',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await retryPayment(data);
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during payment retry:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Customer Check-In Controller
export const customerCheckInController = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const { rdata, error } = await checkIn(bookingId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during check-in:', error);
    res.status(500).json({ message: 'Something went wrong during check-in' });
  }
};

// Customer Check-Out Controller
export const customerCheckOutController = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const { rdata, error } = await checkOut(bookingId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during check-out:', error);
    res.status(500).json({ message: 'Something went wrong during check-out' });
  }
};

// Customer Cancel Booking Controller
export const customerCancelBookingController = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;

    if (!bookingId || !reason) {
      return res
        .status(400)
        .json({ message: 'Booking ID and Reason is required' });
    }

    const { rdata, error } = await cancelBooking(bookingId, reason);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during booking cancellation:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during cancellation' });
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

export const getCustomerBookingsStatusController = async (req, res) => {
  try {
    const { customerId, status } = req.params;

    if (!customerId) {
      return res.status(400).json({ message: 'Customer ID is required' });
    }

    const { rdata, error } = await getCustomerBookingsStatus(
      customerId,
      status
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

export const getAllCustomerBookigsController = async (req, res) => {
  try {
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: 'Booking ID is required' });
    }

    const { rdata, error } = await getCustomerBookings(customerId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during getting booking :', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during booking details' });
  }
};

// Create booking at hotel
export const createAtHotelBookingController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'customerId',
      'startDate',
      'endDate',
      'hotelId',
      'payAmount',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await createCustomerBookingAtHotel(data);

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error during customer payment:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

//Create payment for due amount

export const createPaymentAtHotelController = async (req, res) => {
  const { dueAmount, bookingId } = req.body;

  const { rdata, rerror } = await createPaymentAtHotel({
    dueAmount,
    bookingId,
  });

  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  res.status(200).json(rdata);
};

// Verify payment and confirm booking

export const verifyDuePaymentController = async (req, res) => {
  const { orderId, paymentId, signature, bookingId, amount } = req.body;

  const { rdata, rerror } = await verifyDuePayment({
    orderId,
    paymentId,
    signature,
    bookingId,
    amount,
  });

  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }

  res.status(200).json(rdata);
};

//Guest details submissions

export const addNewGuestController = async (req, res) => {
  try {
    const guestData = { ...req.body };
    const { rdata, rerror } = await createGuest(guestData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating guest:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get all Guests
export const getAllGuestsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllGuests();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting all guests:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get a Guest by ID
export const getGuestByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await getGuestById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting guest by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Update Guest by ID
export const updateGuestController = async (req, res) => {
  const { id } = req.params;
  const guestData = { ...req.body };

  try {
    const { rdata, rerror } = await updateGuest(id, guestData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updating guest:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete Guest by ID
export const deleteGuestController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteGuest(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting guest:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
