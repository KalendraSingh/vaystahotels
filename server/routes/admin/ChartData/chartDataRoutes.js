import {
  getDashboardDataController,
  getRevenueDataController,
  getHotelsController,
} from '../../../modules/vendorModule/chartData/chartDataController.js';
import { Router } from 'express';

const router = Router();

export default router
  .get('/getMetrics', getDashboardDataController)
  .get('/getRevenueData', getRevenueDataController)
  .get('/getAllHotelsDetails', getHotelsController);
