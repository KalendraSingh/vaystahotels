import { axiosPrivate } from '../axios';

export const vendorRegister = (allData) => {
  return axiosPrivate.post('/vendor/auth/register', allData);
};

export const vendorEmailVerification = (id) => {
  return axiosPrivate.get(`/vendor/auth/verifyEmail/${id}`);
};

export const vendorLogin = (allData) => {
  return axiosPrivate.post('/vendor/auth/login', allData);
};

export const vendorRefresh = () => {
  return axiosPrivate.get('/vendor/auth/refresh');
};

export const vendorLogout = () => {
  return axiosPrivate.post('/vendor/auth/logout');
};

export const forgotPassword = (allData) => {
  return axiosPrivate.post('/vendor/auth/forgotPassword', allData);
};

export const resetPassword = (allData) => {
  const { password, token } = allData;
  return axiosPrivate.patch(`/vendor/auth/resetPasword/${token}`, { password });
};
