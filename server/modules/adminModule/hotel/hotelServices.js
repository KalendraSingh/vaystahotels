import prisma from '../../../config/db.js';

export const getAllHotels = async (
  filters,
  sorting,
  page = 1,
  pageSize = 10
) => {
  const { search, rating, paymentStatus, policyStatus, hotelStatus } = filters;

  const { sortBy = 'avgPrice', sortOrder = 'desc' } = sorting;

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        ...(search && {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }),
        ...(hotelStatus && { isActive: hotelStatus === 'true' }),
        ...(paymentStatus && { isPaid: paymentStatus === 'true' }),
        ...(policyStatus && { hotelPolicy: { some: { policyStatus } } }),
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
        hotelPolicy: true,
      },
      orderBy: {
        [sortBy]: sortOrder,
      },
      skip,
      take,
    });

    const totalCount = await prisma.hotel.count({
      where: {
        ...(search && {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }),
        ...(hotelStatus !== undefined && { isActive: hotelStatus === 'true' }),
        ...(paymentStatus && { isPaid: paymentStatus === 'true' }),
      },
    });

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

    let filteredHotels = hotelsWithAvgRating;

    if (rating) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.avgRating >= rating
      );
    }

    return {
      rdata: filteredHotels,
      pagination: {
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize),
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

export const toggleHotelStatus = async (hotelId, isActive) => {
  try {
    const updatedHotel = await prisma.hotel.update({
      where: { id: hotelId },
      data: { isActive },
    });
    return { data: updatedHotel, error: null };
  } catch (error) {
    console.error('Error updating hotel status:', error);
    return {
      data: null,
      error: { message: 'Failed to update hotel status', status: 500 },
    };
  }
};

export const updateHotelPolicyStatus = async (id, status, rejectionReason) => {
  try {
    // Find the policy by id
    const policy = await prisma.vendorHotelPolicy.findUnique({
      where: { id },
      include: { Vendor: true }, // Include related Vendor details for email
    });

    console.log('policy', policy);

    if (!policy) {
      return {
        pdata: null,
        perror: { status: 404, message: 'Policy not found' },
      };
    }

    // Update the policy status and rejection reason if provided
    const updatedPolicy = await prisma.vendorHotelPolicy.update({
      where: { id },
      data: {
        policyStatus: status,
        policyRejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
      include: { Vendor: true }, // Include Vendor for email purposes
    });

    return { pdata: updatedPolicy, perror: null };
  } catch (error) {
    console.error('Error in updating policy status:', error);
    return {
      pdata: null,
      perror: { status: 500, message: 'Internal server error' },
    };
  }
};
