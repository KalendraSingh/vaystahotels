import {
  createPermitedRoutesController,
  deletePermitedRoutesController,
  getPermittedRouteByStaffIdController,
} from '../../../modules/adminModule/permitedRoutes/permitedRouteController.js';

import { Router } from 'express';

const router = Router();

export default router

  .post('/newPermitedRoute', createPermitedRoutesController)
  .delete(
    '/deletePermitedRoute/:staffId/:permitedRouteId',
    deletePermitedRoutesController
  )
  .get('/getAllPermitedRoutes/:staffId', getPermittedRouteByStaffIdController);
