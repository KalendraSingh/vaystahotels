import {
  getAllHotels,
  getHotelById,
  getAllCities,
  getHotelsByCity,
  getLatestHotels,
  getTopRatedHotels,
  getTrendingHotels,
} from '../../hotel/hotelService.js';

import { getAllHotelAmenities } from '../../hotel/hotelAmenitiesService.js';

export const getAllHotelController = async (req, res) => {
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
      amenity,
      sortBy,
      sortOrder,
      page,
      pageSize,
      orders,
      orderby,
    } = req.query;

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
      amenities: amenity ? (Array.isArray(amenity) ? amenity : amenity.split(',')) : undefined,
      page,
      pageSize,
      orders,
      orderby,
    };

    const sorting = {
      sortBy: sortBy || 'avgPrice',
      sortOrder:
        sortOrder === 'asc' || sortOrder === 'desc' ? sortOrder : 'asc',
    };

    const { rdata, rerror } = await getAllHotels(
      filters,
      sorting,
      checkIn,
      checkOut
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

export const getLatestHotelsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getLatestHotels();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting latest hotels:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTopRatedHotelsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getTopRatedHotels();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting top-rated hotels:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getTrendingHotelsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getTrendingHotels();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting trending hotels:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

// Controller to get hotels by city
export const fetchHotelsByCityController = async (req, res) => {
  const { city } = req.params;
  const { page = 1, pageSize = 10 } = req.query;

  if (!city) {
    return res.status(400).json({ error: 'City parameter is required' });
  }

  const { rdata, error } = await getHotelsByCity(city, page, pageSize);

  if (error) {
    return res.status(error.status).json({ error: error.message });
  }

  return res.status(200).json(rdata);
};

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

// public city data

export const getAllCitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllCities();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting cities:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Get all hotel amenities
export const getAllHotelAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelAmenities();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getAllHotelAmenitiesController:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
