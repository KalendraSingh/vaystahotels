import prisma from '../../config/db.js';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import {
  generateFullPaymentLink,
  generatePartialPaymentLink,
} from './generatePayment.js';
import sendMail from '../../middleware/verifyEmail.js';
import customer from '../../routes/customer/index.js';

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createCustomerPayment = async ({
  customerId,
  roomSelections,
  startDate,
  endDate,
  payAmount,
  hotelId,
}) => {
  console.log('Room Selections:', roomSelections);
  try {
    let roomDetailsArray = [];

    // Check room availability before creating the booking and payment order
    for (const selection of roomSelections) {
      const { roomCategoryId, roomCount, adultCount, categoryName } = selection;

      const roomCategory = await prisma.roomCategory.findUnique({
        where: { id: roomCategoryId },
        select: {
          price: true,
          discount: true,
          perGuestPrice: true,
          adultCount: true,
        },
      });

      if (!roomCategory) {
        return {
          rdata: null,
          rerror: {
            status: 404,
            message: `Room category not found for ID ${roomCategoryId}`,
          },
        };
      }

      // Check available rooms for each room category
      const availableRooms = await prisma.room.findMany({
        where: {
          roomCategoryId: roomCategoryId,
          isAvailable: true,
        },
        take: roomCount,
      });

      if (availableRooms.length < roomCount) {
        return {
          rdata: null,
          rerror: {
            status: 400,
            message: `Not enough rooms available for room category ${roomCategoryId}`,
          },
        };
      }

      roomDetailsArray.push({
        roomCategoryId,
        roomCount,
        adultCount,
        categoryName,
      });
    }

    if (!payAmount) {
      return {
        rdata: null,
        rerror: { status: 400, message: 'Invalid total amount' },
      };
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        customerId,
        hotelId,
        checkIn: new Date(startDate),
        checkOut: new Date(endDate),
        roomDetails: roomDetailsArray,
        status: 'PENDING',
        adultCount: roomSelections.reduce(
          (total, selection) => total + selection.adultCount,
          0
        ),
        roomCount: roomSelections.reduce(
          (total, selection) => total + selection.roomCount,
          0
        ),
      },
    });

    const truncatedBookingId = booking.id.slice(0, 20);
    const receiptId = `receipt_${truncatedBookingId}`;

    // Create Razorpay order
    const razorpayOrder = await razorpay.orders.create({
      amount: parseInt(payAmount * 100), // converting to paise
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1,
    });

    // Prepare response data

    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      bookingId: booking.id,
    };

    return {
      rdata: data,
      rerror: null,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const verifyPayment = async ({
  orderId,
  paymentId,
  signature,
  bookingId,
  amount,
  discountAmount,
  gstAmount,
}) => {
  try {
    // Generate Razorpay signature and compare it
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'FAILED' },
      });

      await prisma.payment.create({
        data: {
          amount: parseFloat(amount) / 100,
          method: 'Razorpay',
          bookingId,
          discountAmount,
          gstAmount,
          status: 'FAILED',
        },
      });

      return {
        rdata: null,
        rerror: { status: 400, message: 'Invalid payment signature' },
      };
    }

    const bookingDetails = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!bookingDetails) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Booking not found' },
      };
    }

    // After payment verification, ensure rooms are still available
    for (const room of bookingDetails.roomDetails) {
      const availableRooms = await prisma.room.findMany({
        where: {
          roomCategoryId: room.roomCategoryId,
          isAvailable: true,
        },
        take: room.roomCount,
      });

      if (availableRooms.length < room.roomCount) {
        await prisma.booking.update({
          where: { id: bookingId },
          data: { status: 'FAILED' },
        });

        return {
          rdata: null,
          rerror: {
            status: 400,
            message:
              'Not enough rooms available for room category ' +
              room.roomCategoryId,
          },
        };
      }

      const roomIds = availableRooms.map((room) => room.id);
      // Mark rooms as unavailable after successful payment
      await prisma.room.updateMany({
        where: { id: { in: roomIds } },
        data: { isAvailable: false },
      });
    }

    // Update booking status to 'CONFIRMED'
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CONFIRMED',
      },
    });

    const amountInRupees = parseFloat(amount) / 100;

    // Create a payment entry with the status 'PAID'
    const payment = await prisma.payment.create({
      data: {
        amount: amountInRupees,
        method: 'Razorpay',
        bookingId,
        discountAmount,
        gstAmount,
        paid_amount: amountInRupees,
        due_amount: 0,
        status: 'PAID', // Payment successful
      },
    });

    if (payment) {
      await prisma.cartItem.deleteMany({
        where: {
          customerId: updatedBooking.customerId,
        },
      });
    }

    const UpdatedBookingDetails = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    // Extract room selections
    const roomSelections = UpdatedBookingDetails.roomDetails;

    // Get total adult count
    const totalAdults = roomSelections.reduce(
      (sum, room) => sum + room.adultCount,
      0
    );

    // Get category names
    const categoryNames = roomSelections
      .map((room) => room.categoryName)
      .join(', ');

    // Get total room count
    const totalRooms = roomSelections.reduce(
      (sum, room) => sum + room.roomCount,
      0
    );

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'short', weekday: 'short' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const checkInDate = formatDate(UpdatedBookingDetails.checkIn);
    const checkOutDate = formatDate(UpdatedBookingDetails.checkOut);

    const paymentDetails = await prisma.payment.findFirst({
      where: { bookingId },
    });

    const hotelDetails = await prisma.hotel.findUnique({
      where: { id: UpdatedBookingDetails.hotelId },
    });

    const customerDetails = await prisma.customer.findUnique({
      where: {
        id: UpdatedBookingDetails.customerId,
      },
    });

    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
      font-family: Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .header {
      background-color: #f86800;
      color: white;
      padding: 10px;
      text-align: left;
    }
    .container {
      padding: 20px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      padding: 20px;
    }
    .text-center {
      text-align: center;
    }
    .button {
      background-color: #f86800;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 10px;
    }
    .button:hover {
      background-color: #f86800;
    }
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .image {
      width: 100%;
      border-radius: 8px;
      max-height: 200px;
      object-fit: cover;
    }
    .text-gray {
      color: #6b7280;
    }
    .text-green {
      color: #10b981;
    }
    .text-red {
      color: #ef4444;
    }
    .text-blue {
      color: #3b82f6;
    }
    .pricing-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      gap:2;
    }
    .pricing-total {
      font-weight: bold;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }
      </style>
    </head>
    <body>
  <div class="header">
    <span>Vaysta Hotels</span>
  </div>
  <div class="container">
    <!-- Confirmation Section -->
    <div class="card text-center">
      <img src="https://res.cloudinary.com/sangamjone/image/upload/v1731863578/Img/wirewings/AoneHotel/check_bdadgv.png" alt="Check Icon" width="64" />

      <p><strong>Congratulations ${customerDetails.name}</strong></p>
      <p>Your booking is confirmed</p>
      <div class="text-green">Booking ID:${bookingId}</div>
    </div>

    <!-- Hotel Details -->
    <div class="card">
      <div class="flex">
        <div>
          <h4>${hotelDetails.name}</h4>
          <p class="text-gray">${hotelDetails.location}</p>
        </div>
      </div>
      <img src=${hotelDetails.bannerImage} alt="Hotel Room" class="image" />
    </div>

    <!-- Booking Details -->
    <div class="card">
      <h3>Booking Details</h3>
      <div class="flex">
        <div>
          <p class="text-gray">CHECK IN</p>
          <p><strong>${checkInDate} | </strong></p>
        </div>
        <div>
          <p class="text-gray">CHECK OUT</p>
          <p> <strong> ${checkOutDate}</strong></p>
        </div>
      </div>
      <p class="text-gray">INCLUDES </p>
      <p>${totalRooms} , ${categoryNames}</p>
      <p>Total Guest ${totalAdults}</p>
    </div>

    <!-- Pricing Details -->
    <div class="card">
      <h3>Pricing Details</h3>
      <div class="pricing-row">
        <span>Booking Price : </span>
        <span> ₹ ${
          parseInt(paymentDetails.amount) +
          parseInt(paymentDetails.discountAmount) -
          parseInt(paymentDetails.gstAmount)
        }</span>
      </div>
      <div class="pricing-row text-green">
        <span>Discount : </span>
        <span> - ₹ ${parseInt(paymentDetails.discountAmount)}</span>
      </div>
      <div class="pricing-row">
        <span>Discounted Price : </span>
        <span>  ₹ ${
          parseInt(paymentDetails.amount) - parseInt(paymentDetails.gstAmount)
        }</span>
      </div>
      <div class="pricing-row">
        <span>GST : </span>
        <span>  ₹ ${parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row pricing-total">
        <span> AMOUNT  PAID  : </span>
        <span>  ₹ ${parseInt(paymentDetails.paid_amount)}</span>
      </div>
    </div>
  </div>
</body>
    </html>
  `;

    const emailOptions = {
      email: customerDetails.email,
      subject: `Booking Confirmation`,
      message: emailContent,
    };

    await sendMail(emailOptions);

    return {
      rdata: { booking: updatedBooking, payment },
      rerror: null,
    };
  } catch (error) {
    console.error('Error verifying payment:', error);

    // Ensure booking status is set to FAILED in case of an error
    await prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'FAILED' },
    });

    await prisma.payment.create({
      data: {
        amount: parseFloat(amount) / 100,
        method: 'Razorpay',
        bookingId,
        discountAmount,
        gstAmount,
        status: 'FAILED',
      },
    });

    return {
      rdata: null,
      rerror: { status: 500, message: 'Error verifying payment' },
    };
  }
};

export const retryPayment = async (bookingId) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        roomCategory: true,
      },
    });

    if (!booking || booking.status !== 'FAILED') {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Booking not found or cannot be retried',
        },
      };
    }

    const totalGuests = parseInt(booking.adultCount);
    let extraGuestCharges = 0;

    if (totalGuests > 1 && booking.roomCategory.perGuestPrice) {
      const extraGuests = totalGuests - 1;
      extraGuestCharges =
        parseFloat(booking.roomCategory.perGuestPrice) * extraGuests;
    }

    const finalAmount =
      parseFloat(booking.roomCategory.price) + extraGuestCharges;

    const truncatedBookingId = booking.id.slice(0, 20);
    const receiptId = `retry_receipt_${truncatedBookingId}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: parseFloat(finalAmount) * 100,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1,
    });

    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      bookingId: booking.id,
    };

    return {
      rdata: data,
      rerror: null,
    };
  } catch (error) {
    console.error('Error retrying payment:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error retrying payment' },
    };
  }
};

