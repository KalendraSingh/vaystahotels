import { axiosPrivate } from '../axios';

export const allStaffByVendorId = async (vendorId) => {
  return await axiosPrivate.get(
    `/vendor/staff/getAllStaffByVendorId/${vendorId}`
  );
};

export const assignPermissionAPI = async (selectedStaff, permissions) => {
  return await axiosPrivate.put('/vendor/staff/assignPermission', {
    vendorStaffId: selectedStaff,
    permissions,
  });
};

export const vendorAddStaffAPI = async (data) => {
  return await axiosPrivate.post('/vendor/auth/registerStaff', data);
};

export const vendorGetAllStaff = async (data) => {
  const { vendorId, name, phone, email, isActive } = data;
  return await axiosPrivate.get(
    `/vendor/staff/getAllStaffByVendorId/${vendorId}`,
    {
      params: {
        name,
        phone,
        email,
        isActive,
      },
    }
  );
};

export const toggleVendorStaffActiveAPI = async (staffId, isActive) => {
  return await axiosPrivate.patch(`/vendor/staff/toggleactive/${staffId}`, {
    isActive,
  });
};

export const deleteVendorStaffAPI = async (staffId) => {
  return await axiosPrivate.delete(`/vendor/staff/delete/${staffId}`);
};
