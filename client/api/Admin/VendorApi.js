import axios from '../axios';
import { axiosPrivate } from '../axios';

export const getAllVendors = (filters) => {
  const { page, pageSize, nameFilter, emailFilter, phoneFilter, statusFilter } =
    filters;
  return axios.get('/admin/vendor/getAllVendors', {
    params: {
      name: nameFilter,
      email: emailFilter,
      phone: phoneFilter,
      isActive: statusFilter,
      page,
      pageSize,
    },
  });
};

export const updateVendorKyc = (id, data) => {
  return axiosPrivate.put(`/admin/vendor/kyc/${id}/status`, data);
};

export const toggleVendorStatus = (id) => {
  return axiosPrivate.put(`/admin/vendor/toggleVendorStatus/${id}`);
};
