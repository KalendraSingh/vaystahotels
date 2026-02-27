import {
  addNewHotelController,
  getAllHotelController,
  getHotelByIdController,
  updateHotelController,
  deleteHotelController,
  toggleHotelStatusController,
  updateHotelPolicyStatusController,
} from '../../../modules/adminModule/hotel/hotelController.js';
// import { uploadFiles } from '../../../middleware/uploadFiles.js';
import { uploadFiles } from '../../../middleware/multerS3Upload.js';

import { Router } from 'express';

const router = Router();

export default router
  .post('/addNewHotel', uploadFiles, addNewHotelController)
  .patch('/updateHotel/:id', uploadFiles, updateHotelController)
  .get('/getAllHotels', getAllHotelController)
  .get('/getHotelById/:id', getHotelByIdController)
  .delete('/deleteHotel/:id', deleteHotelController)
  .post('/toggleHotelStatus/:id', toggleHotelStatusController)
  .put('/updateHotelPolicy/:id', updateHotelPolicyStatusController);
