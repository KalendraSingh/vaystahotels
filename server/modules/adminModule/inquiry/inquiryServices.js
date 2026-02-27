import prisma from '../../../config/db.js';

//get all Inquiry service with pagination
export const getAllInquiry = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  try {
    const offset = (page - 1) * limit;
    const inquiries = await prisma.inquiry.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true,
      },
    });

    const totalInquiries = await prisma.inquiry.count();

    return {
      rdata: {
        status: 200,
        inquiries,
        total: totalInquiries,
        page,
        limit,
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in getAllInquiry:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Something went wrong' },
    };
  }
};
