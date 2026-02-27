import prisma from '../../../config/db.js';

export const getAllStaffByVendorId = async (
  vendorId,
  name,
  phone,
  email,
  isActive
) => {
  try {
    const staff = await prisma.vendorStaff.findMany({
      where: {
        vendorId,
        name: { contains: name, mode: 'insensitive' },
        phone: { contains: phone, mode: 'insensitive' },
        email: { contains: email, mode: 'insensitive' },
        isActive:
          isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      },

      orderBy: {
        createdAt: 'desc',
      },
    });

    return { rdata: staff };
  } catch (error) {
    console.error('Error in retrieving staff by vendor:', error);
    return { rerror: { status: 500, message: 'Something went wrong' } };
  }
};

export const assignPermission = async (vendorStaffId, permissions) => {
  if (!vendorStaffId || !permissions) {
    return { rerror: { status: 400, message: 'Please provide all fields' } };
  }

  try {
    const providedRoutes = [];

    permissions.map(async (route) => {
      const newRoute = await prisma.permitedRoutes.findFirst({
        where: {
          routeName: route.name,
          vendorStaffId,
        },
      });
      if (!newRoute) {
        const createdRoute = await prisma.permitedRoutes.create({
          data: {
            routeName: route.name,
            route: route.route,
            vendorStaffId,
          },
        });
        providedRoutes.push(createdRoute);
      }
    });

    return { rdata: providedRoutes };
  } catch (error) {
    return { rerror: { status: 500, message: 'Something went wrong' } };
  }
};

export const toggleActive = async (staffId) => {
  if (!staffId === undefined) {
    return { rerror: { status: 400, message: 'Please provide all fields' } };
  }

  const getStaff = await prisma.vendorStaff.findUnique({
    where: {
      id: staffId,
    },
  });

  try {
    const updatedStaff = await prisma.vendorStaff.update({
      where: {
        id: staffId,
      },
      data: {
        isActive: !getStaff.isActive,
      },
    });

    return { rdata: updatedStaff };
  } catch (error) {
    console.error('Error in updating staff status:', error);
    return { rerror: { status: 500, message: 'Something went wrong' } };
  }
};

export const deleteStaff = async (staffId) => {
  if (!staffId) {
    return { rerror: { status: 400, message: 'Please provide all fields' } };
  }

  const deletedStaff = await prisma.vendorStaff.delete({
    where: {
      id: staffId,
    },
  });

  return { rdata: deletedStaff };
};
