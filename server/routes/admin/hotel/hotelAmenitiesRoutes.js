import {
  addNewHotelAmenitiesController,
  updateHotelAmenitiesController,
  getAllHotelAmenitiesController,
  getHotelAmenitiesByIdController,
  deleteHotelAmenitiesController,
} from '../../../modules/adminModule/hotel/hotelAmenitiesController.js';

import { Router } from 'express';

const router = Router();

export default router
  .post('/addNewHotelAmenities', addNewHotelAmenitiesController)
  .patch('/updateHotelAmenities/:id', updateHotelAmenitiesController)
  .get('/getAllHotelsAmenities', getAllHotelAmenitiesController)
  .get('/getHotelAmenitiesById/:id', getHotelAmenitiesByIdController)
  .delete('/deleteHotelAmenities/:id', deleteHotelAmenitiesController);
