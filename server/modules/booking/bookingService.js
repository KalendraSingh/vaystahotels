import prisma from '../../config/db.js';

// Create a new Guest with optional GST and Customer details
export const createGuest = async ({
  name,
  email,
  phone,
  gstNumber,
  companyName,
  address,
  country,
  customerId,
}) => {
  console.log('createGuest:', name, phone);
  try {
    if (!name || !phone) {
      return {
        rdata: null,
        rerror: { status: 400, message: 'Name and phone are required' },
      };
    }
    // Prepare guest data
    const guestData = {
      name,
      email,
      phone,
      gstNumber,
      companyName,
      address,
      country,
    };

    // If customerId is provided, associate the guest with a customer
    if (customerId) {
      const customerExists = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customerExists) {
        return {
          rdata: null,
          rerror: { status: 404, message: 'Customer not found' },
        };
      }
      guestData.customerId = customerId;
    }

    const guest = await prisma.guest.create({
      data: guestData,
    });

    return { rdata: guest, rerror: null };
  } catch (error) {
    console.error('Error in createGuest:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Get All Guests with optional Customer details
export const getAllGuests = async () => {
  try {
    const guests = await prisma.guest.findMany({});
    return { rdata: guests, rerror: null };
  } catch (error) {
    console.error('Error in getAllGuests:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Get a single Guest by ID with Customer details
export const getGuestById = async (id) => {
  try {
    const guest = await prisma.guest.findUnique({
      where: { id },
    });
    if (!guest) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Guest not found' },
      };
    }
    return { rdata: guest, rerror: null };
  } catch (error) {
    console.error('Error in getGuestById:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Update a Guest (with optional update for GST and Customer details)
export const updateGuest = async (
  id,
  { name, email, phone, gstNumber, companyName, address, country, customerId }
) => {
  try {
    // Check if guest exists
    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Guest not found' },
      };
    }

    const updateData = {
      name,
      email,
      phone,
      gstNumber,
      companyName,
      address,
      country,
    };

    // If customerId is provided, associate the guest with a customer
    if (customerId) {
      const customerExists = await prisma.customer.findUnique({
        where: { id: customerId },
      });
      if (!customerExists) {
        return {
          rdata: null,
          rerror: { status: 404, message: 'Customer not found' },
        };
      }
      updateData.customerId = customerId;
    }

    const updatedGuest = await prisma.guest.update({
      where: { id },
      data: updateData,
    });

    return { rdata: updatedGuest, rerror: null };
  } catch (error) {
    console.error('Error in updateGuest:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

// Delete a Guest (and remove related data if applicable)
export const deleteGuest = async (id) => {
  try {
    const guest = await prisma.guest.findUnique({ where: { id } });
    if (!guest) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'Guest not found' },
      };
    }

    await prisma.guest.delete({
      where: { id },
    });

    return { rdata: { message: 'Guest deleted successfully' }, rerror: null };
  } catch (error) {
    console.error('Error in deleteGuest:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const getBookingById = async (bookingId) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        room: true,
      },
    });

    if (!booking) {
      return { rdata: null, error: 'Booking not found' };
    }

    return { rdata: booking, error: null };
  } catch (error) {
    console.error('Error fetching booking by ID:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};

export const getAllBookings = async (filters) => {
  try {
    const { status, startDate, endDate } = filters;

    const bookings = await prisma.booking.findMany({
      where: {
        ...(status && { status }),
        ...(startDate &&
          endDate && {
            bookingDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      },
      include: {
        customer: true,
        room: true,
      },
      orderBy: { bookingDate: 'desc' },
    });

    return { rdata: bookings, error: null };
  } catch (error) {
    console.error('Error fetching bookings with filters:', error);
    return { rdata: null, error: 'Internal Server Error' };
  }
};
