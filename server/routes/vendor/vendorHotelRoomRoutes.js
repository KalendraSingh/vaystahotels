import {
  handleUpdateRoomController,
  handleDeleteRoomController,
  handleGetAllRoomsController,
  handleCreateRoomController,
  handleUpdateRoomImagesController,
  handleDeleteRoomImagesController,
  handleAddRoomImagesController,
  handleAddRoomCategoryController,
  handleGetAllRoomCategoryController,
  handleGetCategoryByHotelController,
  handleGetCategoryByIdController,
  handleDeleteCategoryByIdController,
  handleUpdateRoomCategoryController,
  handleActiveController,
  handleAvailabilityController,
} from '../../modules/vendorModule/hotel/hotelRoomController.js';
// import { uploadFiles } from '../../middleware/uploadFiles.js';
import { uploadFiles } from '../../middleware/multerS3Upload.js';

import { Router } from 'express';

const router = Router();

export default router
  .post('/addNewRoom', handleCreateRoomController)
  .get('/getAllRoom', handleGetAllRoomsController)
  .put('/updateRoom/:roomId', handleUpdateRoomController)
  .put('/activeRoom/:roomId', handleActiveController)
  .put('/availabilityRoom/:roomId', handleAvailabilityController)
  .delete('/deleteRoom/:roomId', handleDeleteRoomController)

  //RoomCategories

  .post('/addNewCategory', uploadFiles, handleAddRoomCategoryController)
  .get('/getAllCategory', handleGetAllRoomCategoryController)
  .get('/getCategoryByHotel/:id', handleGetCategoryByHotelController)
  .put('/updateCategory/:id', uploadFiles, handleUpdateRoomCategoryController)
  .get('/getCategoryById/:id', handleGetCategoryByIdController)
  .delete('/deleteCategoryById/:id', handleDeleteCategoryByIdController)

  //Room images router

  .post('/addRoomImages', uploadFiles, handleAddRoomImagesController)
  .put('/updateRoomImages/:id', uploadFiles, handleUpdateRoomImagesController)
  .delete('/deleteRoomImages/:id', handleDeleteRoomImagesController);
