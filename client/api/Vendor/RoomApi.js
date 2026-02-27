import { axiosPrivate } from '../axios';

export const addNewAmenity = (allData) => {
  return axiosPrivate.post(
    '/vendor/hotel/roomAmenities/addNewRoomAmenities',
    allData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

export const addNewRoom = (allData) => {
  return axiosPrivate.post('/vendor/hotel/room/addNewRoom', allData);
};
export const updateRoomCategory = (allData, id) => {
  return axiosPrivate.put(`/vendor/hotel/room/updateCategory/${id}`, allData);
};

export const getRoomCategoryById = (id) => {
  return axiosPrivate.get(`/vendor/hotel/room/getCategoryById/${id}`);
};

export const deleteRoomCategoryById = (id) => {
  return axiosPrivate.delete(`/vendor/hotel/room/deleteCategoryById/${id}`);
};

export const deleteRoomById = (id) => {
  return axiosPrivate.delete(`/vendor/hotel/room/deleteRoom/${id}`);
};

export const updateRoom = (id, data) => {
  return axiosPrivate.put(`/vendor/hotel/room/updateRoom/${id}`, data);
};

export const updateActiveRoom = (id, data) => {
  return axiosPrivate.put(`/vendor/hotel/room/activeRoom/${id}`, data);
};

export const updateAvailabilityRoom = (id, data) => {
  return axiosPrivate.put(`/vendor/hotel/room/availabilityRoom/${id}`, data);
};
