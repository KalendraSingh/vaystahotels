import axios from '../axios';

export const getAllMetrics = () => {
  return axios.get('/admin/chartData/getMetrics');
};

export const getRevenueData = () => {
  return axios.get('/admin/chartData/getRevenueData');
};
export const getAllHotelsDetails = () => {
  return axios.get('/admin/chartData/getAllHotelsDetails');
};
