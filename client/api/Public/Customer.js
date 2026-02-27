import axios from '../axios';

export const getCustomerProfileDetails = (id) => {
  return axios.get(`/customer/profile/getById/${id}`);
};
