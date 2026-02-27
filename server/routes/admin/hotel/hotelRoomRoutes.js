import {
  handleCreateRoom,
  handleUpdateRoom,
  handleDeleteRoom,
  handleGetAllRooms,
  handleAddRoomImages,
  handleUpdateRoomImages,
  handleDeleteRoomImages,
} from '../../../modules/adminModule/hotel/hotelRoomController.js';

import { Router } from 'express';
const router = Router();

// Room Routes
router.post('/addNewRoom', handleCreateRoom);
router.put('/updateRoom/:roomId', handleUpdateRoom);
router.delete('/deleteRoom/:roomId', handleDeleteRoom);
router.get('/getAllRooms', handleGetAllRooms);

// RoomImage Routes

router.post('/addRoomImages', handleAddRoomImages);
router.put('/updateImages/:imageId', handleUpdateRoomImages);
router.delete('/deleteRoomImages/:imageId', handleDeleteRoomImages);

export default router;
