import prisma from '../../../config/db.js';
export const createInquiry = async ({
  name,
  lastName,
  email,
  phone,
  message,
}) => {
  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        name,
        lastName,
        email,
        phone,
        message,
      },
    });
    return { rdata: inquiry };
  } catch (error) {
    console.error('Error in createInquiry:', error);
    return { rerror: { status: 500, message: error.message } };
  }
};
