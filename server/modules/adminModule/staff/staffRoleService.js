import prisma from '../../../config/db.js';

// Service for creating a new role
export const newRole = async ({ name, rank }) => {
  try {
    const checkRole = await prisma.role.findFirst({
      where: {
        name: {
          equals: name.toLowerCase(),
          mode: 'insensitive',
        },
      },
    });

    if (checkRole) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Role already exists',
        },
      };
    }

    const role = await prisma.role.create({
      data: {
        name,
        rank,
      },
    });

    return {
      rdata: { role, status: 201 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in newRole:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getAllRoles = async () => {
  try {
    const roles = await prisma.role.findMany();

    return {
      rdata: { roles, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getAllRoles:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

// Service for deleting a role
export const deleteRole = async (id) => {
  try {
    const role = await prisma.role.delete({
      where: {
        id,
      },
    });

    return {
      rdata: { role, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in deleteRole:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

// Service for updating a role
export const updateRole = async (id, { name, rank }) => {
  try {
    const role = await prisma.role.update({
      where: {
        id,
      },
      data: {
        name,
        rank,
      },
    });

    return {
      rdata: { role, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in updateRole:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

// Service for retrieving a role by ID (edit)
export const getRoleById = async (id) => {
  try {
    const role = await prisma.role.findUnique({
      where: {
        id,
      },
    });

    if (!role) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Role not found',
        },
      };
    }

    return {
      rdata: { role, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getRoleById:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
