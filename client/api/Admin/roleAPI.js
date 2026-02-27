import { axiosPrivate } from '../axios';

export const newRole = async (data) => {
  return await axiosPrivate.post('/admin/role/newRole', data);
};
