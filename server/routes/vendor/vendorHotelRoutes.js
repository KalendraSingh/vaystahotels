import { Router } from 'express';

import {
  addNewHotelController,
  getHotelByIdController,
  updateHotelController,
  deleteHotelController,
  handleAddHotelImagesController,
  addCityAddressController,
  updateCityAddressController,
  getAllCitiesController,
  getCityByIdController,
  deleteCityAddressController,
  handleUpdateHotelImagesController,
  handleDeleteHotelImagesController,
} from '../../modules/vendorModule/hotel/hotelController.js';
// import { uploadFiles } from '../../middleware/uploadFiles.js';
import { uploadFiles } from '../../middleware/multerS3Upload.js';
import { getAllHotelByVendorController } from '../../modules/vendorModule/hotel/hotelController.js';

import {
  addVendorHotelPolicyController,
  getAllVendorHotelPoliciesByVendorController,
  getVendorHotelPolicyByIdController,
  deleteVendorHotelPolicyController,
  getAllVendorHotelPoliciesController,
} from '../../modules/vendorModule/policy/policyController.js';

const router = Router();

export default router
  .post('/addNewHotel', uploadFiles, addNewHotelController)
  .post('/addHotelImages', uploadFiles, handleAddHotelImagesController)
  .patch('/updateHotelImages', uploadFiles, handleUpdateHotelImagesController)
  .delete('/deleteHotelImages/:id', handleDeleteHotelImagesController)
  .get('/getAllHotelByVendorId/:vendorId', getAllHotelByVendorController)
  .get('/getHotelById/:id', getHotelByIdController)
  .put('/updateHotel/:id', uploadFiles, updateHotelController)
  .delete('/deleteHotel/:id', deleteHotelController)

  //hotel City routes

  .post('/addCity', uploadFiles, addCityAddressController)
  .get('/getAllCity', getAllCitiesController)
  .get('/getCityById/:id', getCityByIdController)
  .patch('/updateCity/:id', uploadFiles, updateCityAddressController)
  .delete('/deleteCity/:id', deleteCityAddressController)

  //hotel policy routes

  .post('/addHotelPolicy', uploadFiles, addVendorHotelPolicyController)
  .get('/getAllHotelPolicy', getAllVendorHotelPoliciesController)
  .get(
    '/getAllHotelPolicyByVendor/:vendorId',
    getAllVendorHotelPoliciesByVendorController
  )
  .get('/getAllHotelPolicyById/:id', getVendorHotelPolicyByIdController)
  .delete('/deleteHotelPolicy/:id', deleteVendorHotelPolicyController);
