import prisma from '../../../config/db.js';

export const createPermitedRoutes = async ({ staffId, routeNames }) => {
  try {
    const createdPermitedRoutes = [];

    // Check if the staff member exists
    const userStaff = await prisma.staff.findUnique({
      where: { id: staffId },
    });

    if (!userStaff) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Staff record not found',
        },
      };
    }

    // Remove duplicates from routeNames array
    const uniquePermitedRoutes = [...new Set(routeNames)];
    let duplicateFound = false;

    for (let i = 0; i < uniquePermitedRoutes.length; i++) {
      const permittedRoute = uniquePermitedRoutes[i];

      // Check if the route already exists for the staff member
      const isDuplicatePermission = await prisma.permitedRoutes.findFirst({
        where: {
          routeName: permittedRoute,
          staffId: staffId,
        },
      });

      if (isDuplicatePermission) {
        duplicateFound = true;
        continue;
      }

      // Create the permitted route
      const createdRoute = await prisma.permitedRoutes.create({
        data: {
          routeName: permittedRoute,
          staff: {
            connect: {
              id: staffId,
            },
          },
        },
      });

      createdPermitedRoutes.push(createdRoute);
    }

    if (duplicateFound) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Some duplicate permissions were found and skipped',
        },
      };
    }

    return {
      rdata: {
        message: 'Permitted routes created successfully',
        createdPermitedRoutes,
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in createPermitedRoutes:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const deletePermitedRoutes = async ({ staffId, permitedRouteId }) => {
  try {
    const userStaff = await prisma.permitedRoutes.findFirst({
      where: { id: permitedRouteId, staffId: staffId },
    });

    if (!userStaff) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Permitted route not found for the given staff ID',
        },
      };
    }

    // Delete the permitted route
    await prisma.permitedRoutes.delete({
      where: {
        id: permitedRouteId,
      },
    });

    return {
      rdata: {
        message: 'Permitted route deleted successfully',
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in deletePermitedRoutes:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getPermittedRouteByStaffId = async ({ staffId }) => {
  try {
    const findPermittedRoutes = await prisma.permitedRoutes.findMany({
      where: {
        staffId: staffId,
      },
    });

    if (!findPermittedRoutes.length) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'No permitted routes found for the given staff ID',
        },
      };
    }

    return {
      rdata: findPermittedRoutes,
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getPermittedRouteByStaffId:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
