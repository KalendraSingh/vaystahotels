import { axiosPrivate } from '../axios';

export const getUserProfile = (id) => {
  return axiosPrivate.get(`/customer/profile/getById/${id}`);
};
export const updateUserProfile = (allData, id) => {
  return axiosPrivate.patch(`/customer/profile/update/${id}`, allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const addNewRating = (data) => {
  return axiosPrivate.post(`/customer/profile/addNewRating`, data);
};
