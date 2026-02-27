import prisma from '../../config/db.js';

export const addNewRating = async ({
  rating,
  comment,
  hotelId,
  customerId,
}) => {
  try {
    const existingReview = await prisma.reviewAndRating.findFirst({
      where: {
        hotelId,
        customerId,
      },
    });

    if (existingReview) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'You have already submitted a review for this hotel.',
        },
      };
    }

    const booking = await prisma.booking.findFirst({
      where: {
        hotelId: hotelId,
      },
    });

    if (!booking) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Booking not found',
        },
      };
    }

    const hotelRating = await prisma.reviewAndRating.create({
      data: {
        rating,
        comment,
        hotelId,
        customerId,
      },
    });
    return { rdata: hotelRating, rerror: null };
  } catch (error) {
    console.error('Error in rating and reviews:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getAllReviews = async () => {
  try {
    const allRating = await prisma.reviewAndRating.findMany();
    if (!allRating) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'rating not found' },
      };
    }
    return { rdata: allRating, eerror: null };
  } catch (error) {
    console.error('Error in rating and reviews:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
export const getById = async (id) => {
  try {
    const rating = await prisma.reviewAndRating.findUnique({
      where: { id },
    });

    if (!rating) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'rating not found' },
      };
    }

    return { rdata: rating, eerror: null };
  } catch (error) {
    console.error('Error in rating and reviews:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
export const updateReview = async (id, { rating, comment }) => {
  try {
    const updateRating = await prisma.reviewAndRating.update({
      where: { id },
      data: {
        rating,
        comment,
      },
    });

    if (!updateRating) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'rating not found' },
      };
    }

    return { rdata: updateRating, rerror: null };
  } catch (error) {
    console.error('Error in rating and reviews:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const deleteRating = async (id) => {
  try {
    const deletedData = await prisma.reviewAndRating.delete({
      where: {
        id,
      },
    });

    return { rdata: deletedData, rerror: null };
  } catch (error) {
    console.error('Error in rating and reviews:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
