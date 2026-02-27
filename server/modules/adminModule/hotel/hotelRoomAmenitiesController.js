// import {
//   createHotelRoomAmenities,
//   getAllHotelRoomAmenities,
//   getHotelRoomAmenitiesById,
//   updateHotelRoomAmenities,
//   deleteHotelRoomAmenities,
// } from '../../hotel/hotelRoomAmenitiesService.js';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const addNewHotelRoomAmenitiesController = async (req, res) => {
  try {
    const amenitiesData = {
      ...req.body,
    };

    const { data, error } = checkRequiredFields(amenitiesData, ['hotelId']);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await createHotelRoomAmenities(data);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllHotelRoomAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelRoomAmenities();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getHotelRoomAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await getHotelRoomAmenitiesById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotel amenities by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateHotelRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;

  try {
    const amenitiesData = {
      ...req.body,
    };

    const { rdata, rerror } = await updateHotelRoomAmenities(id, amenitiesData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updating hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteHotelRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteHotelRoomAmenities(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
