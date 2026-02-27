import { Router } from 'express';
import customerAuthRoutes from './customerAuthRoutes.js';
import customerRoutes from './customerRoutes.js';

const router = Router();

export default router
  .use('/auth', customerAuthRoutes)
  .use('/profile', customerRoutes);
