import prisma from '../../../config/db.js';
import { BookingStatus } from '@prisma/client';

export const getAllBookings = async () => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            description: true,
            avgPrice: true,
            bannerImage: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true,
          },
        },
      },
    });
    return { rdata: bookings, error: null };
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getBookingByBookingId = async (bookingId) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            location: true,
            description: true,
            avgPrice: true,
            bannerImage: true,
            website: true,
            phone: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true,
          },
        },
      },
    });

    if (!booking) {
      return { rdata: null, error: 'No booking found for this ID.' };
    }

    return { rdata: booking, error: null };
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getAdminBookingsStatus = async (
  hotelId,
  status,
  startDate,
  endDate,
  page,
  pageSize
) => {
  try {
    const parsedStartDate = startDate ? new Date(startDate) : undefined;
    const parsedEndDate = endDate ? new Date(endDate) : undefined;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    // Define common conditions for filtering
    const hotelCondition = hotelId ? { hotelId } : {};
    let statusCondition = {};

    // Set the date conditions and status-specific filters based on the booking status
    let dateCondition = {};
    if (status === 'ongoing') {
      dateCondition = {
        checkIn: { lte: parsedEndDate || new Date() },
        checkOut: { gte: parsedStartDate || new Date() },
      };
      statusCondition = {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] },
      };
    } else if (status === 'upcoming') {
      dateCondition = { checkIn: { gte: parsedStartDate || new Date() } };
      statusCondition = {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
      };
    } else if (status === 'past') {
      dateCondition = { checkOut: { lte: parsedEndDate || new Date() } };
      statusCondition = { status: BookingStatus.CHECKED_OUT };
    } else if (status === 'canceled') {
      dateCondition = {
        updatedAt: { gte: parsedStartDate, lte: parsedEndDate },
      };
      statusCondition = { status: BookingStatus.CANCELED };
    } else {
      return { rdata: null, error: 'Invalid status provided.' };
    }

    // Apply filters to main booking retrieval with pagination
    const bookings = await prisma.booking.findMany({
      where: {
        ...hotelCondition,
        ...dateCondition,
        ...statusCondition,
      },
      skip,
      take,
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            description: true,
            avgPrice: true,
            bannerImage: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true,
          },
        },
      },
      orderBy:
        status === 'upcoming'
          ? { checkIn: 'asc' }
          : status === 'past' || status === 'canceled'
          ? { updatedAt: 'desc' }
          : {},
    });

    // Apply the same filters to get the total count for pagination
    const total = await prisma.booking.count({
      where: {
        ...hotelCondition,
        ...dateCondition,
        ...statusCondition,
      },
    });

    // Return response with data and pagination details
    return {
      rdata: {
        data: bookings,
        pagination: {
          total,
          page: Number(page),
          pageSize: take,
        },
      },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};
