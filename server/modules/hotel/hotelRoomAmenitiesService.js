import prisma from '../../config/db.js';

// Create room amenities
export const createRoomAmenities = async (data) => {
  try {
    const amenities = await prisma.roomAmenities.create({
      data: {
        amenities: data.amenities,
      },
    });
    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error('Error in createRoomAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error creating room amenities' },
    };
  }
};

// Get all room amenities
export const getAllRoomAmenities = async () => {
  try {
    const amenities = await prisma.roomAmenities.findMany({
      select: {
        amenities: true,
        id: true,
      },
    });

    // Flatten the amenities array to include id, name, and icon
    const allAmenities = amenities.flatMap((roomAmenity) =>
      roomAmenity.amenities.map((amenity) => ({
        id: roomAmenity.id,
        name: amenity.name,
        icon: amenity.icon,
      }))
    );

    return { rdata: allAmenities, rerror: null };
  } catch (error) {
    console.error('Error in getAllRoomAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error retrieving room amenities' },
    };
  }
};

// Get room amenities by ID
export const getRoomAmenitiesById = async (id) => {
  try {
    const amenities = await prisma.roomAmenities.findUnique({
      where: { id },
    });

    if (!amenities) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Room amenities not found' },
      };
    }

    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error('Error in getRoomAmenitiesById:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Error retrieving room amenities by ID',
      },
    };
  }
};

// Update room amenities
export const updateRoomAmenities = async (id, data) => {
  try {
    const updatedAmenities = await prisma.roomAmenities.update({
      where: { id },
      data: {
        amenities: data.amenities,
      },
    });

    return { rdata: updatedAmenities, rerror: null };
  } catch (error) {
    console.error('Error in updateRoomAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error updating room amenities' },
    };
  }
};

// Delete room amenities by ID
export const deleteRoomAmenities = async (id) => {
  try {
    const deletedAmenity = await prisma.roomAmenities.delete({
      where: { id },
    });

    return { rdata: deletedAmenity, rerror: null };
  } catch (error) {
    console.error('Error in deleteRoomAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error deleting room amenities' },
    };
  }
};
