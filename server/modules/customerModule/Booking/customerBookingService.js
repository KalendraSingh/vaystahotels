import prisma from '../../../config/db.js';
import { BookingStatus } from '@prisma/client';
export const getCustomerBookings = async (customerId) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { customerId: customerId },
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            country: true,
            zipcode: true,
            landmark: true,
            location: true,
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

    if (bookings.length === 0) {
      return { rdata: null, error: 'No bookings found for this customer.' };
    }

    return { rdata: bookings, error: null };
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
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
            email: true,
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

export const getCustomerBookingsStatus = async (customerId, status) => {
  try {
    const currentDate = new Date();

    console.log('currentDate', currentDate);
    console.log('status', status);

    let bookings;

    // Determine the status type and construct the query accordingly
    if (status === 'ongoing') {
      bookings = await prisma.booking.findMany({
        where: {
          customerId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] }, // Ongoing statuses
        },
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
    } else if (status === 'upcoming') {
      bookings = await prisma.booking.findMany({
        where: {
          customerId,
          checkIn: { gt: currentDate },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] }, // Upcoming statuses
        },
        orderBy: { checkIn: 'asc' }, // Sort by upcoming check-ins
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
    } else if (status === 'past') {
      bookings = await prisma.booking.findMany({
        where: {
          customerId,
          checkOut: { lt: currentDate },
          status: BookingStatus.CHECKED_OUT, // Past booking status
        },
        orderBy: { checkOut: 'desc' }, // Sort by recent check-outs
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
    } else if (status === 'canceled') {
      bookings = await prisma.booking.findMany({
        where: {
          customerId,
          status: BookingStatus.CANCELED, // Canceled booking status
        },
        orderBy: { updatedAt: 'desc' }, // Sort by most recent cancellations
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
    } else {
      return { rdata: null, error: 'Invalid status provided.' };
    }

    return { rdata: bookings, error: null };
  } catch (error) {
    console.error('Error fetching customer bookings:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};
