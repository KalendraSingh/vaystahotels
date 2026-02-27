import { axiosPrivate } from '../axios';

//add new guest
export const addGuest = async (allData) => {
  return await axiosPrivate.post('/booking/addNewGuest', allData);
};