export const checkIn = async (bookingId) => {
  try {
    const isBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!isBooking) {
      return { rdata: null, error: 'Booking not found' };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CHECKED_IN',
        checkIn: new Date(),
      },
    });

    return { rdata: booking, error: null };
  } catch (error) {
    console.error('Error during check-in:', error);
    return { rdata: null, error: 'Error during check-in' };
  }
};

// Check-out service
export const checkOut = async (bookingId) => {
  try {
    const isBooking = await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

    if (!isBooking) {
      return { rdata: null, error: 'Booking not found' };
    }

    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CHECKED_OUT',
        checkOut: new Date(),
      },
    });

    const roomCategoryIds = isBooking.roomDetails.map(
      (room) => room.roomCategoryId
    );

    await prisma.room.updateMany({
      where: {
        roomCategoryId: { in: roomCategoryIds },
        isAvailable: false,
      },
      data: {
        isAvailable: true,
      },
    });
    return { rdata: booking, error: null };
  } catch (error) {
    console.error('Error during check-out:', error);
    return { rdata: null, error: 'Error during check-out' };
  }
};

// Cancel booking service

export const cancelBooking = async (bookingId, reason) => {
  try {
    // Find the booking by ID
    const existBooking = await prisma.booking.findFirst({
      where: { id: bookingId },
    });

    console.log(existBooking);

    if (!existBooking) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Booking not found' },
      };
    }

    // Update the booking status and cancellation reason
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'CANCELED',
        cancelReason: reason,
      },
    });

    const roomCategoryIds = existBooking.roomDetails.map(
      (room) => room.roomCategoryId
    );

    await prisma.room.updateMany({
      where: {
        roomCategoryId: { in: roomCategoryIds },
        isAvailable: false,
      },
      data: {
        isAvailable: true,
      },
    });

    return { rdata: booking, error: null };
  } catch (error) {
    console.error('Error during booking cancellation:', error);
    return { rdata: null, error: 'Error during booking cancellation' };
  }
};

