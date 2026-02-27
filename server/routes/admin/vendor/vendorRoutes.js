import {
  getVendorByIdController,
  toggleVendorActivationController,
  deleteVendorController,
  getAllVendorsController,
  getAllVendorPaymentsController,
  updateKYCStatusController,
} from '../../../modules/adminModule/vendor/vendorController.js';

import { Router } from 'express';

const router = Router();

export default router

  .get('/getAllVendors', getAllVendorsController)
  .get('/getVendorById/:id', getVendorByIdController)
  .put('/toggleVendorStatus/:id', toggleVendorActivationController)
  .delete('/deleteVendor/:id', deleteVendorController)
  .get('/getPayments', getAllVendorPaymentsController)
  .put('/kyc/:id/status', updateKYCStatusController);
