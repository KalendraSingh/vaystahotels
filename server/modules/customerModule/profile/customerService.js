import prisma from '../../../config/db.js';

export const updateCustomerProfile = async (id, profileData) => {
  try {
    const customer = await prisma.customer.update({
      where: { id },
      data: profileData,
    });
    return { rdata: customer, rerror: null };
  } catch (error) {
    console.error('Error in updateCustomerProfile:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getCustomerProfileById = async (id) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Customer not found',
        },
      };
    }

    return { rdata: customer, rerror: null };
  } catch (error) {
    console.error('Error in getCustomerProfileById:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const deleteCustomerProfile = async (id) => {
  try {
    await prisma.customer.delete({
      where: { id },
    });
    return {
      rdata: { message: 'Customer deleted successfully' },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in deleteCustomerProfile:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
