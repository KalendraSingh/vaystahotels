import prisma from '../../config/db.js';
import verifyToken from '../../middleware/verifyToken.js';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import sendMail from '../../middleware/verifyEmail.js';

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createVendorPayment = async ({
  vendorId,
  hotelId,
  paymentAmount,
}) => {
  if (paymentAmount !== 15000) {
    return {
      rdata: null,
      rerror: { status: 400, message: 'Invalid payment amount' },
    };
  }

  try {
    const truncatedHotelId = hotelId.slice(0, 20);
    const receiptId = `receipt_${truncatedHotelId}`;

    const options = {
      amount: paymentAmount * 100,
      currency: 'INR',
      receipt: receiptId,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    const payment = await prisma.vendorPayment.create({
      data: {
        vendorId,
        amount: paymentAmount,
        isPaid: false,
        hotelId,
      },
    });

    return {
      rdata: { order, paymentId: payment.id },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in createVendorPayment:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const verifyVendorPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  vendorId,
  hotelId,
}) => {
  try {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      await prisma.vendorPayment.update({
        where: { vendorId: vendorId },
        data: { status: 'FAILED' },
      });

      return {
        rdata: null,
        rerror: { status: 400, message: 'Invalid payment signature' },
      };
    }

    const payment = await prisma.vendorPayment.findFirst({
      where: { hotelId, isPaid: false },
    });

    if (!payment) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Payment record not found' },
      };
    }
    await prisma.vendorPayment.update({
      where: { id: payment.id },
      data: { isPaid: true, status: 'PAID', method: 'Razorpay' },
    });

    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { isPaid: true },
    });

    return {
      rdata: {
        message: 'Payment verified and hotel sent for review!',
        hotel: updatedHotel,
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in verify Vendor Payment:', error);
    await prisma.vendorPayment.update({
      where: { vendorId: vendorId },
      data: { status: 'FAILED' },
    });
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Get all VendorPayments
export const getAllVendorPayments = async (vendorId) => {
  try {
    const payments = await prisma.vendorPayment.findMany({
      where: {
        vendorId: vendorId,
      },
    });

    if (!payments || payments.length === 0) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No vendor payments found!',
        },
      };
    }

    return { rdata: payments, rerror: null };
  } catch (error) {
    console.error('Error fetching vendor payments:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

// Get VendorPayment by ID
export const getVendorPaymentById = async (id) => {
  try {
    const payment = await prisma.vendorPayment.findUnique({
      where: { id },
    });

    if (!payment) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Payment not found!',
        },
      };
    }
    return { rdata: payment, rerror: null };
  } catch (error) {
    console.error('Error fetching vendor payment by ID:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

// Delete VendorPayment by ID
export const deleteVendorPayment = async (id) => {
  try {
    const payment = await prisma.vendorPayment.findUnique({
      where: { id },
    });

    if (!payment) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Payment not found!',
        },
      };
    }

    await prisma.vendorPayment.delete({
      where: { id },
    });

    return {
      rdata: { message: 'Payment deleted successfully!' },
      rerror: null,
    };
  } catch (error) {
    console.error('Error deleting vendor payment:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
