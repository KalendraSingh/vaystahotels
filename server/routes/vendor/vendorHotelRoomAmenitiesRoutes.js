import {
  createRoomAmenitiesController,
  getAllRoomAmenitiesController,
  getRoomAmenitiesByIdController,
  deleteRoomAmenitiesController,
  updateRoomAmenitiesController,
} from '../../modules/vendorModule/hotel/hotelRoomAmenitiesController.js';

// import { uploadFiles } from '../../middleware/uploadFiles.js';
import { uploadFiles } from '../../middleware/multerS3Upload.js';

import { Router } from 'express';

const router = Router();

export default router

  .post('/addNewRoomAmenities', uploadFiles, createRoomAmenitiesController)
  .get('/getAllRoomAmenities', getAllRoomAmenitiesController)
  .get('/getRoomAmenitiesById/:id', getRoomAmenitiesByIdController)
  .put('/updateRoomAmenities/:id', uploadFiles, updateRoomAmenitiesController)
  .delete('/deleteRoomAmenities/:id', deleteRoomAmenitiesController);
