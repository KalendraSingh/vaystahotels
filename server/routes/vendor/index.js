import { Router } from 'express';
import vendorAuthRoutes from './vendorAuthRoutes.js';
import vendorVerificationRoutes from './vendorVerificationRoutes.js';
import vendorRoutes from './vendorRoutes.js';
import vendorHotelRoutes from './vendorHotelRoutes.js';
import vendorHotelRoomRoutes from './vendorHotelRoomRoutes.js';
import vendorHotelAmenitiesRoutes from './vendorHotelAmenitiesRoutes.js';
import vendorHotelRoomAmenitiesRoutes from './vendorHotelRoomAmenitiesRoutes.js';
import vendorPaymentRoutes from './vendorPaymentRoutes.js';
import vendorHotelBookingsRoute from './vendorHotelBookingsRoutes.js';
import vendorKycRoutes from './vendorKycRoutes.js';
import vendorNotificationRoutes from './vendorNotificationRoutes.js';
import vendorStaffRoutes from './vendorStaffRoutes.js';

const router = Router();

export default router
  .use('/auth', vendorAuthRoutes)
  .use('/staff', vendorStaffRoutes)
  .use('/bankKyc', vendorKycRoutes)
  .use('/verification', vendorVerificationRoutes)
  .use('/profile', vendorRoutes)
  .use('/hotel', vendorHotelRoutes)
  .use('/auth/hotel', vendorPaymentRoutes)
  .use('/hotel/room', vendorHotelRoomRoutes)
  .use('/hotel/hotelAmenities', vendorHotelAmenitiesRoutes)
  .use('/hotel/roomAmenities', vendorHotelRoomAmenitiesRoutes)
  .use('/hotelBooking', vendorHotelBookingsRoute)
  .use('/notification', vendorNotificationRoutes);
