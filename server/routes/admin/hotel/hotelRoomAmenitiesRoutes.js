import {
  addNewHotelRoomAmenitiesController,
  updateHotelRoomAmenitiesController,
  getAllHotelRoomAmenitiesController,
  getHotelRoomAmenitiesByIdController,
  deleteHotelRoomAmenitiesController,
} from '../../../modules/adminModule/hotel/hotelRoomAmenitiesController.js';

import { Router } from 'express';

const router = Router();
export default router
  .post('/addNewRoomAmenities', addNewHotelRoomAmenitiesController)
  .patch('/updateRoomAmenities/:id', updateHotelRoomAmenitiesController)
  .get('/getAllRoomsAmenities', getAllHotelRoomAmenitiesController)
  .get('/getRoomAmenitiesById/:id', getHotelRoomAmenitiesByIdController)
  .delete('/deleteRoomAmenities/:id', deleteHotelRoomAmenitiesController);
