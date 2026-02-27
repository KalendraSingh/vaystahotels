import Razorpay from 'razorpay';

var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const generatePartialPaymentLink = async (bookingId, amount) => {
  const truncatedBookingId = bookingId.slice(0, 20);
  const receiptId = `receipt_${truncatedBookingId}`;
  const paymentOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${receiptId}`,
    payment_capture: 1,
    notes: {
      key: 'advance_amount',
    },
  });

  // Prepare response data
  const data = {
    orderId: paymentOrder.id,
    amount: paymentOrder.amount,
    currency: paymentOrder.currency,
    bookingId: paymentOrder.id,
    notes: paymentOrder.notes,
  };

  const url = `${process.env.FRONTEND_URL}/pay?orderId=${paymentOrder.id}&bookingId=${bookingId}`;
  return { data, url };
};

export const generateFullPaymentLink = async (bookingId, amount) => {
  const truncatedBookingId = bookingId.slice(0, 20);
  const receiptId = `receipt_${truncatedBookingId}`;
  const paymentOrder = await razorpay.orders.create({
    amount: amount * 100,
    currency: 'INR',
    receipt: `receipt_${receiptId}`,
    payment_capture: 1,
    notes: {
      key: 'full_amount',
    },
  });

  // Prepare response data
  const data = {
    orderId: paymentOrder.id,
    amount: paymentOrder.amount,
    currency: paymentOrder.currency,
    bookingId: paymentOrder.id,
    notes: paymentOrder.notes,
  };

  const url = `${process.env.FRONTEND_URL}/pay?orderId=${paymentOrder.id}&bookingId=${bookingId}`;

  return { data, url };
};
