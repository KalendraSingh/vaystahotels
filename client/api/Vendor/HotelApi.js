import { axiosPrivate } from '../axios';

export const addNewCity = (allData) => {
  return axiosPrivate.post('/vendor/hotel/addCity', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const getAllHotelsByVendor = (vendorId) => {
  return axiosPrivate.get(`/vendor/hotel/getAllHotelByVendorId/${vendorId}`);
};

export const addNewAmenity = (allData) => {
  return axiosPrivate.post(
    '/vendor/hotel/hotelAmenities/addHotelAmenities',
    allData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
};

export const addNewHotel = (allData) => {
  return axiosPrivate.post('/vendor/hotel/addNewHotel', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
export const updateHotel = (allData, hotelId) => {
  return axiosPrivate.put(`/vendor/hotel/updateHotel/${hotelId}`, allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const addHotelImages = (allData) => {
  return axiosPrivate.post('/vendor/hotel/addHotelImages', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
export const updateHotelImages = (allData) => {
  return axiosPrivate.patch('/vendor/hotel/updateHotelImages', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
export const deleteHotelImages = (id) => {
  return axiosPrivate.delete(`/vendor/hotel/deleteHotelImages/${id}`);
};

export const addHotelRoomCategory = (allData) => {
  return axiosPrivate.post('/vendor/hotel/room/addNewCategory', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const getRoomCategoryByHotel = (id) => {
  return axiosPrivate.get(`/vendor/hotel/room/getCategoryByHotel/${id}`);
};

export const addHotelRooms = (allData) => {
  return axiosPrivate.post('/vendor/hotel/room/addNewRoom', allData);
};

export const addRoomImages = () => {
  return axiosPrivate.post('/vendor/hotel/');
};

export const deleteHotelAPI = (hotelId) => {
  return axiosPrivate.delete(`/vendor/hotel/deleteHotel/${hotelId}`);
};

export const getAllTransactionsAPI = (vendorId) => {
  return axiosPrivate.get(`/vendor/auth/hotel/payment/allPayments/${vendorId}`);
};

export const addHotelPolicy = (allData) => {
  return axiosPrivate.post('/vendor/hotel/addHotelPolicy', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};

export const addVendorKYC = (allData) => {
  return axiosPrivate.post('/vendor/bankKyc/addVendorKyc', allData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      'Access-Control-Allow-Origin': '*',
    },
  });
};
