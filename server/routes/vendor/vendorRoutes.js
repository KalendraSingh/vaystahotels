import express from 'express';
import {
  updateVendorProfileController,
  getVendorByIdController,
  deleteVendorProfileController,
} from '../../modules/vendorModule/profile/vendorController.js';
import { uploadFiles } from '../../middleware/multerS3Upload.js';
// import { uploadFiles } from '../../middleware/uploadFiles.js';

const router = express.Router();

router.patch('/update/:id', uploadFiles, updateVendorProfileController);

router.get('/getById/:id/', getVendorByIdController);

router.delete('/deleteById/:id/', deleteVendorProfileController);

export default router;
