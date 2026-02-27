import prisma from '../../../config/db.js';
import { VerificationStatus } from '@prisma/client';

export const createVerificationRequest = async (data) => {
  try {
    const {
      vendorId,
      hotelName,
      address,
      city,
      state,
      pincode,
      gstNo,
      aadharCardImage,
      hotelImages,
    } = data;

    const verification = await prisma.vendorVerification.create({
      data: {
        vendorId,
        hotelName,
        address,
        city,
        state,
        pincode,
        gstNo,
        aadharCardImage,
        hotelImages: {
          set: hotelImages,
        },
      },
    });

    return {
      rdata: { verification, status: 201 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in createVerificationRequest:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getVendorVerifications = async () => {
  try {
    const verifications = await prisma.vendorVerification.findMany();

    return {
      rdata: { verifications, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getVendorVerifications:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const getVerificationById = async (id) => {
  try {
    const verification = await prisma.vendorVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Verification not found',
        },
      };
    }

    return {
      rdata: { verification, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getVerificationById:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const updateVerificationStatus = async (
  id,
  { status, rejectedReason, hotelImages }
) => {
  try {
    const verification = await prisma.vendorVerification.findUnique({
      where: { id },
    });

    if (!verification) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: 'Verification not found',
        },
      };
    }

    const updatedVerification = await prisma.vendorVerification.update({
      where: { id },
      data: {
        status: status || verification.status,
        rejectedReason: rejectedReason || verification.rejectedReason,
        hotelImages: hotelImages
          ? { set: hotelImages }
          : verification.hotelImages, 
        verifiedAt:
          status === VerificationStatus.APPROVED
            ? new Date()
            : verification.verifiedAt,
      },
    });

    return {
      rdata: { updatedVerification, status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in updateVerificationStatus:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};
