import {
  createVendorVerificationController,
  getVendorVerificationsController,
  updateVerificationStatusController,
  getVerificationByIdController,
} from '../../modules/vendorModule/auth/vendorVerificationController.js';

import { Router } from 'express';

const router = Router();
export default router
  .post('/apply', createVendorVerificationController)
  .get('/getAll', getVendorVerificationsController)
  .patch('/updateVerification/:id', updateVerificationStatusController)
  .get('/getById/:id', getVerificationByIdController);
