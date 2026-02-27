import prisma from '../../../config/db.js';

// Update Customer Profile
export const updateVendorProfile = async (id, profileData) => {
  try {
    const vendor = await prisma.vendor.update({
      where: { id },
      data: profileData,
    });
    return { rdata: vendor, rerror: null };
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

// Get Customer Profile by ID
export const getVendorProfileById = async (id) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
    });
    if (!vendor) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Customer not found',
        },
      };
    }

    return { rdata: vendor, rerror: null };
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

// Delete Customer Profile by ID

export const deleteVendorProfile = async (id) => {
  try {
    await prisma.vendor.delete({
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
