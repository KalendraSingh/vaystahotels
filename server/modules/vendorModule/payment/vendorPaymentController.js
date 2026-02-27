import {
  createVendorPayment,
  deleteVendorPayment,
  getAllVendorPayments,
  getVendorPaymentById,
  verifyVendorPayment,
} from '../../payment/vendorPaymentService.js';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const createVendorPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'vendorId',
      'hotelId',
      'paymentAmount',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createVendorPayment(data);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in createVendorPaymentController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const verifyVendorPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'razorpay_payment_id',
      'razorpay_order_id',
      'razorpay_signature',
      'vendorId',
      'hotelId',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await verifyVendorPayment({
      ...data,
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in verifyVendorPaymentController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Controller Functions

// Get all VendorPayments
export const getAllVendorPaymentsController = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const { rdata, rerror } = await getAllVendorPayments(vendorId);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in fetching vendor payments:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get VendorPayment by ID
export const getVendorPaymentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getVendorPaymentById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in fetching vendor payment by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete VendorPayment by ID
export const deleteVendorPaymentController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteVendorPayment(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting vendor payment:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
