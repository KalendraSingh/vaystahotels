import axios from '../axios';

export const getAllCustomer = (filters) => {
  const { page, pageSize, nameFilter, emailFilter, phoneFilter, statusFilter } =
    filters;
  return axios.get('/admin/customer/getAllCustomer', {
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

export const toggleCustomerActive = (id) => {
  return axios.get(`/admin/customer/toggleCustomerStatus/${id}`);
};
