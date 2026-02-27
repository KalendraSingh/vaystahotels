import {
  getAllVendorHotelBookigsController,
  getAllVendorHotelRatingsController,
  getNewestBookingController,
  getCheckInOutOfTheDayController,
  getAllCheckInOutController,
  getAllAvailableRoomsController,
  getBookingStatusOfTheDayController,
  getAllBookingStatusController,
  getTodayCheckInsController,
  getTodayCheckOutsController,
  vendorInventoryController,
  getVendorBookingsStatusController,
  getBookingByBookingIdController,
  getVendorBookingSummaryController,
  getVendorBookingChartDataController,
} from '../../modules/vendorModule/Bookings/vendorBookingCotroller.js';

import { Router } from 'express';

const router = Router();

export default router

  .get('/getHotelBookings/:vendorId', getAllVendorHotelBookigsController)
  .get('/getHotelRatings/:vendorId', getAllVendorHotelRatingsController)
  .get('/getHotelNewestBookings/:vendorId', getNewestBookingController)
  .get('/getCheckInCheckoutCurrent/:vendorId', getCheckInOutOfTheDayController)
  .get('/getAllCheckInCheckout/:vendorId', getAllCheckInOutController)
  .get('/getAllAvailableRooms/:vendorId', getAllAvailableRoomsController)
  .get(
    '/getBookingStatusOftheDay/:vendorId',
    getBookingStatusOfTheDayController
  )
  .get('/getTodaysCheckIns/:vendorId', getTodayCheckInsController)
  .get('/getTodaysCheckOuts/:vendorId', getTodayCheckOutsController)
  .get('/vendorInventory/:vendorId', vendorInventoryController)

  .get(
    '/getVendorBookingsByStatus/:hotelId/:status',
    getVendorBookingsStatusController
  )
  .get('/getVendorBookingById/:bookingId', getBookingByBookingIdController)

  .get('/getBookingSummary/:vendorId', getVendorBookingSummaryController)

  .get('/getBookingsChartData/:vendorId', getVendorBookingChartDataController);
