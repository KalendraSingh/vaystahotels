import {
  createRoomAmenities,
  deleteRoomAmenities,
  getRoomAmenitiesById,
  updateRoomAmenities,
  getAllRoomAmenities,
} from '../../hotel/hotelRoomAmenitiesService.js';

// Create room amenities
export const createRoomAmenitiesController = async (req, res) => {
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

    const { rdata, rerror } = await createRoomAmenities({
      amenities: [amenity],
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in createRoomAmenitiesController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
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

// Get room amenities by ID
export const getRoomAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await getRoomAmenitiesById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getRoomAmenitiesByIdController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Update room amenities
export const updateRoomAmenitiesController = async (req, res) => {
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

    const { rdata, rerror } = await updateRoomAmenities(id, {
      amenities: [amenity],
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updateRoomAmenitiesController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

// Delete room amenities by ID
export const deleteRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteRoomAmenities(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleteRoomAmenitiesController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
