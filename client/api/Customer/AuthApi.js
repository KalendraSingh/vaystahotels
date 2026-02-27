import { axiosPrivate } from '../axios';

export const userRegister = (allData) => {
  return axiosPrivate.post('/customer/auth/register', allData);
};

export const userLogin = (allData) => {
  return axiosPrivate.post('/customer/auth/login', allData);
};
export const userLogout = () => {
  return axiosPrivate.get('/customer/auth/logout');
};

export const userRefresh = () => {
  return axiosPrivate.get('/customer/auth/refresh');
};

export const userEmailVerification = (id) => {
  return axiosPrivate.get(`/customer/auth/verifyEmail/${id}`);
};

export const userForgetPassword = (allData) => {
  return axiosPrivate.post(`/customer/auth/forgotPassword`, allData);
};

export const userCreateNewPassword = (allData) => {
  const { password, token } = allData;
  return axiosPrivate.patch(`/customer/auth/resetPassword/${token}`, {
    password,
  });
};
