import publicHotelRoutes from './publicRoutes.js';
import publicInquiryRoutes from './publicInquiryRoutes.js';

import { Router } from 'express';

const router = Router();

export default router
  .use('/hotel', publicHotelRoutes)
  .use('/inquiry', publicInquiryRoutes);
