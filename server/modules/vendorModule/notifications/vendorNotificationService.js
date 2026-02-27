import prisma from '../../../config/db.js';

export const getVendorNotifications = async (vendorId) => {
  try {
    const notifications = await prisma.booking.findMany({
      where: {
        Hotel: {
          vendorId,
        },
      },
      include: {
        Hotel: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
    });

    console.log('notifications:', notifications);

    return { rdata: notifications };
  } catch (error) {
    return { error: error.message };
  }
};

export const getNotificationById = async (id) => {
  try {
    const notification = await prisma.booking.findUnique({
      where: {
        id,
      },
      include: {
        Hotel: {
          select: {
            name: true,
          },
        },
        customer: {
          select: {
            name: true,
          },
        },
      },
    });

    return { rdata: notification };
  } catch (error) {
    return { error: error.message };
  }
};
