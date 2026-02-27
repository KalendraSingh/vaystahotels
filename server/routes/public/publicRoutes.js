import {
  getAllHotelController,
  getHotelByIdController,
  getAllCitiesController,
  fetchHotelsByCityController,
  getLatestHotelsController,
  getTopRatedHotelsController,
  getTrendingHotelsController,
} from '../../modules/publicModule/hotel/publicHotelController.js';

import { handleGetAllRoomCategoryController } from '../../modules/publicModule/hotel/publicRoomController.js';

import { getAllHotelAmenitiesController } from '../../modules/publicModule/hotel/publicHotelController.js';
import { getAllRoomAmenitiesController } from '../../modules/publicModule/hotel/publicRoomController.js';

import { Router } from 'express';

const router = Router();

export default router

  .get('/getAllHotels', getAllHotelController)
  .get('/getHotelsByCity/:city', fetchHotelsByCityController)
  .get('/getHotelById/:id', getHotelByIdController)
  .get('/getAllRoomCategory', handleGetAllRoomCategoryController)
  .get('/latestHotels', getLatestHotelsController)
  .get('/topratedHotels', getTopRatedHotelsController)
  .get('/trendingHotels', getTrendingHotelsController)
  // public cities routes
  .get('/getAllCities', getAllCitiesController)
  //Amenities route
  .get('/getAllHotelAmenities', getAllHotelAmenitiesController)
  .get('/getAllRoomAmenities', getAllRoomAmenitiesController);
