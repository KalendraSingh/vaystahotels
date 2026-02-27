import { Router } from 'express';
import {
  getAllVendorNotificationController,
  getNotificationByIdController,
} from '../../modules/vendorModule/notifications/vendorNotificationsController.js';

const router = Router();

export default router
  .get('/getAllNotifications/:vendorId', getAllVendorNotificationController)
  .get('/getNotificationByID/:id', getNotificationByIdController);
