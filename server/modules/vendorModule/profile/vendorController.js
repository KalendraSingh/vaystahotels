import {
  updateVendorProfile,
  getVendorProfileById,
  deleteVendorProfile,
} from './vendorService.js';

// Update Customer Profile
export const updateVendorProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    const imageUrls = req.body.fileUrls;

    console.log('imageUrls', imageUrls);

    const { name, phone, street, pincode, city, state, country, gender,dob } =
      req.body;

    const profileImage =
      imageUrls &&
      imageUrls
        .filter((file) => file.fieldname === 'profileImg')
        .map((file) => file.location);

    const profileData = {
      name,
      gender,
      dob,
      phone,
      street,
      pincode,
      city,
      state,
      country,
      profileImage: profileImage[0],
    };

    const { rdata, rerror } = await updateVendorProfile(id, profileData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updateCustomerProfileController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get Customer Profile by ID
export const getVendorByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await getVendorProfileById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getCustomerProfileByIdController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete Customer Profile
export const deleteVendorProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await deleteVendorProfile(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleteCustomerProfileController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
