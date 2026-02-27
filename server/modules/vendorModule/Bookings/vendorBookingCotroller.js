import {
  getVendorHotelBookings,
  getAllVendorHotelRatingsService,
  getNewestBookingService,
  getCheckInOutOfTheDayService,
  getAllCheckInOutService,
  getAllAvailableRoomsService,
  getBookingStatusOfTheDayService,
  getTotalBookingStatusService,
  getTodayCheckInsService,
  getTodayCheckOutsService,
  vendorInventoryService,
  getBookingByBookingId,
  getVendorBookingsStatus,
  getVendorBookingSummary,
  getVendorBookingChartData,
} from './vendorBookingService.js';

export const getAllVendorHotelBookigsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getVendorHotelBookings(vendorId);

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

export const getAllVendorHotelRatingsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getAllVendorHotelRatingsService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching hotel ratings:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during fetching hotel ratings' });
  }
};

export const getNewestBookingController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getNewestBookingService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching newest booking:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during fetching newest booking' });
  }
};
// Controller for fetching bookings with status CHECKED_IN and CHECKED_OUT of the day
export const getCheckInOutOfTheDayController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getCheckInOutOfTheDayService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error(
      'Error during fetching check-in and check-out of the day:',
      error
    );
    res.status(500).json({
      message:
        'Something went wrong during fetching check-in and check-out of the day',
    });
  }
};

// Controller for fetching all check-ins and check-outs
export const getAllCheckInOutController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getAllCheckInOutService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching all check-in and check-out:', error);
    res.status(500).json({
      message:
        'Something went wrong during fetching all check-in and check-out',
    });
  }
};

export const getAllAvailableRoomsController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getAllAvailableRoomsService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching available rooms:', error);
    res.status(500).json({
      message: 'Something went wrong during fetching available rooms',
    });
  }
};

// Controller to get booking status of the day
export const getBookingStatusOfTheDayController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getBookingStatusOfTheDayService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching booking status of the day:', error);
    res.status(500).json({
      message: 'Something went wrong during fetching booking status of the day',
    });
  }
};

// Controller to get total booking status
export const getAllBookingStatusController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getTotalBookingStatusService(vendorId);

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching total booking status:', error);
    res.status(500).json({
      message: 'Something went wrong during fetching total booking status',
    });
  }
};

export const getTodayCheckInsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search, hotelId, date } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getTodayCheckInsService(
      vendorId,
      search,
      hotelId,
      date
    );

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching check-ins of the day:', error);
    res.status(500).json({
      message: 'Something went wrong during fetching check-ins of the day',
    });
  }
};

export const getTodayCheckOutsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search, hotelId, date } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, error } = await getTodayCheckOutsService(
      vendorId,
      search,
      hotelId,
      date
    );

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error during fetching checkouts of the day:', error);
    res.status(500).json({
      message: 'Something went wrong during fetching checkouts of the day',
    });
  }
};

export const vendorInventoryController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { filter } = req.query;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { rdata, count, error } = await vendorInventoryService(
      vendorId,
      filter
    );

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json({ count, details: rdata });
  } catch (error) {
    console.error('Error fetching inventory:', error);
    return res.status(500).json({
      message: 'Something went wrong while fetching the inventory',
    });
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

export const getVendorBookingsStatusController = async (req, res) => {
  try {
    const { hotelId, status } = req.params;
    const { date } = req.query;

    if (!hotelId || !status) {
      return res.status(400).json({ message: 'fileds  are required' });
    }

    const { rdata, error } = await getVendorBookingsStatus(
      hotelId,
      status,
      date
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

export const getVendorBookingSummaryController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const summaryData = await getVendorBookingSummary(vendorId);

    if (summaryData) {
      res.status(200).json(summaryData);
    } else {
      res.status(404).json({ message: 'No booking summary found' });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch booking summary',
      error: error.message,
    });
  }
};

export const getVendorBookingChartDataController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    if (!vendorId) {
      return res.status(400).json({ message: 'Vendor ID is required' });
    }

    const { weeklyData, monthlyData, error } = await getVendorBookingChartData(
      vendorId
    );

    if (error) {
      return res.status(500).json({ message: error });
    }

    return res.status(200).json({ weeklyData, monthlyData });
  } catch (error) {
    console.error('Error during getting booking:', error);
    res
      .status(500)
      .json({ message: 'Something went wrong during booking details' });
  }
};
