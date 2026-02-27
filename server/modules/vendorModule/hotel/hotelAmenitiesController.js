import {
  createHotelAmenities,
  deleteHotelAmenities,
  getHotelAllAmenitiesById,
  updateHotelAmenities,
  getAllHotelAmenities,
} from '../../hotel/hotelAmenitiesService.js';

// Create hotel amenities

export const createHotelAmenitiesController = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrls = req.body.fileUrls;

    const formattedImageUrl = imageUrls
      .filter((file) => file.fieldname === 'iconImage')
      .map((file) => file.location)[0];

    const amenity = {
      name: name,
      icon: formattedImageUrl,
    };

    const { rdata, rerror } = await createHotelAmenities({
      amenities: [amenity],
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in createHotelAmenitiesController:', error);
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

// Get hotel amenities by ID
export const getHotelAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await getHotelAllAmenitiesById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getHotelAmenitiesByIdController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Update hotel amenities
export const updateHotelAmenitiesController = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const imageUrls = req.body.fileUrls;

    const formattedImageUrl = imageUrls
      .filter((file) => file.fieldname === 'iconImage')
      .map((file) => file.location)[0];
    const amenity = {
      name: name,
      icon: formattedImageUrl,
    };

    const { rdata, rerror } = await updateHotelAmenities(id, {
      amenities: [amenity],
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updateHotelAmenitiesController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete hotel amenities by ID
export const deleteHotelAmenitiesController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteHotelAmenities(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleteHotelAmenitiesController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
