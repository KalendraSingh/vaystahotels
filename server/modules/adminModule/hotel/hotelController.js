import express from 'express';
import {
  createHotel,
  getHotelById,
  updateHotel,
  deleteHotel,
} from '../../hotel/hotelService.js';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  getAllHotels,
  toggleHotelStatus,
  updateHotelPolicyStatus,
} from './hotelServices.js';
import sendMail from '../../../middleware/verifyEmail.js';

const router = express.Router();
export const addNewHotelController = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      hotelImage: req.body.fileUrls.map((file) => file.location),
    };

    const { data, error } = checkRequiredFields(hotelData, [
      'name',
      'city',
      'state',
      'country',
      'zipcode',
      'landmark',
      'hotelImage',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await createHotel(data);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getAllHotelController = async (req, res) => {
  try {
    const {
      name,
      city,
      state,
      search,
      isActive,
      isPaid,
      sortBy,
      sortOrder,
      rating,
      priceOrder,
      paymentStatus,
      policyStatus,
      hotelStatus,
      page = 1,
      pageSize = 10,
    } = req.query;

    const filters = {
      name,
      city,
      state,
      search,
      isActive:
        isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      isPaid: isPaid === 'true' ? true : isPaid === 'false' ? false : undefined,
      rating: rating ? parseInt(rating) : undefined,
      paymentStatus,
      policyStatus,
      hotelStatus,
    };

    const sorting = {
      sortBy: sortBy || (priceOrder === 'High to Low' ? 'avgPrice' : 'name'),
      sortOrder: sortOrder || (priceOrder === 'High to Low' ? 'desc' : 'asc'),
    };

    const { rdata, pagination, rerror } = await getAllHotels(
      filters,
      sorting,
      parseInt(page),
      parseInt(pageSize)
    );

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json({ data: rdata, pagination });
  } catch (error) {
    console.error('Error in getting hotels:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getHotelByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getting hotel by ID:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateHotelController = async (req, res) => {
  const { id } = req.params;

  try {
    const hotelData = {
      ...req.body,
      hotelImage: req.body.fileUrls
        ? req.body.fileUrls.map((file) => file.location)
        : undefined,
    };

    const { rdata, rerror } = await updateHotel(id, hotelData);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in updating hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteHotelController = async (req, res) => {
  const { id } = req.params;

  try {
    const { rdata, rerror } = await deleteHotel(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deleting hotel:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const toggleHotelStatusController = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  console.log(isActive);

  if (typeof isActive !== 'boolean') {
    return res.status(400).json({ message: 'Invalid isActive status' });
  }

  const { data, error } = await toggleHotelStatus(id, isActive);

  if (error) {
    return res.status(error.status).json({ message: error.message });
  }

  return res.status(200).json({
    message: `Hotel has been ${isActive ? 'activated' : 'deactivated'}`,
    data,
  });
};

const getEmailTemplate = (status, rejectionReason) => {
  const rejectionContent =
    status === 'REJECTED'
      ? `<p style="color: red;"><strong>Reason:</strong> ${rejectionReason}</p>`
      : '';

  return `
      <div style="font-family: Arial, sans-serif; color: #333;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <header style="background-color: #0073e6; padding: 16px; text-align: center; color: white;">
            <h2>Your Hotel Policy Update</h2>
          </header>
          <main style="padding: 16px;">
            <h3>Dear Vendor,</h3>
            <p>Your hotel policy status has been updated to <strong style="color: #0073e6;">${status}</strong>.</p>
            ${rejectionContent}
            <p>Thank you for working with Aone Prime Hotel.</p>
          </main>
          <footer style="background-color: #f7f7f7; text-align: center; padding: 16px;">
            <p style="font-size: 12px; color: #555;">Aone Prime Hotel, All rights reserved.</p>
          </footer>
        </div>
      </div>
    `;
};

// Controller to update hotel policy status
export const updateHotelPolicyStatusController = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  if (!['APPROVED', 'REJECTED', 'IN_PROGRESS'].includes(status)) {
    return res.status(400).json({
      message:
        'Invalid status value. Must be APPROVED, REJECTED, or IN_PROGRESS.',
    });
  }

  if (
    status === 'REJECTED' &&
    (!rejectionReason || rejectionReason.trim() === '')
  ) {
    return res.status(400).json({
      message: 'Rejection reason is required when status is REJECTED.',
    });
  }

  try {
    const { pdata, perror } = await updateHotelPolicyStatus(
      id,
      status,
      rejectionReason
    );
    if (perror) {
      return res.status(perror.status).json(perror);
    }

    console.log('pdata', pdata);

    const emailOptions = {
      email: pdata.Vendor.email,
      subject: `Hotel Policy`,
      message: getEmailTemplate(status, rejectionReason),
    };

    await sendMail(emailOptions);
    return res
      .status(200)
      .json({ message: `Policy updated and email sent to vendor.` });
  } catch (error) {
    console.error('Error in updating hotel policy status:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default router;
