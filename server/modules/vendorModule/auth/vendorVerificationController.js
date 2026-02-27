import {
  createVerificationRequest,
  getVendorVerifications,
  getVerificationById,
  updateVerificationStatus,
} from './vendorVerificationService.js';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const createVendorVerificationController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'vendorId',
      'hotelName',
      'address',
      'city',
      'state',
      'pincode',
      'aadharCardImage',
      'hotelImages',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await createVerificationRequest(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};

export const getVendorVerificationsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getVendorVerifications();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};

export const getVerificationByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await getVerificationById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};

export const updateVerificationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectedReason } = req.body;

    const { rdata, rerror } = await updateVerificationStatus(id, {
      status,
      rejectedReason,
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};
