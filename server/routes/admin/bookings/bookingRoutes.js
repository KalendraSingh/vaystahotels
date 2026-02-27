import { Router } from 'express';

import {
  getBookingByBookingIdController,
  getAdminBookingsStatusController,
  getAllBookingsController,
} from '../../../modules/adminModule/booking/bookingController.js';

const router = Router();

export default router
  .get('/getAllBookings', getAllBookingsController)

  .get('/getBookingById/:bookingId', getBookingByBookingIdController)

  .get('/getBookingsByStatus/:status', getAdminBookingsStatusController);
