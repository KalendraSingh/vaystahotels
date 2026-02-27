import { Router } from 'express';

import adminRouter from './admin/index.js';
import customerRoutes from './customer/index.js';
import vendorRoutes from './vendor/index.js';
import bookingRoutes from './booking/bookingRoutes.js';
import publicRoutes from './public/index.js';

const router = Router();

router.use('/admin', adminRouter);
router.use('/customer', customerRoutes);
router.use('/vendor', vendorRoutes);
router.use('/booking', bookingRoutes);
router.use('/public', publicRoutes);

export default router;
