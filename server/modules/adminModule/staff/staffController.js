import {
  assignPermission,
  getAllStaff,
  getStaffById,
  toggleActive,
  updateStaff,
} from './staffService.js';

export const getAllStaffController = async (req, res) => {
  const { name, email, phone, page, pageSize, orderby, order } = req.query;
  const data = await getAllStaff({
    name,
    email,
    phone,
    page,
    pageSize,
    orderby,
    order,
  });
  res.send(data);
};

export const getStaffByIdController = async (req, res) => {
  const { id } = req.params;
  console.log('id', id);
  const data = await getStaffById(id);
  res.send(data);
};

export const updateStaffController = async (req, res) => {
  try {
    const { id } = req.params;
    const imageUrls = req.body.fileUrls;

    const { name, gender, dob, phone, street, pincode, city, state, country } =
      req.body;

    // Extract the profile image URL if available
    const hotelUrls =
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
      profileImage: hotelUrls[0],
    };

    const updatedData = await updateStaff(id, profileData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error('Error in updateStaffController:', error);
    res.status(500).json({ message: 'Failed to update staff' });
  }
};

export const toggleActiveController = async (req, res) => {
  const { id } = req.params;
  const data = await toggleActive(id);
  res.send(data);
};

export const assignPermissionController = async (req, res) => {
  try {
    const { staffId, permissions } = req.body;
    const data = await assignPermission(staffId, permissions);
    res.send(data);
  } catch (error) {
    console.error('Error in assignPermissionController:', error);
    res.status(500).json({ message: 'Failed to assign permission' });
  }
};
