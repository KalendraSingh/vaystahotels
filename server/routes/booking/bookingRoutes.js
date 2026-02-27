import {
  customerCancelBookingController,
  customerCheckInController,
  customerCheckOutController,
  customerPaymentController,
  customerPaymentVerificationController,
  retryPaymentController,
  addNewGuestController,
  getAllGuestsController,
  updateGuestController,
  getGuestByIdController,
  deleteGuestController,
  createAtHotelBookingController,
  verifyDuePaymentController,
  createPaymentAtHotelController,
} from '../../modules/customerModule/Booking/customeBookingController.js';

import {
  getAllCustomerBookigsController,
  getBookingByBookingIdController,
  getCustomerBookingsStatusController,
} from '../../modules/customerModule/Booking/customeBookingController.js';
import {
  addToCartController,
  viewCartController,
  decreaseCartController,
  removeFromCartController,
  calculateCartAmountsController,
  increaseCartController,
} from '../../modules/customerModule/Booking/BookingCartConroller.js';

import { Router } from 'express';
const router = Router();

export default router

  .post('/customer/payment', customerPaymentController)
  .post('/customer/payment/verification', customerPaymentVerificationController)
  .post('/customer/bookingAtHotel', createAtHotelBookingController)
  .post('/customer/payment/atHotel', createPaymentAtHotelController)
  .post('/customer/payment/verification/atHotel', verifyDuePaymentController)
  .post('/customer/payment/retry', retryPaymentController)
  .post('/customer/payment/cancel', customerCancelBookingController)
  .post('/customer/payment/checkIn', customerCheckInController)
  .post('/customer/payment/checkOut', customerCheckOutController)
  
  .post('/customer/bookings', getAllCustomerBookigsController)
  .get('/customer/booking/:bookingId', getBookingByBookingIdController)
  .get(
    '/customer/bookings/:customerId/:status',
    getCustomerBookingsStatusController
  )
  .post('/addNewGuest', addNewGuestController)
  .get('/getAllGuest', getAllGuestsController)
  .get('/getGuestById/:id', getGuestByIdController)
  .patch('/updateGuest/:id', updateGuestController)
  .delete('/dleteGuest/:id', deleteGuestController)

  .post('/addtoCart', addToCartController)
  .patch('/decreaseCartRoom', decreaseCartController)
  .patch('/increaseCartRoom', increaseCartController)
  .post('/removeCartRoom', removeFromCartController)
  .post('/getRoomCart', viewCartController);
