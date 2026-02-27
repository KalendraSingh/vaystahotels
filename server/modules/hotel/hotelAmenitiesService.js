import prisma from '../../config/db.js';

// Create hotel amenities
export const createHotelAmenities = async (data) => {
  try {
    const amenities = await prisma.hotelAmenities.create({
      data: {
        amenities: data.amenities,
      },
    });
    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error('Error in createHotelAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error creating hotel amenities' },
    };
  }
};

// Get all hotel amenities
export const getAllHotelAmenities = async () => {
  try {
    const amenities = await prisma.hotelAmenities.findMany({
      select: {
        amenities: true,
        id: true,
      },
    });
    const allAmenities = amenities.flatMap((hotelAmenity) =>
      hotelAmenity.amenities.map((amenity) => ({
        id: hotelAmenity.id,
        name: amenity.name,
        icon: amenity.icon,
      }))
    );

    return { rdata: allAmenities, rerror: null };
  } catch (error) {
    console.error('Error in getAllHotelAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error retrieving hotel amenities' },
    };
  }
};

// Get hotel amenities by ID

export const getHotelAllAmenitiesById = async (id) => {
  try {
    const amenities = await prisma.hotelAmenities.findUnique({
      where: { id },
    });

    if (!amenities) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Hotel amenities not found' },
      };
    }

    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error('Error in getHotelAllAmenitiesById:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Error retrieving hotel amenities by ID',
      },
    };
  }
};

// Update hotel amenities
export const updateHotelAmenities = async (id, data) => {
  try {
    const updatedAmenities = await prisma.hotelAmenities.update({
      where: { id },
      data: {
        amenities: data.amenities,
      },
    });

    return { rdata: updatedAmenities, rerror: null };
  } catch (error) {
    console.error('Error in updateHotelAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error updating hotel amenities' },
    };
  }
};

// Delete hotel amenities by ID
export const deleteHotelAmenities = async (id) => {
  try {
    const deletedAmenity = await prisma.hotelAmenities.delete({
      where: { id },
    });

    return { rdata: deletedAmenity, rerror: null };
  } catch (error) {
    console.error('Error in deleteHotelAmenities:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Error deleting hotel amenities' },
    };
  }
};
