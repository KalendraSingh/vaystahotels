import {
  createRoom,
  updateRoom,
  deleteRoom,
  getAllRooms,
  addRoomImages,
  updateRoomImages,
  deleteRoomImages,
} from '../../hotel/hotelRoomService.js';

// Room Controllers

export const handleCreateRoom = async (req, res) => {
  const {
    hotelId,
    roomType,
    price,
    discount,
    discountedPrice,
    isAvailable,
    isActive,
  } = req.body;
  const { rdata, rerror } = await createRoom({
    hotelId,
    roomType,
    price,
    discount,
    discountedPrice,
    isAvailable,
    isActive,
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};

export const handleUpdateRoom = async (req, res) => {
  const { roomId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoom(roomId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleDeleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await deleteRoom(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: 'Room deleted successfully' });
};

export const handleGetAllRooms = async (req, res) => {
  const { rdata, rerror } = await getAllRooms();
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

// RoomImage Controllers

export const handleAddRoomImages = async (req, res) => {
  const { roomId, category, imageUrls } = req.body;
  const { rdata, rerror } = await addRoomImages({
    roomId,
    category,
    imageUrls,
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};

export const handleUpdateRoomImages = async (req, res) => {
  const { imageId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoomImages(imageId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};

export const handleDeleteRoomImages = async (req, res) => {
  const { imageId } = req.params;
  const { rdata, rerror } = await deleteRoomImages(imageId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: 'Room image deleted successfully' });
};
