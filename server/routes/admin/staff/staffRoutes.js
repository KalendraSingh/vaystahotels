import {
  assignPermissionController,
  getAllStaffController,
  getStaffByIdController,
  toggleActiveController,
  updateStaffController,
} from '../../../modules/adminModule/staff/staffController.js';

import { Router } from 'express';
import verifyRole from '../../../middleware/verifyRole.js';
// import { uploadFiles } from '../../../middleware/uploadFiles.js';
import { uploadFiles } from '../../../middleware/multerS3Upload.js';

const router = Router();

export default router

  .get(
    '/getallStaff',
    // verifyRole({ route: 'GET_STAFF' }),
    getAllStaffController
  )
  .get('/getstaffById/:id', getStaffByIdController)
  .patch('/toggleactive/:id', toggleActiveController)
  .patch('/updatestaff/:id', uploadFiles, updateStaffController)
  .post('/assignPermission', assignPermissionController);
