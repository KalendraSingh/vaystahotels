import {
  addNewRating,
  getById,
  deleteRating,
} from '../../hotel/hotelRatingService.js';

import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';

export const addNewRatingController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'hotelId',
      'customerId',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await addNewRating(data);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel rating:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getRatingByIdController = async (req, res) => {
  const id = req.params.id;
  try {
    const { rdata, rerror } = await getById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel rating:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteRatingController = async (req, res) => {
  const id = req.params.id;
  try {
    const { rdata, rerror } = await deleteRating(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in creating hotel rating:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
