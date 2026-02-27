import {
  newRoleContoller,
  getAllRolesController,
  deleteRoleController,
  updateRoleController,
  getRoleByIdController,
} from '../../../modules/adminModule/staff/staffRoleController.js';
import verfiyRoute from '../../../middleware/verifyRole.js';

import { Router } from 'express';

const router = Router();

router

  .get('/getAllRoles', getAllRolesController)
  .delete('/deleteRole/:id', deleteRoleController)
  .patch('/updateRole/:id', updateRoleController)
  .get('/getRole/:id', getRoleByIdController)
  .post('/newRole', newRoleContoller);

export default router;
