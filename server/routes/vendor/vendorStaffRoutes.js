import { Router } from 'express';
import {
  assignPermissionController,
  deleteVendorStaffController,
  getAllStaffByVendorIdController,
  toggleActiveController,
} from '../../modules/vendorModule/VendorStaff/vendorStaffController.js';
const router = Router();

export default router
  .get('/getAllStaffByVendorId/:vendorId', getAllStaffByVendorIdController)
  .put('/assignPermission', assignPermissionController)
  .patch('/toggleActive/:staffId', toggleActiveController)
  .delete('/delete/:staffId', deleteVendorStaffController);
