import {
  createVendorPaymentController,
  verifyVendorPaymentController,
  getAllVendorPaymentsController,
  getVendorPaymentByIdController,
} from '../../modules/vendorModule/payment/vendorPaymentController.js';

import verifyToken from '../../middleware/verifyToken.js';

import { Router } from 'express';
import { getVendorByIdController } from '../../modules/vendorModule/profile/vendorController.js';

const router = Router();

export default router

  .post('/payment', createVendorPaymentController)
  .post('/payment/verification', verifyVendorPaymentController)
  .get('/payment/allPayments/:vendorId', getAllVendorPaymentsController)
  .get('/payment/getPayment/:id', getVendorPaymentByIdController);
