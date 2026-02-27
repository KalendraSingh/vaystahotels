import prisma from '../../../config/db.js';

// Get all vendors with filters
export const getAllVendors = async (filters) => {
  const { name, email, phone, isActive, page = 1, pageSize = 10 } = filters;

  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);

  const total = await prisma.vendor.count({
    where: {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      email: email ? { contains: email, mode: 'insensitive' } : undefined,
      phone: phone ? { contains: phone, mode: 'insensitive' } : undefined,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    },
  });

  const vendors = await prisma.vendor.findMany({
    where: {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      email: email ? { contains: email, mode: 'insensitive' } : undefined,
      phone: phone ? { contains: phone, mode: 'insensitive' } : undefined,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    },
    skip,
    take,
    omit: {
      password: true,
    },
    include: {
      bankKYC: true,
      hotels: {
        include: {
          ReviewAndRating: true,
        },
      },
    },
  });

  return {
    data: vendors,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: take,
    },
  };
};

// Get vendor by ID
export const getVendorById = async (id) => {
  return await prisma.vendor.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      phone: true,
      isActive: true,
      isVerifiedEmail: true,
      profileImage: true,
      city: true,
      state: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Update vendor details
export const updateVendor = async (id, data) => {
  return await prisma.vendor.update({
    where: { id },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      phone: true,
      isActive: true,
      isVerifiedEmail: true,
      profileImage: true,
      city: true,
      state: true,
      country: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

// Toggle vendor activation
export const toggleVendorActivation = async (id) => {
  const vendor = await prisma.vendor.findUnique({
    where: {
      id,
    },
  });

  return await prisma.vendor.update({
    where: { id },
    data: { isActive: !vendor.isActive },
    select: {
      id: true,
      name: true,
      isActive: true,
    },
  });
};

// Delete vendor (soft delete by setting isActive to false)

export const deleteVendor = async (id) => {
  await prisma.vendor.update({
    where: { id },
    data: { isActive: false },
  });
};

export const getVendorPayments = async (filters) => {
  const {
    vendorName,
    status,
    method,
    maxAmount,
    startDate,
    endDate,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
  } = filters;

  // Build where clause based on available filters
  const whereClause = {};

  if (vendorName) {
    whereClause.vendor = {
      OR: [
        { name: { contains: vendorName, mode: 'insensitive' } },
        { lastName: { contains: vendorName, mode: 'insensitive' } },
      ],
    };
  }

  if (status) {
    whereClause.status = status;
  }

  if (method) {
    whereClause.method = method;
  }

  if (maxAmount) {
    whereClause.amount = {
      lte: parseFloat(maxAmount),
    };
  }

  if (startDate || endDate) {
    whereClause.createdAt = {
      ...(startDate && { gte: new Date(startDate) }),
      ...(endDate && { lte: new Date(endDate) }),
    };
  }

  const orderByClause = {};
  if (['createdAt', 'amount'].includes(sortBy)) {
    orderByClause[sortBy] = sortOrder === 'asc' ? 'asc' : 'desc';
  } else {
    orderByClause.createdAt = 'desc';
  }

  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const vendorPayments = await prisma.vendorPayment.findMany({
    where: whereClause,
    include: {
      vendor: {
        select: {
          name: true,
          lastName: true,
        },
      },
    },
    orderBy: orderByClause,
    skip,
    take,
  });

  const totalCount = await prisma.vendorPayment.count({ where: whereClause });
  const totalAmount = await prisma.vendorPayment.aggregate({
    where: {
      status: 'PAID',
    },
    _sum: {
      amount: true,
    },
  });

  return {
    data: vendorPayments,
    totalAmount: totalAmount._sum.amount,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
    },
  };
};

export const updateKYCStatus = async (id, status, rejectionReason) => {
  try {
    const kycRecord = await prisma.bankKYC.findUnique({
      where: { id },
      include: { vendor: true },
    });

    if (!kycRecord) {
      return {
        kycData: null,
        kycError: { status: 404, message: 'KYC record not found' },
      };
    }

    const updatedKYC = await prisma.bankKYC.update({
      where: { id },
      data: {
        kycStatus: status,
        kycRejectedAt: status === 'REJECTED' ? new Date() : null,
        kycVerifiedAt: status === 'VERIFIED' ? new Date() : null,
        kycRejectionReason: status === 'REJECTED' ? rejectionReason : null,
      },
      include: { vendor: true },
    });

    return { kycData: updatedKYC, kycError: null };
  } catch (error) {
    console.error('Error updating KYC status:', error);
    return {
      kycData: null,
      kycError: { status: 500, message: 'Internal server error' },
    };
  }
};
