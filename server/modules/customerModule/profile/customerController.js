import {
  updateCustomerProfile,
  getCustomerProfileById,
  deleteCustomerProfile,
} from './customerService.js';

// Update Customer Profile
export const updateCustomerProfileController = async (req, res) => {
  const { id } = req.params;
  const imageUrls = req.body.fileUrls;
  const { name, gender, dob, phone, street, pincode, city, state, country } =
    req.body;

  const profileImage = imageUrls
    .filter((file) => file.fieldname === 'profileImg')
    .map((file) => file.location);
  try {
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

    const { rdata, rerror } = await updateCustomerProfile(id, profileData);

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
export const getCustomerProfileByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await getCustomerProfileById(id);

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
export const deleteCustomerProfileController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await deleteCustomerProfile(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleteCustomerProfileController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
