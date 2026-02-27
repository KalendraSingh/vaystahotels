import prisma from '../../config/db.js';

// Room Services

export const addRoomCategory = async ({
  category,
  hotelId,
  bedType,
  adultCount,
  roomSize,
  description,
  price,
  discount,
  discountedPrice,
  categoryImage,
  perGuestPrice,
  amenities,
}) => {
  try {
    const ifCategoryExist = await prisma.roomCategory.findMany({
      where: {
        hotelId: hotelId,
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
    });

    if (ifCategoryExist.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: 'Category already exists!',
        },
      };
    }

    const roomCategory = await prisma.roomCategory.create({
      data: {
        hotelId,
        category,
        bedType,
        adultCount,
        roomSize,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        discountedPrice: parseFloat(discountedPrice),
        categoryImage,
        perGuestPrice: parseInt(perGuestPrice),
        amenities: JSON.parse(amenities),
      },
    });

    return { rdata: roomCategory, rerror: null };
  } catch (error) {
    console.error('Error in addRoomCategory:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const updateRoomCategory = async ({
  categoryId,
  category,
  bedType,
  adultCount,
  roomSize,
  description,
  price,
  discount,
  discountedPrice,
  categoryImage,
  perGuestPrice,
  amenities,
}) => {
  try {
    // Update the room category
    const roomCategory = await prisma.roomCategory.update({
      where: {
        id: categoryId,
      },
      data: {
        category,
        bedType,
        adultCount,
        roomSize,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        discountedPrice: parseFloat(discountedPrice),
        categoryImage,
        perGuestPrice: parseFloat(perGuestPrice),
        amenities: JSON.parse(amenities), // Parse amenities JSON string
      },
    });

    return { rdata: roomCategory, rerror: null };
  } catch (error) {
    console.error('Error in updateRoomCategory:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getAllRoomCategories = async () => {
  try {
    const categoriesWithRooms = await prisma.roomCategory.findMany({
      include: {
        rooms: true,
      },
    });
    return { rdata: categoriesWithRooms, rerror: null };
  } catch (error) {
    console.error('Error in getAllCategoriesWithAvailableRooms:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getCategoryByHotel = async (id) => {
  try {
    const hotelCategories = await prisma.roomCategory.findMany({
      where: {
        hotelId: id,
      },
      include: {
        rooms: true,
      },
    });
    return { rdata: hotelCategories, rerror: null };
  } catch (error) {
    console.error('Error in getHotelCategoriesWithAvailableRooms:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getCategoryById = async (id) => {
  try {
    const hotelCategories = await prisma.roomCategory.findUnique({
      where: {
        id,
      },
      include: {
        rooms: true,
      },
    });
    return { rdata: hotelCategories, rerror: null };
  } catch (error) {
    console.error('Error in getHotelCategoriesWithAvailableRooms:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const deleteCategoryById = async (id) => {
  try {
    const hotelCategories = await prisma.roomCategory.delete({
      where: {
        id,
      },
    });
    return { rdata: hotelCategories, rerror: null };
  } catch (error) {
    console.error('Error in getHotelCategoriesWithAvailableRooms:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const createRoom = async ({ hotelId, roomCategoryId, roomNo }) => {
  try {
    const existingRoom = await prisma.room.findFirst({
      where: {
        hotelId,
        roomCategoryId,
        roomNo,
      },
    });

    if (existingRoom) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Room number already exists in this hotel and room category',
        },
      };
    }

    const room = await prisma.room.create({
      data: {
        hotelId,
        roomCategoryId,
        roomNo,
      },
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error('Error in createRoom:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const updateRoom = async (roomId, updateData) => {
  const { roomNo } = updateData;
  try {
    const room = await prisma.room.update({
      where: { id: roomId },
      data: {
        roomNo,
      },
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error('Error in updateRoom:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const deleteRoom = async (roomId) => {
  try {
    const room = await prisma.room.delete({
      where: { id: roomId },
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error('Error in deleteRoom:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const activeRoomUpdate = async (roomId) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        isActive: !room.isActive,
      },
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error('Error in active update:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const availabilityRoomUpdate = async (roomId) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        isAvailable: !room.isAvailable,
      },
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error('Error in availability update:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getAllRooms = async () => {
  try {
    const rooms = await prisma.room.findMany();
    return { rdata: rooms, rerror: null };
  } catch (error) {
    console.error('Error in getAllRooms:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const roomAvailability = async (roomId) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    const updatedRoom = await prisma.room.update({
      where: { id: roomId },
      data: {
        isAvailable: !room.isAvailable,
      },
    });

    return { rdata: updatedRoom, rerror: null };
  } catch (error) {
    console.error('Error in updating room availability:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Add room images caegory wise

export const addRoomImages = async ({
  roomCategoryId,
  category,
  imageUrls,
}) => {
  try {
    const ifCategoryExist = await prisma.roomImage.findMany({
      where: {
        roomCategoryId,
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
    });

    if (ifCategoryExist.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: 'Category already listed!',
        },
      };
    }

    const roomImage = await prisma.roomImage.create({
      data: {
        roomCategoryId,
        category,
        imageUrls,
      },
    });
    return { rdata: roomImage, rerror: null };
  } catch (error) {
    console.error('Error in addRoomImages:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const updateRoomImages = async (imageId, updateData) => {
  try {
    const roomImage = await prisma.roomImage.update({
      where: { id: imageId },
      data: updateData,
    });
    return { rdata: roomImage, rerror: null };
  } catch (error) {
    console.error('Error in updateRoomImages:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const deleteRoomImages = async (imageId) => {
  try {
    const roomImage = await prisma.roomImage.delete({
      where: { id: imageId },
    });
    return { rdata: roomImage, rerror: null };
  } catch (error) {
    console.error('Error in deleteRoomImages:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};
