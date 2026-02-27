import {
  newCustomerController,
  customerAuthRefreshTokenController,
  customerLoginController,
  customerLogoutController,
  verifyEmailController,
  forgotPasswordController,
  resetPasswordController,
  sendOTPController,
  verifyOTPController,
} from '../../modules/customerModule/auth/customerAuthController.js';
import verifyToken from '../../middleware/verifyToken.js';

import { Router } from 'express';

const router = Router();

export default router
  .post('/sendOTP', sendOTPController)
  .post('/verifyOTP', verifyOTPController)
  .post('/register', newCustomerController)
  .post('/login', customerLoginController)
  .get('/logout', customerLogoutController)
  .get('/refresh', customerAuthRefreshTokenController)
  .get('/verifyEmail/:id', verifyEmailController)
  .post('/forgotPassword', forgotPasswordController)
  .patch('/resetPassword/:token', resetPasswordController);
