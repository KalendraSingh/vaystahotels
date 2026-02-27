import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  addBankKYC,
  deleteBankKYC,
  getBankKYCById,
  getBankKYCByVendor,
} from './vendorKycService.js';

export const addBankKYCController = async (req, res) => {
  try {
    // Validate required fields in request body
    const { data, error } = checkRequiredFields(req.body, [
      'firstName',
      'lastName',
      'fatherFirstName',
      'fatherLastName',
      'maritalStatus',
      'gender',
      'dateOfBirth',
      'nationality',
      'email',
      'phoneNumber',
      'city',
      'state',
      'postalCode',
      'country',
      'bankName',
      'branchName',
      'accountNumber',
      'ifscCode',
      'accountHolderName',
      'pancardNumber',
      'declarationFirstName',
      'declarationLastName',
      'vendorId',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    // Extract image URLs from request files
    const documentUrls = {
      pancardDocument:
        req.body.fileUrls.find((file) => file.fieldname === 'pancardDocument')
          ?.location || null,
      aadharDocuments: req.body.fileUrls
        .filter((file) => file.fieldname === 'aadharDocuments')
        .map((file) => file.location),
      gstDocument:
        req.body.fileUrls.find((file) => file.fieldname === 'gstDocument')
          ?.location || null,
      signature:
        req.body.fileUrls.find((file) => file.fieldname === 'signature')
          ?.location || null,
    };

    // Prepare data for the service function
    const kycData = {
      ...data,
      ...documentUrls,
      kycStatus: 'PENDING',
      vendorId: req.body.vendorId,
    };

    // Call the service function to add the BankKYC
    const { rdata, rerror } = await addBankKYC(kycData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating Bank KYC:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getBankKYCByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await getBankKYCById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    if (!rdata) {
      return res.status(404).json({ message: 'KYC not found' });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in retrieving Bank KYC by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const getBankKYCByVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const { rdata, rerror } = await getBankKYCByVendor(vendorId);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    if (!rdata.length) {
      return res
        .status(404)
        .json({ message: 'No KYC records found for this vendor' });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in retrieving Bank KYC by vendor:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const deleteBankKYCController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await deleteBankKYC(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(204).json();
  } catch (error) {
    console.error('Error in deleting Bank KYC:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
