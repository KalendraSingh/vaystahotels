import express from 'express';
import {
  updateCustomerProfileController,
  getCustomerProfileByIdController,
  deleteCustomerProfileController,
} from '../../modules/customerModule/profile/customerController.js';
// import { uploadFiles } from '../../middleware/uploadFiles.js';
import { uploadFiles } from '../../middleware/multerS3Upload.js';

import {
  addNewRatingController,
  getRatingByIdController,
  deleteRatingController,
} from '../../modules/customerModule/Rating/CustomerRatingController.js';

import { Router } from 'express';

const router = Router();

router.patch('/update/:id', uploadFiles, updateCustomerProfileController);

router.get('/getById/:id/', getCustomerProfileByIdController);

router.delete('/deleteById/:id/', deleteCustomerProfileController);

router.post('/addNewRating', addNewRatingController);
router.get('/getRatingById/:id', getRatingByIdController);
router.delete('/deleteRating/:id', deleteRatingController);

export default router;
