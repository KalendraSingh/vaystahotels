import prisma from '../../config/db.js';

export const addCityAddress = async ({
  city,
  state,
  country,
  zipcode,
  landmark,
  location,
  cityImage,
  cityAvgPrice,
}) => {
  try {
    if (!city || !state || !cityImage) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: 'all fiels are required!',
        },
      };
    }

    const cities = await prisma.cityAddress.findMany({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
      },
    });

    if (cities.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: 'City already exist!',
        },
      };
    }

    const newCity = await prisma.cityAddress.create({
      data: {
        city,
        state,
        country: country || '',
        zipcode: zipcode || '',
        cityImage,
        cityAvgPrice: parseFloat(cityAvgPrice) || 0,
        landmark: landmark || '',
        location: location || '',
      },
    });

    return { rdata: newCity, rerror: null };
  } catch (error) {
    console.error('Error in creating cityAddress:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getCityById = async (id) => {
  try {
    const city = await prisma.cityAddress.findUnique({
      where: { id },
    });

    if (!city) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'City not found!',
        },
      };
    }

    return { rdata: city, rerror: null };
  } catch (error) {
    console.error('Error in fetching city by ID:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getAllCities = async () => {
  try {
    const cities = await prisma.cityAddress.findMany();

    return { rdata: cities, rerror: null };
  } catch (error) {
    console.error('Error in fetching all cities:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const updateCityAddress = async (id, data) => {
  try {
    const city = await prisma.cityAddress.findUnique({
      where: { id },
    });

    if (!city) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'City not found!',
        },
      };
    }

    const updateFields = {};
    if (data.name) updateFields.name = data.name;
    if (data.city) updateFields.city = data.city;
    if (data.state) updateFields.state = data.state;
    if (data.country) updateFields.country = data.country;
    if (data.zipcode) updateFields.zipcode = data.zipcode;
    if (data.landmark) updateFields.landmark = data.landmark;
    if (data.location) updateFields.location = data.location;
    if (data.cityImage) updateFields.cityImage = data.cityImage;
    if (data.cityAvgPrice)
      updateFields.cityAvgPrice = parseFloat(data.cityAvgPrice);

    const updatedCity = await prisma.CityAddress.update({
      where: { id },
      data: updateFields,
    });

    return { rdata: updatedCity, rerror: null };
  } catch (error) {
    console.error('Error in updating cityAddress:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const deleteCityAddress = async (id) => {
  try {
    const city = await prisma.cityAddress.findUnique({
      where: { id },
    });

    if (!city) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'City not found!',
        },
      };
    }
    await prisma.cityAddress.delete({
      where: { id },
    });

    return { rdata: { message: 'City deleted successfully!' }, rerror: null };
  } catch (error) {
    console.error('Error in deleting cityAddress:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

//Hotel listing services

export const createHotel = async (hotelData) => {
  const {
    type,
    phone,
    website,
    email,
    name,
    city,
    state,
    country,
    zipcode,
    landmark,
    avgPrice,
    location,
    vendorId,
    cityAddressId,
    description,
    bannerImage,
    amenities,
    longitude,
    latitude,
  } = hotelData;

  try {
    const ifHotelExist = await prisma.hotel.findMany({
      where: { name: { equals: name, mode: 'insensitive' } },
    });

    if (ifHotelExist.length > 0) {
      return {
        rdata: null,
        rerror: { status: 401, message: 'Hotel already listed!' },
      };
    }

    const hotel = await prisma.hotel.create({
      data: {
        type,
        phone,
        website,
        email,
        name,
        city,
        state,
        country,
        zipcode,
        landmark,
        vendorId,
        cityAddressId,
        avgPrice: parseFloat(avgPrice),
        location,
        description,
        bannerImage,
        longitude,
        latitude,
        amenities: JSON.parse(amenities),
      },
    });

    return { rdata: hotel, rerror: null };
  } catch (error) {
    console.error('Error in createHotel:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};
export const getAllHotels = async (filters, sorting, checkIn, checkOut) => {
  const {
    search,
    state,
    latitude,
    longitude,
    guestCount,
    price,
    rating,
    amenities,
    page = 1,
    pageSize = 10,
  } = filters;

  let skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

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
    const filterConditions = {
      isActive: true,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
          { landmark: { contains: search, mode: 'insensitive' } },
        ],
      }),
      ...(state && { state: { contains: state, mode: 'insensitive' } }),
      // ...(latitude &&
      //   longitude && {
      //     latitude: latitude,
      //     longitude: longitude,
      //   }),
      ...(price && {
        avgPrice: { lte: price },
      }),
    };

    // Fetch filtered hotels with pagination
    let hotels = await prisma.hotel.findMany({
      where: filterConditions,
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
          include: {
            customer: {
              select: {
                name: true,
                gender: true,
                profileImage: true,
              },
            },
          },
        },
        hotelImages: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take,
    });

    // Filter by amenities in JavaScript since JSON array filtering is complex in Prisma
    if (amenities && amenities.length > 0) {
      hotels = hotels.filter((hotel) => {
        if (!hotel.amenities || hotel.amenities.length === 0) return false;

        // Check if hotel has any of the selected amenities
        return amenities.some((selectedAmenity) => {
          return hotel.amenities.some((hotelAmenity) => {
            // Handle both string and object formats
            const amenityName = typeof hotelAmenity === 'string'
              ? hotelAmenity
              : hotelAmenity.name || hotelAmenity;

            return amenityName.toLowerCase() === selectedAmenity.toLowerCase();
          });
        });
      });
    }

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
        avgRating,
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

    // Total count of records matching filters (for pagination)

    const totalCount = await prisma.hotel.count({
      where: filterConditions,
    });

    return {
      rdata: {
        data: filteredHotels,
        pagination: {
          total: totalCount,
          currentPage: Number(page),
          pageSize: take,
          totalPages: Math.ceil(totalCount / take),
        },
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getAllHotels:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getLatestHotels = async () => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { isActive: true },
      include: {
        hotelImages: true,
        ReviewAndRating: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
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
        avgRating,
      };
    });




    return { rdata: hotelsWithAvgRating, rerror: null };
  } catch (error) {
    console.error('Error in getLatestHotels:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getTopRatedHotels = async () => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { isActive: true },
      include: {
        hotelImages: true,
        ReviewAndRating: true,
      },
    });

    // Calculate average rating for each hotel
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;

      return { ...hotel, avgRating };
    });

    // Filter hotels with an avgRating of 4 or more
    const filteredHotels = hotelsWithAvgRating.filter(
      (hotel) => hotel.avgRating >= 4
    );

    // Sort by average rating in descending order and take top 10
    filteredHotels.sort((a, b) => b.avgRating - a.avgRating);
    const topRatedHotels = filteredHotels.slice(0, 10);

    return { rdata: topRatedHotels, rerror: null };
  } catch (error) {
    console.error('Error in getTopRatedHotels:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getTrendingHotels = async () => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: { isActive: true },
      include: {
        hotelImages: true,
        ReviewAndRating: true,
        bookings: true, // Assuming trending hotels are based on bookings
      },
    });

    // Calculate popularity score (sum of reviews and bookings)
    const hotelsWithTrendingScore = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const totalBookings = hotel.bookings.length;
      const trendingScore = totalReviews + totalBookings; // More reviews & bookings = More trending

      return { ...hotel, trendingScore };
    });

    // Sort by trending score in descending order and take top 10
    hotelsWithTrendingScore.sort((a, b) => b.trendingScore - a.trendingScore);
    const trendingHotels = hotelsWithTrendingScore.slice(0, 10);

    return { rdata: trendingHotels, rerror: null };
  } catch (error) {
    console.error('Error in getTrendingHotels:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getHotelsByCity = async (city, page = 1, pageSize = 10) => {
  try {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Fetch city and associated hotels with pagination
    const cityWithHotels = await prisma.cityAddress.findFirst({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
        isActive: true,
      },
      include: {
        hotels: {
          where: {
            isActive: true,
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
              include: {
                customer: {
                  select: {
                    name: true,
                    gender: true,
                    profileImage: true,
                  },
                },
              },
            },
            hotelImages: true,
          },
          skip,
          take,
        },
      },
    });

    if (!cityWithHotels || cityWithHotels.hotels.length === 0) {
      return {
        data: null,
        error: { status: 404, message: 'No hotels found in this city' },
      };
    }

    // Calculate total hotels in the city for pagination
    const totalHotels = await prisma.hotel.count({
      where: {
        city: {
          equals: city,
          mode: 'insensitive',
        },
        isActive: true,
      },
    });

    // Calculate average rating for each hotel
    const hotelsWithAvgRating = cityWithHotels.hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;

      return {
        ...hotel,
        avgRating,
      };
    });

    return {
      rdata: {
        data: hotelsWithAvgRating,
        pagination: {
          total: totalHotels,
          currentPage: Number(page),
          pageSize: take,
          totalPages: Math.ceil(totalHotels / take),
        },
      },
      error: null,
    };
  } catch (error) {
    console.error('Error in getHotelsByCity service:', error);
    return {
      data: null,
      error: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getHotelById = async (id) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id },
      include: {
        RoomCategories: {
          include: {
            rooms: {
              where: {
                isAvailable: true,
                isActive: true,
              },
            },
          },
        },
        ReviewAndRating: {
          include: {
            customer: {
              select: {
                name: true,
                gender: true,
                profileImage: true,
              },
            },
          },
        },
        hotelImages: true,
        hotelPolicy: {
          select: {
            foreignGuests: true,
            coupleFriendly: true,
            childrenPolicy: true,
            localId: true,
            payAtHotel: true,
            checkOutTime: true,
            checkInTime: true,
            cancellationPolicy: true,
            nonRefundable: true,
          },
        },
      },
    });

    if (!hotel) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Hotel not found' },
      };
    }

    // Calculate average rating for the hotel
    const totalReviews = hotel.ReviewAndRating.length;
    const sumRatings = hotel.ReviewAndRating.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;

    return { rdata: { ...hotel, avgRating }, rerror: null };
  } catch (error) {
    console.error('Error in getHotelById:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const updateHotel = async (id, hotelData) => {
  const {
    type,
    phone,
    website,
    email,
    name,
    city,
    state,
    country,
    zipcode,
    avgPrice,
    location,
    landmark,
    description,
    bannerImage,
    amenities,
    latitude,
    longitude,
  } = hotelData;

  try {
    const hotel = await prisma.hotel.update({
      where: { id },
      data: {
        type,
        phone,
        website,
        email,
        name,
        city,
        state,
        country,
        zipcode,
        avgPrice: parseFloat(avgPrice),
        location,
        landmark,
        description,
        bannerImage,
        amenities: JSON.parse(amenities),
        latitude,
        longitude,
      },
    });

    return { rdata: hotel, rerror: null };
  } catch (error) {
    console.error('Error in updateHotel:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const deleteHotel = async (id) => {
  try {
    const hotel = await prisma.hotel.delete({ where: { id } });
    return { rdata: hotel, rerror: null };
  } catch (error) {
    console.error('Error in deleteHotel:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const toggleHotelStatus = async (hotelId) => {
  try {
    const hotel = await prisma.hotel.findUnique({ where: { id: hotelId } });

    if (!hotel) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Hotel not found!' },
      };
    }

    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { isActive: !hotel.isActive },
    });

    return { rdata: updatedHotel, rerror: null };
  } catch (error) {
    console.error('Error in toggleHotelStatus:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const addHotelImages = async ({ hotelId, category, imageUrls }) => {
  try {
    const ifCategoryExist = await prisma.hotelImage.findMany({
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
          message: 'Category already listed!',
        },
      };
    }

    const hotelImage = await prisma.hotelImage.create({
      data: {
        hotelId,
        category,
        imageUrls,
      },
    });

    return { rdata: hotelImage, rerror: null };
  } catch (error) {
    console.error('Error in addHotelmages:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const updateHotelImages = async ({ hotelId, category, imageUrls }) => {
  console.log('imageUrls', imageUrls);

  try {
    const existingCategory = await prisma.hotelImage.findFirst({
      where: {
        hotelId: hotelId,
        category: {
          equals: category,
          mode: 'insensitive',
        },
      },
    });

    if (!existingCategory) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Category not found for this hotel!',
        },
      };
    }

    const updatedHotelImage = await prisma.hotelImage.update({
      where: { id: existingCategory.id },
      data: { imageUrls },
    });

    return { rdata: updatedHotelImage, rerror: null };
  } catch (error) {
    console.error('Error in updateHotelImages:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const deleteHotelImages = async (id) => {
  try {
    const updatedHotelImage = await prisma.hotelImage.delete({
      where: { id },
    });
    return { rdata: updatedHotelImage, rerror: null };
  } catch (error) {
    console.error('Error in updateHotelImages:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};
