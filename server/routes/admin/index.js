import { Router } from 'express';
import staffAuthRoute from './staff/authRoutes.js';
import staffRoute from './staff/staffRoutes.js';
import roleRoutes from './staff/roleRoutes.js';
import permitedRoutes from './permitedRoutes/permitedRoutes.js';
import hotelRoutes from './hotel/hotelRoutes.js';
import hotelAmenitiesRoutes from './hotel/hotelAmenitiesRoutes.js';
import hotelRoomRoutes from './hotel/hotelRoomRoutes.js';
import hotelRoomAmenitiesRoutes from './hotel/hotelRoomAmenitiesRoutes.js';
import ratingRoutes from './hotel/hotelRatingRoutes.js';
import customerRoutes from './customer/customerRoutes.js';
import vendorRoutes from './vendor/vendorRoutes.js';
import bookingRoutes from './bookings/bookingRoutes.js';
import inquiryRoutes from './inquiry/inquiryRoutes.js';
import chartDataRoutes from './ChartData/chartDataRoutes.js';

const router = Router();

router
  .use('/role', roleRoutes)
  .use('/staff', staffRoute)
  .use('/customer', customerRoutes)
  .use('/vendor', vendorRoutes)
  .use('/bookings', bookingRoutes)
  .use('/staff/auth', staffAuthRoute)
  .use('/staff/permission', permitedRoutes)
  .use('/hotel', hotelRoutes)
  .use('/hotel/rating', ratingRoutes)
  .use('/hotel/amenities', hotelAmenitiesRoutes)
  .use('/room/amenities', hotelRoomAmenitiesRoutes)
  .use('/hotel/room', hotelRoomRoutes)
  .use('/inquiry', inquiryRoutes)
  .use('/chartData', chartDataRoutes);

export default router;
