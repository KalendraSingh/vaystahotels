import {
  createHotelAmenitiesController,
  updateHotelAmenitiesController,
  getAllHotelAmenitiesController,
  getHotelAmenitiesByIdController,
  deleteHotelAmenitiesController,
} from '../../modules/vendorModule/hotel/hotelAmenitiesController.js';

import { uploadFiles } from '../../middleware/multerS3Upload.js';
// import { uploadFiles } from '../../middleware/uploadFiles.js';

import { Router } from 'express';

const router = Router();

export default router

  .post('/addHotelAmenities', uploadFiles, createHotelAmenitiesController)
  .get('/getAllHotelAmenities', getAllHotelAmenitiesController)
  .get('/getHotelAmenitiesById/:id', getHotelAmenitiesByIdController)
  .put('/updateHotelAmenities/:id', uploadFiles, updateHotelAmenitiesController)
  .delete('/deleteHotelAmenities/:id', deleteHotelAmenitiesController);
