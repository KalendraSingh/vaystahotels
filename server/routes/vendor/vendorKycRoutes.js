import { Router } from 'express';
import {
  addBankKYCController,
  getBankKYCByIdController,
  getBankKYCByVendorController,
  deleteBankKYCController,
} from '../../modules/vendorModule/kyc/vendorKycController.js';

// import { uploadFiles } from '../../middleware/uploadFiles.js';
import { uploadFiles } from '../../middleware/multerS3Upload.js';

const router = Router();

export default router

  .post('/addVendorKyc', uploadFiles, addBankKYCController)
  .get('/getKycByVendor/:vendorId', getBankKYCByVendorController)
  .get('/getKycById/:id', getBankKYCByIdController)
  .delete('/deleteVendorKyc/:id', deleteBankKYCController);
