import axios from '../axios';

export const getAllAmenities = () => {
  return axios.get('/public/hotel/getAllRoomAmenities');
};
