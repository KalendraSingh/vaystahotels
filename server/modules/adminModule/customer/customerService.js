import prisma from '../../../config/db.js';

export const getAllCustomers = async (filters) => {
  const { name, email, phone, isActive, page = 1, pageSize = 10 } = filters;

  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);

  const total = await prisma.customer.count({
    where: {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      email: email ? { contains: email, mode: 'insensitive' } : undefined,
      phone: phone ? { contains: phone, mode: 'insensitive' } : undefined,

      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    },
  });

  const data = await prisma.customer.findMany({
    where: {
      name: name ? { contains: name, mode: 'insensitive' } : undefined,
      email: email ? { contains: email, mode: 'insensitive' } : undefined,
      phone: phone ? { contains: phone, mode: 'insensitive' } : undefined,

      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true,
    },
    skip,
    take,
    orderBy: { createdAt: 'desc' },
  });

  return {
    data,
    pagination: {
      total,
      page: Number(page),
      pageSize: take,
    },
  };
};

export const getCustomerById = async (id) => {
  return await prisma.customer.findUnique({
    where: {
      id,
    },
    omit: {
      password: true,
    },
  });
};

export const toggleCustomerStatus = async (id) => {
  const customer = await prisma.customer.findUnique({
    where: { id },
    select: {
      isActive: true,
    },
  });
  return await prisma.customer.update({
    where: { id },
    data: {
      isActive: !customer.isActive,
    },
  });
};

// Delete customer (soft delete by setting isActive to false)
export const deleteCustomer = async (id) => {
  await prisma.vendor.update({
    where: { id },
    data: { isActive: false },
  });
};
