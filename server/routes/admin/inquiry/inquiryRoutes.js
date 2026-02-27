import { Router } from 'express';
import { getAllInquiryController } from '../../../modules/adminModule/inquiry/inquiryController.js';

const router = Router();

export default router.use('/getAll', getAllInquiryController);