export const createCustomerBookingAtHotel = async ({
  customerId,
  roomSelections,
  startDate,
  endDate,
  totalAmount,
  payAmount,
  amountWithGst,
  totalDiscount,
  hotelId,
}) => {
  try {
    if (!payAmount || !customerId || !hotelId) {
      return {
        rdata: null,
        rerror: { status: 400, message: 'Invalid input parameters' },
      };
    }

    let roomDetailsArray = [];

    for (const selection of roomSelections) {
      const { roomCategoryId, roomCount, adultCount, categoryName } = selection;

      const roomCategory = await prisma.roomCategory.findUnique({
        where: { id: roomCategoryId },
        select: {
          price: true,
          discount: true,
          perGuestPrice: true,
          adultCount: true,
        },
      });

      if (!roomCategory) {
        return {
          rdata: null,
          rerror: {
            status: 404,
            message: `Room category not found for ID ${roomCategoryId}`,
          },
        };
      }

      const availableRooms = await prisma.room.findMany({
        where: { roomCategoryId, isAvailable: true },
        take: roomCount,
      });

      if (availableRooms.length < roomCount) {
        return {
          rdata: null,
          rerror: {
            status: 400,
            message: `Not enough rooms available for room category ${roomCategoryId}`,
          },
        };
      }

      roomDetailsArray.push({
        roomCategoryId,
        roomCount,
        adultCount,
        categoryName,
      });
    }

    const booking = await prisma.booking.create({
      data: {
        customerId,
        hotelId,
        checkIn: new Date(startDate),
        checkOut: new Date(endDate),
        roomDetails: roomDetailsArray,
        status: 'PENDING',
        adultCount: roomSelections.reduce(
          (total, selection) => total + selection.adultCount,
          0
        ),
        roomCount: roomSelections.reduce(
          (total, selection) => total + selection.roomCount,
          0
        ),
      },
    });

    console.log('Booking:', booking);

    if (!booking) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Booking creation failed' },
      };
    }

    for (const room of booking.roomDetails) {
      const availableRooms = await prisma.room.findMany({
        where: { roomCategoryId: room.roomCategoryId, isAvailable: true },
        take: room.roomCount,
      });

      if (availableRooms.length < room.roomCount) {
        await prisma.booking.update({
          where: { id: booking.id },
          data: { status: 'FAILED' },
        });

        return {
          rdata: null,
          rerror: {
            status: 400,
            message: `Not enough rooms available for room category ${room.roomCategoryId}`,
          },
        };
      }

      const roomIds = availableRooms.map((room) => room.id);
      await prisma.room.updateMany({
        where: { id: { in: roomIds } },
        data: { isAvailable: false },
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    });

    const payment = await prisma.payment.create({
      data: {
        amount: parseFloat(totalAmount),
        method: 'Razorpay',
        paid_amount: 0,
        due_amount: parseFloat(payAmount),
        bookingId: updatedBooking.id,
        discountAmount: parseFloat(totalDiscount),
        gstAmount: parseFloat(amountWithGst),
        status: 'PENDING',
      },
    });

    if (payment) {
      await prisma.cartItem.deleteMany({
        where: { customerId: updatedBooking.customerId },
      });
    }

    const UpdatedBookingDetails = await prisma.booking.findUnique({
      where: { id: updatedBooking.id },
    });

    // // Extract room selections
    // const roomSelections = UpdatedBookingDetails.roomDetails;

    // Get total adult count
    const totalAdults = roomSelections.reduce(
      (sum, room) => sum + room.adultCount,
      0
    );

    // Get category names
    const categoryNames = roomSelections
      .map((room) => room.categoryName)
      .join(', ');

    // Get total room count
    const totalRooms = roomSelections.reduce(
      (sum, room) => sum + room.roomCount,
      0
    );

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: '2-digit', month: 'short', weekday: 'short' };
      return new Intl.DateTimeFormat('en-US', options).format(date);
    };

    const checkInDate = formatDate(UpdatedBookingDetails.checkIn);
    const checkOutDate = formatDate(UpdatedBookingDetails.checkOut);

    const paymentDetails = await prisma.payment.findFirst({
      where: { bookingId: updatedBooking.id },
    });

    const hotelDetails = await prisma.hotel.findUnique({
      where: { id: UpdatedBookingDetails.hotelId },
    });

    const customerDetails = await prisma.customer.findUnique({
      where: {
        id: UpdatedBookingDetails.customerId,
      },
    });

    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
      font-family: Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      width:40%;
    }
    .header {
      background-color: #f86800;
      color: white;
      padding: 10px;
      text-align: left;
    }
    .container {
      padding: 20px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      padding: 20px;
    }
    .text-center {
      text-align: center;
    }
    .button {
      background-color: #f86800;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 10px;
    }
    .button:hover {
      background-color: #f86800;
    }
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .image {
      width: 100%;
      border-radius: 8px;
      max-height: 200px;
      object-fit: cover;
    }
    .text-gray {
      color: #6b7280;
    }
    .text-green {
      color: #10b981;
    }
    .text-red {
      color: #ef4444;
    }
    .text-blue {
      color: #3b82f6;
    }
    .pricing-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      gap:2;
    }
    .pricing-total {
      font-weight: bold;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }
      </style>
    </head>
