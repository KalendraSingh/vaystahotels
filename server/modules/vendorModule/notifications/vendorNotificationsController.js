import {
  getNotificationById,
  getVendorNotifications,
} from './vendorNotificationService.js';

export const getAllVendorNotificationController = async (req, res) => {
  const { vendorId } = req.params;
  if (!vendorId) {
    return res.status(400).json({ message: 'Vendor ID is required' });
  }

  try {
    const { rdata, rerror } = await getVendorNotifications(vendorId);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getAllVendorNotifications:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};

export const getNotificationByIdController = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: 'Notification ID is required' });
  }

  try {
    const { rdata, rerror } = await getNotificationById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getNotificationById:', error);
    return res.status(500).json({ message: 'Something went wrong' });
  }
};
