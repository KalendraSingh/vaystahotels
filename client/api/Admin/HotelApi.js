import axios from '../axios';

export const getAllHotels = (filterData) => {
  const {
    page,
    pageSize,
    search,
    sortBy,
    sortOrder,
    rating,
    paymentStatus,
    policyStatus,
    hotelStatus,
  } = filterData;

  return axios.get('/admin/hotel/getAllHotels', {
    params: {
      page,
      pageSize,
      search: search || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
      rating: rating || undefined,
      paymentStatus: paymentStatus || undefined,
      policyStatus: policyStatus || undefined,
      hotelStatus: hotelStatus !== undefined ? hotelStatus : undefined,
    },
  });
};

export const toggleHotelStatus = (id, isActive) => {
  console.log(id, isActive);
  return axios.post(`/admin/hotel/toggleHotelStatus/${id}`, { isActive });
};

export const deleteHotelById = (id) => {
  return axios.post(`/admin/hotel/deleteHotel/${id}`);
};

export const updateHotelPolicy = (id, data) => {
  return axios.put(`/admin/hotel/updateHotelPolicy/${id}`, data);
};
