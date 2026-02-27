import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  addVendorHotelPolicy,
  deleteVendorHotelPolicy,
  getAllVendorHotelPolicies,
  getAllVendorHotelPoliciesByVendor,
  getVendorHotelPolicyById,
} from './policyService.js';

export const addVendorHotelPolicyController = async (req, res) => {
  console.log('req.body', req.body);
  try {
    // Validate required fields in request body
    const { data, error } = checkRequiredFields(req.body, [
      'checkInTime',
      'checkOutTime',
      'cancellationPolicy',
      'ownershipType',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    // Convert checkInTime and checkOutTime to Date objects using a fixed date
    const currentDate = new Date().toISOString().split('T')[0]; // e.g., "2024-10-29"
    const checkInTime = new Date(`${currentDate}T${req.body.checkInTime}:00Z`);
    const checkOutTime = new Date(
      `${currentDate}T${req.body.checkOutTime}:00Z`
    );

    // Extract image URLs for ownershipDocument and propertyImage from request files
    const documentUrls = req.body.fileUrls
      .filter((file) => file.fieldname === 'ownershipDocument')
      .map((file) => file.location);

    const propertyImageUrls = req.body.fileUrls
      .filter((file) => file.fieldname === 'propertyImage')
      .map((file) => file.location);

    // Prepare data for the service function
    const policyData = {
      ...data,
      checkInTime,
      checkOutTime,
      ownershipDocument: documentUrls,
      propertyImage: propertyImageUrls,
      vendorId: req.body.vendorId,
      hotelId: req.body.hotelId,
    };

    // Call the service function to add the VendorHotelPolicy
    const { rdata, rerror } = await addVendorHotelPolicy(policyData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating VendorHotelPolicy:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllVendorHotelPoliciesByVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rdata, rerror } = await getAllVendorHotelPoliciesByVendor(vendorId);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error(
      'Error in getting all VendorHotelPolicies by Vendor ID:',
      error
    );
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllVendorHotelPoliciesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllVendorHotelPolicies();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting all VendorHotelPolicies:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getVendorHotelPolicyByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getVendorHotelPolicyById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting VendorHotelPolicy by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
export const deleteVendorHotelPolicyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteVendorHotelPolicy(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting VendorHotelPolicy:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
