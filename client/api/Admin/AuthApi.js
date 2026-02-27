import { axiosPrivate } from '../axios';

export const adminLogin = (allData) => {
  return axiosPrivate.post('/admin/staff/auth/login', allData);
};

export const adminRefresh = () => {
  return axiosPrivate.get('/admin/staff/auth/refresh');
};

export const adminLogout = () => {
  return axiosPrivate.get('/admin/staff/auth/logout');
};

export const adminSignup = (allData) => {
  return axiosPrivate.post('/admin/staff/auth/register', allData);
};

export const adminGetRoles = () => {
  return axiosPrivate.get('/admin/role/getAllRoles');
};

export const adminGetAllStaff = () => {
  return axiosPrivate.get('/admin/staff/getallStaff');
};

export const assignPermission = (staffId, permissions) => {
  return axiosPrivate.post('/admin/staff/assignPermission', {
    staffId,
    permissions,
  });
};
