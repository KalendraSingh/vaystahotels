import { Router } from 'express';
import { createInquiryController } from '../../modules/publicModule/inquiry/publicInquiryController.js';

const router = Router();

export default router.post('/createInquiry', createInquiryController);
