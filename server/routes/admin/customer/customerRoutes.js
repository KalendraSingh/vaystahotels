import {
  getAllCustomersController,
  getCustomerByIdController,
  toggleCustomerStatusController,
  deleteCustomerController,
} from '../../../modules/adminModule/customer/customerController.js';
import { Router } from 'express';

const router = Router();

export default router

  .get('/getAllCustomer', getAllCustomersController)
  .get('/getCustomerById', getCustomerByIdController)
  .get('/toggleCustomerStatus/:id', toggleCustomerStatusController)
  .delete('/deleteCustomer', deleteCustomerController);
