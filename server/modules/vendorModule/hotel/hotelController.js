import express from 'express';
import {
  addCityAddress,
  updateCityAddress,
  getAllCities,
  getCityById,
  deleteCityAddress,
  addHotelImages,
  createHotel,
  getHotelById,
  updateHotel,
  deleteHotel,
  toggleHotelStatus,
  updateHotelImages,
  deleteHotelImages,
} from '../../hotel/hotelService.js';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import { getAllHotelsByVendor } from './hotelService.js';

const router = express.Router();

export const addCityAddressController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'city',
      'state',
      'country',
      'zipcode',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const imageUrls = req.body.fileUrls;

    const formattedImageUrls = imageUrls
      .filter((file) => file.fieldname === 'cityImage')
      .map((file) => file.location)[0];

    const cityData = {
      ...data,
      cityImage: formattedImageUrls,
    };

    const { rdata, rerror } = await addCityAddress(cityData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel with amenities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllCitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllCities();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in fetching all cities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getCityByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await getCityById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in fetching city by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateCityAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileUrls, ...restBody } = req.body;
    let formattedImageUrls;
    if (fileUrls && fileUrls.length > 0) {
      formattedImageUrls = fileUrls
        .filter((file) => file.fieldname === 'cityImage')
        .map((file) => file.location)[0];
    }

    const cityData = {
      ...restBody,
      ...(formattedImageUrls && { cityImage: formattedImageUrls }),
    };

    const { rdata, rerror } = await updateCityAddress(id, cityData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updating cityAddress:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteCityAddressController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await deleteCityAddress(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting cityAddress:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

//Hotel Listing Controller

// Add New Hotel
export const addNewHotelController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'name',
      'city',
      'state',
      'country',
      'zipcode',
      'vendorId',
      'type',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const imageUrls = req.body.fileUrls || [];
    const formattedBannerImage = imageUrls
      .filter((file) => file.fieldname === 'bannerImage')
      .map((file) => file.location)[0];

    const hotelData = {
      ...data,
      bannerImage: formattedBannerImage,
      amenities: req.body.amenities || [],
    };

    const { rdata, rerror } = await createHotel(hotelData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get All Hotels
export const getAllHotelByVendorController = async (req, res) => {
  try {
    const {
      search,
      city,
      state,
      landmark,
      latitude,
      longitude,
      checkIn,
      checkOut,
      guestCount,
      price,
      rating,
      amenities,
      sortBy,
      sortOrder,
    } = req.query;

    const { vendorId } = req.params;

    const filters = {
      search,
      city,
      state,
      landmark,
      latitude,
      longitude,
      guestCount: guestCount ? parseInt(guestCount, 10) : undefined,
      price: price ? parseFloat(price) : undefined,
      rating: rating ? parseInt(rating, 10) : undefined,
      amenities: amenities ? amenities.split(',') : undefined,
    };

    const sorting = {
      sortBy: sortBy || 'name',
      sortOrder:
        sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'asc',
    };

    const { rdata, rerror } = await getAllHotelsByVendor(
      filters,
      sorting,
      checkIn,
      checkOut,
      vendorId
    );

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotels:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get Hotel By ID
export const getHotelByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotel by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Update Hotel with Image and Amenities

export const updateHotelController = async (req, res) => {
  const { id } = req.params;
  try {
    const imageUrls = req.body.fileUrls || [];
    const formattedBannerImage = imageUrls
      .filter((file) => file.fieldname === 'bannerImage')
      .map((file) => file.location)[0];

    const hotelData = {
      ...req.body,
      bannerImage: formattedBannerImage || req.body.bannerImage,
      amenities: req.body.amenities || [],
    };

    const { rdata, rerror } = await updateHotel(id, hotelData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updating hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete Hotel
export const deleteHotelController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteHotel(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Toggle Hotel Status
export const toggleHotelStatusController = async (req, res) => {
  const { hotelId } = req.params;

  try {
    const { rdata, rerror } = await toggleHotelStatus(hotelId);
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in toggleHotelStatusController:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

//handle hotel images

export const handleAddHotelImagesController = async (req, res) => {
  const { hotelId, category } = req.body;

  const imageUrls = req.body.fileUrls;

  const formattedImageUrls = imageUrls
    .filter((file) => file.fieldname === 'hotelImage')
    .map((file) => file.location);

  const { rdata, rerror } = await addHotelImages({
    hotelId,
    category,
    imageUrls: formattedImageUrls,
  });

  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};

export const handleUpdateHotelImagesController = async (req, res) => {
  const { hotelId, category } = req.body;
  const existingUrls = req.body.existingImageUrls || [];

  const imageUrls = req.body.fileUrls;

  const uploadedFiles = imageUrls
    .filter((file) => file.fieldname === 'hotelImage')
    .map((file) => file.location);

  const formattedImageUrls = [...existingUrls, ...uploadedFiles];

  console.log('formattedImageUrls', formattedImageUrls);

  const { rdata, rerror } = await updateHotelImages({
    hotelId,
    category,
    imageUrls: formattedImageUrls,
  });

  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  return res.status(200).json(rdata);
};

export const handleDeleteHotelImagesController = async (req, res) => {
  const { id } = req.params;

  const { rdata, rerror } = await deleteHotelImages(id);

  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  return res.status(200).json(rdata);
};

export default router;
