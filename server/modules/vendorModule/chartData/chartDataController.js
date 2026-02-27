import {
  getDashboardMetrics,
  getHotelsData,
  getRevenueData,
} from './chartDataService.js';

export const getDashboardDataController = async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getRevenueDataController = async (req, res) => {
  try {
    const data = await getRevenueData();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getHotelsController = async (req, res) => {
  try {
    const hotels = await getHotelsData();
    return res.status(200).json(hotels);
  } catch (error) {
    console.error('Error in getHotelsController:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