<body>
  <div class="header">
    <span>Vaysta Hotels</span>
  </div>
  <div class="container">
    <!-- Confirmation Section -->
    <div class="card text-center">
      <img src="https://res.cloudinary.com/sangamjone/image/upload/v1731863578/Img/wirewings/AoneHotel/check_bdadgv.png" alt="Check Icon" width="64" />

      <p><strong>Congratulations ${customerDetails.name}</strong></p>
      <p>Your booking is confirmed</p>
      <div class="text-green">Booking ID:${updatedBooking.id}</div>
    </div>

    <!-- Hotel Details -->
    <div class="card">
      <div class="flex">
        <div>
          <h4>${hotelDetails.name}</h4>
          <p class="text-gray">${hotelDetails.location}</p>
        </div>
      </div>
      <img src=${hotelDetails.bannerImage} alt="Hotel Room" class="image" />
    </div>

    <!-- Booking Details -->
    <div class="card">
      <h3>Booking Details</h3>
      <div class="flex">
        <div>
          <p class="text-gray">CHECK IN</p>
          <p><strong>${checkInDate} | </strong></p>
        </div>
        <div>
          <p class="text-gray">CHECK OUT</p>
          <p> <strong> ${checkOutDate}</strong></p>
        </div>
      </div>
      <p class="text-gray">INCLUDES </p>
      <p>${totalRooms} , ${categoryNames}</p>
      <p>Total Guest ${totalAdults}</p>
    </div>

    <!-- Pricing Details -->
    <div class="card">
      <h3>Pricing Details</h3>
      <div class="pricing-row">
        <span>Booking Price : </span>
        <span> ₹ ${
          parseInt(paymentDetails.due_amount) +
          parseInt(paymentDetails.discountAmount) -
          parseInt(paymentDetails.gstAmount)
        }</span>
      </div>
      <div class="pricing-row text-green">
        <span>Discount : </span>
        <span> - ₹ ${parseInt(paymentDetails.discountAmount)}</span>
      </div>
      <div class="pricing-row">
        <span>Discounted Price : </span>
        <span>  ₹ ${
          parseInt(paymentDetails.due_amount) -
          parseInt(paymentDetails.gstAmount)
        }</span>
      </div>
      <div class="pricing-row">
        <span>GST : </span>
        <span>  ₹ ${parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row pricing-total">
        <span> AMOUNT TO BE PAID  : </span>
        <span>  ₹ ${parseInt(paymentDetails.due_amount)}</span>
      </div>
    </div>
  </div>
</body>
    </html>
  `;

    const emailOptions = {
      email: customerDetails.email,
      subject: `Booking Confirmation`,
      message: emailContent,
    };

    await sendMail(emailOptions);

    return {
      rdata: { booking: updatedBooking, payment },
      rerror: null,
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Rest of the functions remain unchanged but make sure each function consistently validates essential parameters as shown above.

export const createPaymentAtHotel = async ({ bookingId, dueAmount }) => {
  try {
    if (!dueAmount || dueAmount <= 0) {
      throw new Error('Invalid due amount.');
    }

    const truncatedBookingId = bookingId.slice(0, 20);
    const receiptId = `receipt_${truncatedBookingId}`;

    const razorpayOrder = await razorpay.orders.create({
      amount: dueAmount * 100,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1,
    });

    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      bookingId: bookingId,
    };

    return {
      rdata: data,
      rerror: null,
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const verifyDuePayment = async ({
  orderId,
  paymentId,
  signature,
  bookingId,
  amount,
}) => {
  try {
    const paymentRecord = await prisma.payment.findFirst({
      where: { bookingId },
    });

    if (!paymentRecord) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Payment record not found' },
      };
    }

    const bookingDetails = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!bookingDetails) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Booking not found' },
      };
    }

    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      await prisma.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'FAILED',
        },
      });

      return {
        rdata: null,
        rerror: { status: 400, message: 'Invalid payment signature' },
      };
    }

    const amountInRupees = parseFloat(amount) / 100;

    const payment = await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        paid_amount: amountInRupees,
        due_amount: 0,
        method: 'Razorpay',
        status: 'PAID',
      },
    });

    return {
      rdata: { payment },
      rerror: null,
    };
  } catch (error) {
    console.error('Error verifying payment:', error);

    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: 'FAILED',
      },
    });

    return {
      rdata: null,
      rerror: { status: 500, message: 'Error verifying payment' },
    };
  }
};
