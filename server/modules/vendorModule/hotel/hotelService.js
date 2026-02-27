import prisma from '../../../config/db.js';

export const getAllHotelsByVendor = async (
  filters,
  sorting,
  checkIn,
  checkOut,
  vendorId
) => {
  const {
    search,
    state,
    landmark,
    latitude,
    longitude,
    guestCount,
    price,
    rating, // Filter by average rating
    amenities,
  } = filters;

  const { sortBy = 'avgPrice', sortOrder = 'desc' } = sorting;

  // Check if checkIn and checkOut are valid dates
  const validCheckIn = checkIn ? new Date(checkIn) : null;
  const validCheckOut = checkOut ? new Date(checkOut) : null;

  if (validCheckIn && isNaN(validCheckIn.getTime())) {
    return {
      rdata: null,
      rerror: { status: 400, message: 'Invalid check-in date' },
    };
  }

  if (validCheckOut && isNaN(validCheckOut.getTime())) {
    return {
      rdata: null,
      rerror: { status: 400, message: 'Invalid check-out date' },
    };
  }

  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        vendorId: vendorId,
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { city: { contains: search, mode: 'insensitive' } },
            { landmark: { contains: search, mode: 'insensitive' } },
          ],
        }),
        ...(state && { state: { contains: state, mode: 'insensitive' } }),
        ...(latitude &&
          longitude && {
            latitude: latitude,
            longitude: longitude,
          }),
        ...(price && {
          avgPrice: { lte: price },
        }),
        ...(amenities && {
          RoomCategories: {
            some: {
              amenities: {
                hasEvery: amenities,
              },
            },
          },
        }),
      },
      include: {
        RoomCategories: {
          include: {
            rooms: {
              where: {
                isActive: true,
                isAvailable: true,
              },
            },
          },
        },
        ReviewAndRating: {
          // Include reviews with customer details
          include: {
            customer: {
              // Assuming there's a relationship between reviews and customers
              select: {
                name: true,
                gender: true,
                profileImage: true,
              },
            },
          },
        },
        hotelImages: true,
        hotelPolicy: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
    });

    // Calculate average rating for each hotel
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;

      return {
        ...hotel,
        avgRating, // Add calculated average rating to the hotel object
      };
    });

    // Filter by guest count based on RoomCategories
    let filteredHotels = guestCount
      ? hotelsWithAvgRating.filter((hotel) =>
          hotel.RoomCategories.some(
            (category) => parseInt(category.adultCount, 10) >= guestCount
          )
        )
      : hotelsWithAvgRating;

    // Filter by average rating
    if (rating) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.avgRating >= rating
      );
    }

    return { rdata: filteredHotels, rerror: null };
  } catch (error) {
    console.error('Error in getAllHotels:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};
