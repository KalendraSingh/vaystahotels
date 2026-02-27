import { axiosPrivate } from '../axios';

export const toggleStaffActive = async (id) => {
  return await axiosPrivate.patch(`/admin/staff/toggleactive/${id}`);
};
