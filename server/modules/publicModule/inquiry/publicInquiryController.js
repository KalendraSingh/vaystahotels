import { createInquiry } from './inquiryService.js';

export const createInquiryController = async (req, res) => {
  const { name, lastName, email, phone, message } = req.body;
  try {
    const { rdata, rerror } = await createInquiry({
      name,
      lastName,
      email,
      phone,
      message,
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in creating inquiry:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
