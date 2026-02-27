import prisma from '../../../config/db.js';
import { getPagenationData } from '../../../utils/getData.js';

export const getAllStaff = async ({
  name,
  state,
  phone,
  page,
  pageSize,
  orderby,
  order,
  email,
}) => {
  // Initialize query parameters
  const where = {};
  const orderBy = {};
  let skip = 0;
  let take = 10; // Default page size

  // Pagination: Calculate skip and take values
  if (page) skip = (Number(page) - 1) * Number(pageSize);
  if (pageSize) take = Number(pageSize);

  // Filtering conditions
  if (name) where.name = { contains: name, mode: 'insensitive' };
  if (email) where.email = { contains: email, mode: 'insensitive' };
  if (phone) where.phone = { contains: phone, mode: 'insensitive' };
  if (state) where.state = { contains: state, mode: 'insensitive' };

  // Order by: Apply ordering if provided
  if (orderby && order) orderBy[orderby] = order;

  // Fetch data: Retrieve staff data, omitting sensitive fields
  const data = await prisma.staff.findMany({
    where,
    take,
    skip,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      state: true,
      role: true,
      isActive: true,

      createdAt: true,
      updatedAt: true,
    },
  });

  const totalData = await prisma.staff.count({ where });

  const paginationData = await getPagenationData({
    page,
    pageSize,
    totalData,
  });

  return {
    data,
    totalData,
    ...paginationData,
  };
};

export const getStaffById = async (id) => {
  const data = await prisma.staff.findUnique({
    where: {
      id: id,
    },
    omit: {
      password: true,
      refreshToken: true,
    },
  });
  return data;
};

export const updateStaff = async (id, data) => {
  try {
    const staff = await prisma.staff.update({
      where: {
        id: id,
      },
      data,
      select: {
        id: true,
        name: true,
        gender: true,
        dob: true,
        phone: true,
        street: true,
        pincode: true,
        city: true,
        state: true,
        country: true,
        profileImage: true,
        // Exclude password and refreshToken from response
        password: false,
        refreshToken: false,
      },
    });
    return staff;
  } catch (error) {
    console.error('Error updating staff:', error);
    throw new Error('Failed to update staff');
  }
};

export const toggleActive = async (id) => {
  const getStaff = await prisma.staff.findUnique({
    where: {
      id: id,
    },
  });

  const data = await prisma.staff.update({
    omit: {
      password: true,
      refreshToken: true,
    },
    where: {
      id: id,
    },
    data: {
      isActive: !getStaff.isActive,
    },
  });
  return data;
};

export const assignPermission = async (staffId, permissions) => {
  if (!staffId || !permissions) {
    return { rerror: { status: 400, message: 'Please provide all fields' } };
  }

  try {
    const providedRoutes = [];

    permissions.map(async (route) => {
      const newRoute = await prisma.permitedRoutes.findFirst({
        where: {
          routeName: route.name,
          staffId: staffId,
        },
      });
      if (!newRoute) {
        const createdRoute = await prisma.permitedRoutes.create({
          data: {
            routeName: route.name,
            route: route.route,
            staffId: staffId,
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
