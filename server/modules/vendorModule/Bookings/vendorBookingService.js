import prisma from '../../../config/db.js';
import { BookingStatus } from '@prisma/client';
import { subDays, startOfDay } from 'date-fns';

export const getVendorHotelBookings = async (vendorId) => {
  try {
    const bookings = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      select: {
        hotels: {
          select: {
            id: true,
            name: true,
            bookings: {
              select: {
                id: true,
                checkIn: true,
                checkOut: true,
                status: true,
                adultCount: true,
                roomCount: true,
                roomDetails: true,
                customer: {
                  select: {
                    name: true,
                    email: true,
                    phone: true,
                    gender: true,
                    profileImage: true,
                  },
                },
                payment: {
                  select: {
                    amount: true,
                    gstAmount: true,
                    discountAmount: true,
                    status: true,
                    method: true,
                    createdAt: true,
                    updatedAt: true,
                  },
                },
              },
            },
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

export const getAllVendorHotelRatingsService = async (vendorId) => {
  try {
    const ratings = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        hotels: {
          select: {
            name: true,
            ReviewAndRating: {
              select: {
                rating: true,
                comment: true,
                customer: {
                  select: {
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return { rdata: ratings, error: null };
  } catch (error) {
    console.error('Error fetching vendor hotel ratings:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getNewestBookingService = async (vendorId) => {
  try {
    const newestBooking = await prisma.booking.findFirst({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        Hotel: {
          select: {
            name: true,
            city: true,
          },
        },
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return { rdata: newestBooking, error: null };
  } catch (error) {
    console.error('Error fetching newest booking:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getCheckInOutOfTheDayService = async (vendorId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkInOut = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        OR: [{ status: 'CHECKED_IN' }, { status: 'CHECKED_OUT' }],
        checkIn: {
          gte: today,
        },
        checkOut: {
          gte: today,
        },
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        Hotel: {
          select: {
            name: true,
          },
        },
      },
    });

    return { rdata: checkInOut, error: null };
  } catch (error) {
    console.error('Error fetching check-in and check-out of the day:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

// Service for fetching all CHECKED_IN and CHECKED_OUT bookings
export const getAllCheckInOutService = async (vendorId) => {
  try {
    const checkInOut = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        OR: [{ status: 'CHECKED_IN' }, { status: 'CHECKED_OUT' }],
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        Hotel: {
          select: {
            name: true,
          },
        },
      },
    });

    return { rdata: checkInOut, error: null };
  } catch (error) {
    console.error('Error fetching all check-in and check-out:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getAllAvailableRoomsService = async (vendorId) => {
  try {
    const availableRooms = await prisma.hotel.findMany({
      where: {
        vendorId: vendorId,
      },
      select: {
        name: true,
        rooms: {
          where: {
            isAvailable: true,
          },
          select: {
            id: true,
            RoomCategory: {
              select: {
                category: true,
                roomSize: true,
                bedType: true,
                price: true,
                discount: true,
                adultCount: true,
                perGuestPrice: true,
                discountedPrice: true,
                categoryImage: true,
              },
            },
          },
        },
      },
    });

    return { rdata: availableRooms, error: null };
  } catch (error) {
    console.error('Error fetching available rooms:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getBookingStatusOfTheDayService = async (vendorId) => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);

  try {
    const bookings = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        updatedAt: {
          gte: today,
          lt: tomorrow,
        },
      },
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
        checkIn: true,
        checkOut: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        Hotel: {
          select: {
            name: true,
          },
        },
      },
    });

    const confirmed = bookings.filter(
      (booking) => booking.status === 'CONFIRMED'
    );
    const pending = bookings.filter((booking) => booking.status === 'PENDING');
    const canceled = bookings.filter(
      (booking) => booking.status === 'CANCELED'
    );

    const failed = bookings.filter((booking) => booking.status === 'FAILED');
    const checkedIn = bookings.filter(
      (booking) => booking.status === 'CHECKED_IN'
    );
    const checkedOut = bookings.filter(
      (booking) => booking.status === 'CHECKED_OUT'
    );

    return {
      rdata: { confirmed, pending, canceled, failed, checkedIn, checkedOut },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching booking status of the day:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

// Service to get total booking status for a specific vendor
export const getTotalBookingStatusService = async (vendorId) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
      },
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
        checkIn: true,
        checkOut: true,
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
        Hotel: {
          select: {
            name: true,
          },
        },
      },
    });

    const confirmed = bookings.filter(
      (booking) => booking.status === 'CONFIRMED'
    );
    const pending = bookings.filter((booking) => booking.status === 'PENDING');
    const canceled = bookings.filter(
      (booking) => booking.status === 'CANCELED'
    );
    const failed = bookings.filter((booking) => booking.status === 'FAILED');
    const checkedIn = bookings.filter(
      (booking) => booking.status === 'CHECKED_IN'
    );
    const checkedOut = bookings.filter(
      (booking) => booking.status === 'CHECKED_OUT'
    );

    return {
      rdata: { confirmed, pending, canceled, failed, checkedIn, checkedOut },
      error: null,
    };
  } catch (error) {
    console.error('Error fetching total booking status:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getTodayCheckInsService = async (
  vendorId,
  search,
  hotelId,
  date
) => {
  try {
    const startDate = date ? new Date(date) : new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    const searchFilter = search
      ? {
          OR: [
            { customer: { name: { contains: search, mode: 'insensitive' } } },
            { customer: { email: { contains: search, mode: 'insensitive' } } },
            { customer: { phone: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const checkIns = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId: vendorId,
          ...(hotelId ? { id: hotelId } : {}),
        },
        checkIn: {
          gte: startDate,
          lt: endDate,
        },
        OR: [{ status: 'CONFIRMED' }, { status: 'CHECKED_IN' }],
        ...searchFilter,
      },
      select: {
        checkIn: true,
        checkOut: true,
        id: true,
        status: true,
        roomDetails: true,
        payment: true,
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            guest: true,
          },
        },
        Hotel: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    const filteredCheckIns = checkIns.map((booking) => ({
      ...booking,
      customer: {
        ...booking.customer,
        guest: booking.customer.guest.filter(
          (guest) =>
            guest.createdAt &&
            booking.createdAt &&
            guest.createdAt.toISOString().split('T')[0] ===
              booking.createdAt.toISOString().split('T')[0]
        ),
      },
    }));

    return { rdata: filteredCheckIns, error: null };
  } catch (error) {
    console.error('Error fetching check-ins:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getTodayCheckOutsService = async (
  vendorId,
  search,
  hotelId,
  date
) => {
  try {
    const startDate = date ? new Date(date) : new Date();
    startDate.setUTCHours(0, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);

    const searchFilter = search
      ? {
          OR: [
            { customer: { name: { contains: search, mode: 'insensitive' } } },
            { customer: { email: { contains: search, mode: 'insensitive' } } },
            { customer: { phone: { contains: search, mode: 'insensitive' } } },
          ],
        }
      : {};

    const checkedOutBookings = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId: vendorId,
          ...(hotelId ? { id: hotelId } : {}),
        },
        checkOut: {
          gte: startDate,
          lt: endDate,
        },
        status: 'CHECKED_OUT',
        ...searchFilter,
      },
      select: {
        checkOut: true,
        checkIn: true,
        status: true,
        updatedAt: true,
        payment: true,
        roomDetails: true,
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            guest: true,
          },
        },
        Hotel: {
          select: {
            name: true,
          },
        },
        createdAt: true,
      },
    });

    const filteredBookings = checkedOutBookings.map((booking) => ({
      ...booking,
      customer: {
        ...booking.customer,
        guest: booking.customer.guest.filter(
          (guest) =>
            guest.createdAt &&
            booking.createdAt &&
            guest.createdAt.toISOString().split('T')[0] ===
              booking.createdAt.toISOString().split('T')[0]
        ),
      },
    }));

    return { rdata: filteredBookings, error: null };
  } catch (error) {
    console.error('Error fetching checkouts:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const vendorInventoryService = async (vendorId, filter) => {
  console.log('filter', filter);
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);

    let result;

    if (filter === 'CHECKED_OUT') {
      result = await prisma.booking.findMany({
        where: {
          Hotel: {
            vendorId: vendorId,
          },
          status: 'CHECKED_OUT',
          updatedAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          Hotel: {
            select: {
              name: true,
            },
          },
          payment: true,
        },
      });
    } else if (filter === 'OCCUPIED') {
      result = await prisma.roomCategory.findMany({
        where: {
          Hotel: {
            vendorId: vendorId,
          },
        },
        include: {
          Hotel: {
            select: {
              name: true,
            },
          },
          rooms: {
            where: {
              isAvailable: false,
            },
          },
        },
      });
    } else if (filter === 'AVAILABLE') {
      result = await prisma.roomCategory.findMany({
        where: {
          Hotel: {
            vendorId: vendorId,
          },
        },
        include: {
          Hotel: {
            select: {
              name: true,
            },
          },
          rooms: {
            where: {
              isAvailable: true,
            },
          },
        },
      });
    } else if (filter === 'NEW_BOOKINGS') {
      result = await prisma.booking.findMany({
        where: {
          Hotel: {
            vendorId: vendorId,
          },
          status: 'CONFIRMED',
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true,
            },
          },
          Hotel: {
            select: {
              name: true,
            },
          },
          payment: true,
        },
      });
    }

    return { rdata: result, error: null };
  } catch (error) {
    console.error('Error fetching vendor data:', error);
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

export const getVendorBookingsStatus = async (hotelId, status, date) => {
  try {
    const selectedDate = date ? new Date(date) : new Date();

    let bookings;

    // Determine the status type and construct the query accordingly
    if (status === 'ongoing') {
      bookings = await prisma.booking.findMany({
        where: {
          hotelId,
          checkIn: { lte: selectedDate },
          checkOut: { gte: selectedDate },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] },
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
          hotelId,
          checkIn: { gte: selectedDate },
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        },
        orderBy: { checkIn: 'asc' },
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
          hotelId,
          checkOut: { lte: selectedDate },
          status: BookingStatus.CHECKED_OUT,
        },
        orderBy: { checkOut: 'desc' },
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
          hotelId,
          status: BookingStatus.CANCELED,
          updatedAt: { lte: selectedDate },
        },
        orderBy: { updatedAt: 'desc' },
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

// Service function to get the vendor's booking summary with additional details
export const getVendorBookingSummary = async (vendorId) => {
  try {
    const currentDate = new Date();
    const startOfDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));

    // Fetch the required data counts for the vendor's hotel(s)
    const totalBookings = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
      },
    });

    const confirmedBookings = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        status: 'CONFIRMED',
      },
    });

    const newBookingsToday = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totalCheckIns = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        status: 'CHECKED_IN',
      },
    });

    const totalCheckOuts = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        status: 'CHECKED_OUT',
      },
    });

    const checkInsToday = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        status: 'CHECKED_IN',
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const checkOutsToday = await prisma.booking.count({
      where: {
        Hotel: {
          vendorId: vendorId,
        },
        status: 'CHECKED_OUT',
        updatedAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const availableRooms = await prisma.room.count({
      where: {
        hotel: {
          vendorId: vendorId,
        },
        isAvailable: true,
      },
    });

    const bookedRooms = await prisma.room.count({
      where: {
        hotel: {
          vendorId: vendorId,
        },
        isAvailable: false,
      },
    });

    // Return all summary counts in one response object
    return {
      bookedRooms,
      allBookings: totalBookings,
      newBookingsToday,
      confirmedBookings,
      checkInsToday,
      checkOutsToday,
      totalCheckIns,
      totalCheckOuts,
      availableRooms,
    };
  } catch (error) {
    console.error('Failed to fetch booking summary', error);
    throw new Error('Failed to fetch booking summary');
  }
};

export const getVendorBookingChartData = async (vendorId) => {
  try {
    const bookings = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      select: {
        hotels: {
          select: {
            bookings: {
              where: {
                payment: {
                  some: { status: 'PAID' },
                },
              },
              select: {
                id: true,
                checkIn: true,
                status: true,
                payment: {
                  select: {
                    amount: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!bookings) {
      return {
        weeklyData: null,
        monthlyData: null,
        error: 'No bookings found for this vendor.',
      };
    }

    const allBookings = bookings.hotels.flatMap((hotel) => hotel.bookings);

    const weeklyData = Array(7)
      .fill(0)
      .map((_, i) => ({
        day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i],
        bookings: 0,
        revenue: 0,
      }));

    const monthlyData = Array(4)
      .fill(0)
      .map((_, i) => ({
        week: `Week ${i + 1}`,
        bookings: 0,
        revenue: 0,
      }));

    const now = new Date();
    allBookings.forEach((booking) => {
      const bookingDate = new Date(booking.checkIn);
      const dayOfWeek = bookingDate.getDay();
      const weekOfMonth = Math.floor((bookingDate.getDate() - 1) / 7);

      const bookingAmount = booking.payment.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );

      // Update weekly data
      weeklyData[dayOfWeek].bookings += 1;
      weeklyData[dayOfWeek].revenue += bookingAmount;

      // Update monthly data
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        monthlyData[weekOfMonth].bookings += 1;
        monthlyData[weekOfMonth].revenue += bookingAmount;
      }
    });

    return { weeklyData, monthlyData, error: null };
  } catch (error) {
    console.error('Error fetching vendor bookings:', error);
    return {
      weeklyData: null,
      monthlyData: null,
      error: 'Internal Server Error',
    };
  }
};
