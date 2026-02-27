import { axiosPrivate } from '../axios';

export const addRoomToCart = (cartData) => {
  return axiosPrivate.post('/booking/addtoCart', cartData);
};

export const decreaseRoomToCart = (cartData) => {
  return axiosPrivate.patch('/booking/decreaseCartRoom', cartData);
};
export const increaseRoomToCart = (cartData) => {
  return axiosPrivate.patch('/booking/increaseCartRoom', cartData);
};

export const removeRoomToCart = (cartData) => {
  return axiosPrivate.post('/booking/removeCartRoom', cartData);
};

export const getRoomToCart = (cartData) => {
  return axiosPrivate.post('/booking/getRoomCart', cartData);
};
