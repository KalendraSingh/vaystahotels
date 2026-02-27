import { getAllInquiry } from './inquiryServices.js';

//get all Inquiry controller
export const getAllInquiryController = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const { rdata, rerror } = await getAllInquiry({ page, limit });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in getAllInquiryController:', error);
    res.status(500).send('Something went wrong');
  }
};
