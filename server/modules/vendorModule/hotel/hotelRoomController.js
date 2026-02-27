import {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  addRoomImages,
  updateRoomImages,
  deleteRoomImages,
  addRoomCategory,
  getAllRoomCategories,
  getCategoryByHotel,
  getCategoryById,
  deleteCategoryById,
  updateRoomCategory,
  activeRoomUpdate,
  availabilityRoomUpdate,
} from '../../hotel/hotelRoomService.js';

import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const handleAddRoomCategoryController = async (req, res) => {
  const {
    category,
    hotelId,
    bedType,
    adultCount,
    roomSize,
    description,
    price,
    discount,
    perGuestPrice,
    amenities,
  } = req.body;
  const imageUrls = req.body.fileUrls;

  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  const formattedImageUrls = imageUrls
    .filter((file) => file.fieldname === 'roomCatImage')
    .map((file) => file.location);

  const { rdata, rerror } = await addRoomCategory({
    category,
    hotelId,
    bedType,
    adultCount,
    roomSize,
    description,
    price,
    discount,
    discountedPrice,
    categoryImage: formattedImageUrls,
    perGuestPrice,
    amenities,
  });

  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }

  return res.status(201).json(rdata);
};

export const handleUpdateRoomCategoryController = async (req, res) => {
  const {
    category,
    bedType,
    adultCount,
    roomSize,
    description,
    price,
    discount,
    perGuestPrice,
    amenities,
    existingImageUrls = [],
  } = req.body;
  const { id } = req.params;

  const imageUrls = req.body.fileUrls || [];
  const uploadedFiles = imageUrls
    .filter((file) => file.fieldname === 'categoryImage')
    .map((file) => file.location);

  const formattedImageUrls = [...existingImageUrls, ...uploadedFiles];

  const discountedPrice = discount ? price - (price * discount) / 100 : price;

  try {
    const { rdata, rerror } = await updateRoomCategory({
      categoryId: id,
      category,
      bedType,
      adultCount,
      roomSize,
      description,
      price,
      discount,
      discountedPrice,
      categoryImage: formattedImageUrls,
      perGuestPrice,
      amenities,
    });

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in handleUpdateRoomCategoryController:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const handleGetAllRoomCategoryController = async (req, res) => {
  const { rdata, rerror } = await getAllRoomCategories();

  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });

  return res.status(200).json(rdata);
};

export const handleGetCategoryByHotelController = async (req, res) => {
  const id = req.params.id;
  const { rdata, rerror } = await getCategoryByHotel(id);

  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleGetCategoryByIdController = async (req, res) => {
  const id = req.params.id;
  const { rdata, rerror } = await getCategoryById(id);

  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleDeleteCategoryByIdController = async (req, res) => {
  const id = req.params.id;
  const { rdata, rerror } = await deleteCategoryById(id);

  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleCreateRoomController = async (req, res) => {
  const { hotelId, roomCategoryId, roomNo } = req.body;
  const { rdata, rerror } = await createRoom({
    hotelId,
    roomCategoryId,
    roomNo,
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};

export const handleUpdateRoomController = async (req, res) => {
  const { roomId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoom(roomId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleDeleteRoomController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await deleteRoom(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: 'Room deleted successfully' });
};

export const handleActiveController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await activeRoomUpdate(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
export const handleAvailabilityController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await availabilityRoomUpdate(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleGetAllRoomsController = async (req, res) => {
  const { rdata, rerror } = await getAllRooms();
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

// RoomImage Controllers

export const handleAddRoomImagesController = async (req, res) => {
  const { roomCategoryId, category } = req.body;

  const imageUrls = req.body.fileUrls;

  const formattedImageUrls = imageUrls
    .filter((file) => file.fieldname === 'roomImage')
    .map((file) => file.location);

  const { rdata, rerror } = await addRoomImages({
    roomCategoryId,
    category,
    imageUrls: formattedImageUrls,
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};

export const handleUpdateRoomImagesController = async (req, res) => {
  const { imageId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoomImages(imageId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleDeleteRoomImagesController = async (req, res) => {
  const { imageId } = req.params;
  const { rdata, rerror } = await deleteRoomImages(imageId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: 'Room image deleted successfully' });
};

export const hotelRoomAvailabilityController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await roomAvailability(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });

  return res.status(200).json({
    message: `Room availability updated successfully. Room is now ${
      rdata.isAvailable ? 'available' : 'not available'
    }.`,
  });
};
