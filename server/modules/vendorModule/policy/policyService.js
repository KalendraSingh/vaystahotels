import prisma from '../../../config/db.js';

// Service function
export const addVendorHotelPolicy = async ({
  checkInTime,
  checkOutTime,
  childrenPolicy = true,
  localId = true,
  coupleFriendly = true,
  foreignGuests = true,
  workWithChannelManager = false,
  payAtHotel = true,
  ownershipDocument = [],
  propertyImage = [],
  cancellationPolicy,
  nonRefundable = true,
  ownershipType,
  additionalPolicies = null,
  channelManagerDetails = null,
  vendorId,
  hotelId,
}) => {
  try {
    // Validate required fields
    if (
      !checkInTime ||
      !checkOutTime ||
      cancellationPolicy === undefined ||
      !ownershipType
    ) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: 'All required fields must be provided!',
        },
      };
    }

    // Check if a policy already exists for the given hotel and vendor to enforce uniqueness
    const existingPolicy = await prisma.vendorHotelPolicy.findFirst({
      where: {
        vendorId,
        hotelId,
      },
    });

    if (existingPolicy) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: 'Policy for this vendor and hotel already exists!',
        },
      };
    }

    // Create new VendorHotelPolicy entry
    const newPolicy = await prisma.vendorHotelPolicy.create({
      data: {
        checkInTime,
        checkOutTime,
        childrenPolicy: Boolean(childrenPolicy),
        localId: Boolean(localId),
        coupleFriendly: Boolean(coupleFriendly),
        foreignGuests: Boolean(foreignGuests),
        workWithChannelManager: Boolean(workWithChannelManager),
        payAtHotel: Boolean(payAtHotel),
        ownershipDocument,
        propertyImage,
        cancellationPolicy: Boolean(cancellationPolicy),
        nonRefundable: Boolean(nonRefundable),
        ownershipType,
        additionalPolicies,
        channelManagerDetails: channelManagerDetails
          ? {
              create: {
                companyName: channelManagerDetails.companyName || '',
                contactPerson: channelManagerDetails.contactPerson || '',
                email: channelManagerDetails.email || '',
                phone: channelManagerDetails.phone || '',
              },
            }
          : undefined, // set to undefined if no details are provided
        vendorId,
        hotelId,
      },
    });

    return { rdata: newPolicy, rerror: null };
  } catch (error) {
    console.error('Error in creating VendorHotelPolicy:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getAllVendorHotelPoliciesByVendor = async (vendorId) => {
  try {
    const policies = await prisma.vendorHotelPolicy.findMany({
      where: { vendorId },
      include: {
        channelManagerDetails: true,
        Vendor: true,
        Hotel: true,
      },
    });

    if (!policies || policies.length === 0) {
      return {
        rdata: [],
        rerror: {
          status: 404,
          message: 'No policies found for this vendor!',
        },
      };
    }

    return { rdata: policies, rerror: null };
  } catch (error) {
    console.error(
      'Error in getting all VendorHotelPolicies by Vendor ID:',
      error
    );
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getAllVendorHotelPolicies = async () => {
  try {
    const policies = await prisma.vendorHotelPolicy.findMany({
      include: {
        channelManagerDetails: true,
        Vendor: true,
        Hotel: true,
      },
    });

    if (!policies || policies.length === 0) {
      return {
        rdata: [],
        rerror: {
          status: 404,
          message: 'No policies found!',
        },
      };
    }

    return { rdata: policies, rerror: null };
  } catch (error) {
    console.error('Error in getting all VendorHotelPolicies:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getVendorHotelPolicyById = async (id) => {
  try {
    const policy = await prisma.vendorHotelPolicy.findUnique({
      where: { id },
      include: {
        channelManagerDetails: true,
        Vendor: true,
        Hotel: true,
      },
    });

    if (!policy) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Policy not found!',
        },
      };
    }

    return { rdata: policy, rerror: null };
  } catch (error) {
    console.error('Error in getting VendorHotelPolicy by ID:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const deleteVendorHotelPolicy = async (id) => {
  try {
    const policy = await prisma.vendorHotelPolicy.findUnique({ where: { id } });

    if (!policy) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Policy not found!',
        },
      };
    }

    await prisma.vendorHotelPolicy.delete({ where: { id } });
    return { rdata: { message: 'Policy deleted successfully' }, rerror: null };
  } catch (error) {
    console.error('Error in deleting VendorHotelPolicy:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
