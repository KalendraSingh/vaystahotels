import {
  addNewRatingController,
  getAllRatingController,
  getRatingByIdController,
  updateRatingController,
  deleteRatingController,
} from '../../../modules/adminModule/hotel/hotelRatingController.js';

import { Router } from 'express';

const router = Router();

export default router

  .post('/addNewRating', addNewRatingController)
  .get('/getAllRatings', getAllRatingController)
  .patch('/updateRating/:id', updateRatingController)
  .get('/getRatingById/:id', getRatingByIdController)
  .delete('/deleteRating/:id', deleteRatingController);
