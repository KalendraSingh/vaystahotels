import { getAllRoomCategories } from '../../hotel/hotelRoomService.js';
import { getAllRoomAmenities } from '../../hotel/hotelRoomAmenitiesService.js';

export const handleGetAllRoomCategoryController = async (req, res) => {
  const { rdata, rerror } = await getAllRoomCategories();

  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });

  return res.status(200).json(rdata);
};

// Get all room amenities
export const getAllRoomAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllRoomAmenities();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getAllRoomAmenitiesController:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
