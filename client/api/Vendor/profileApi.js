import { axiosPrivate } from '../axios';

export const getVendorProfile = (id) => {
  return axiosPrivate.get(`/vendor/profile/getById/${id}`);
};

export const updateVendorProfile = (allData, id) => {
  return axiosPrivate.patch(`/vendor/profile/update/${id}`, allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
