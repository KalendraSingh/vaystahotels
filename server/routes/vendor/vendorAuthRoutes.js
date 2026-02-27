import {
  newVendorController,
  vendorLoginController,
  vendorLogoutController,
  vendorAuthRefreshTokenController,
  verifyVendorEmailController,
  forgotPasswordController,
  resetPasswordController,
  newVendorStaffController,
} from '../../modules/vendorModule/auth/vendorAuthController.js';

import verifyToken from '../../middleware/verifyToken.js';
import { Router } from 'express';

const router = Router();

export default router

  .post('/register', newVendorController)
  .post('/registerStaff', newVendorStaffController)
  .post('/login', vendorLoginController)
  .post(
    '/logout',
    // verifyToken,
    vendorLogoutController
  )
  .get('/refresh', vendorAuthRefreshTokenController)
  .get('/verifyEmail/:id', verifyVendorEmailController)
  .post('/forgotPassword', forgotPasswordController)
  .patch('/resetPasword/:token', resetPasswordController);
