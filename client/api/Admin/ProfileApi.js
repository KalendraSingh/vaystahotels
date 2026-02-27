import { axiosPrivate } from '../axios';

export const getAdminProfile = (id) => {
  return axiosPrivate.get(`/admin/staff/getstaffById/${id}`);
};

export const updateAdminProfile = (allData, id) => {
  return axiosPrivate.patch(`/admin/staff/updatestaff/${id}`, allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
