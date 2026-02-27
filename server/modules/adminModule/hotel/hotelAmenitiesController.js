// import {
//   createHotelAmenities,
//   getAllHotelAmenities,
//   getHotelAmenitiesById,
//   updateHotelAmenities,
//   deleteHotelAmenities,
// } from '../../hotel/hotelAmenitiesService.js';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const addNewHotelAmenitiesController = async (req, res) => {
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

    const { rdata, rerror } = await createHotelAmenities(data);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllHotelAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelAmenities();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getHotelAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await getHotelAmenitiesById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotel amenities by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateHotelAmenitiesController = async (req, res) => {
  const { id } = req.params;

  try {
    const amenitiesData = {
      ...req.body,
    };

    const { rdata, rerror } = await updateHotelAmenities(id, amenitiesData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updating hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteHotelAmenitiesController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteHotelAmenities(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting hotel amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
