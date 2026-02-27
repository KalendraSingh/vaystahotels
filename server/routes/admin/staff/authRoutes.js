import {
  newStaffController,
  staffAuthRefreshTokenController,
  staffLoginController,
  staffLogoutController,
  forgotPasswordController,
  resetPasswordController,
} from '../../../modules/adminModule/staff/staffAuthController.js';

import { Router } from 'express';

const router = Router();

export default router
  .post('/register', newStaffController)
  .post('/login', staffLoginController)
  .get('/logout', staffLogoutController)
  .get('/refresh', staffAuthRefreshTokenController)
  .post('/forgotPassword', forgotPasswordController)
  .patch('/resetPasssword/:token', resetPasswordController);
