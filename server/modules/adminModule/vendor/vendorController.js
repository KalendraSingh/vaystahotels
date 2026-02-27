import {
  deleteVendor,
  getAllVendors,
  getVendorById,
  getVendorPayments,
  toggleVendorActivation,
  updateVendor,
  updateKYCStatus,
} from './vendorService.js';
import sendMail from '../../../middleware/verifyEmail.js';

export const getAllVendorsController = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getAllVendors(filters);
    res.status(200).json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch vendors', error: error.message });
  }
};

// Get a single vendor by ID
export const getVendorByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getVendorById(id);
    if (vendor) {
      res.status(200).json(vendor);
    } else {
      res.status(404).json({ message: 'Vendor not found' });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to fetch vendor', error: error.message });
  }
};

// Update vendor details
export const updateVendorController = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updatedVendor = await updateVendor(id, data);
    res
      .status(200)
      .json({ message: 'Vendor updated successfully', vendor: updatedVendor });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to update vendor', error: error.message });
  }
};

// Activate or deactivate vendor
export const toggleVendorActivationController = async (req, res) => {
  try {
    const { id } = req.params;

    const vendor = await toggleVendorActivation(id);
    res.status(200).json({
      message: `Vendor ${
        vendor.isActive ? 'activated' : 'deactivated'
      } successfully`,
      vendor,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to update vendor status',
      error: error.message,
    });
  }
};

// Delete vendor

export const deleteVendorController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteVendor(id);
    res.status(200).json({ message: 'Vendor deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete vendor', error: error.message });
  }
};

export const getAllVendorPaymentsController = async (req, res) => {
  try {
    const filters = {
      vendorName: req.query.vendorName,
      status: req.query.status,
      method: req.query.method,
      maxAmount: req.query.maxAmount,
      startDate: req.query.startDate,
      endDate: req.query.endDate,
      sortBy: req.query.sortBy,
      sortOrder: req.query.sortOrder,
      page: parseInt(req.query.page) || 1,
      pageSize: parseInt(req.query.pageSize) || 10,
    };

    const result = await getVendorPayments(filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch vendor payments',
      error: error.message,
    });
  }
};

const getKYCEmailTemplate = (status, rejectionReason) => {
  const statusColor = {
    VERIFIED: '#28a745',
    REJECTED: '#dc3545',
    IN_PROGRESS: '#ffc107',
    PENDING: '#007bff',
  };

  const rejectionContent =
    status === 'REJECTED'
      ? `<p style="color: red;"><strong>Rejection Reason:</strong> ${rejectionReason}</p>`
      : '';

  return `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <header style="background-color: ${statusColor[status]}; padding: 16px; text-align: center; color: white;">
          <h2> Your KYC Update</h2>
        </header>
        <main style="padding: 16px;">
          <h3>Dear Vendor,</h3>
          <p>Your KYC status has been  <strong style="color: ${statusColor[status]};">${status}</strong>.</p>
          ${rejectionContent}
          <p>Thank you for working with our bank.</p>
        </main>
        <footer style="background-color: #f7f7f7; text-align: center; padding: 16px;">
          <p style="font-size: 12px; color: #555;">Our Bank, All rights reserved.</p>
        </footer>
      </div>
    </div>
  `;
};

export const updateKYCStatusController = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;

  if (!['VERIFIED', 'REJECTED', 'IN_PROGRESS', 'PENDING'].includes(status)) {
    return res.status(400).json({
      message:
        'Invalid status value. Must be VERIFIED, REJECTED, IN_PROGRESS, or PENDING.',
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
    const { kycData, kycError } = await updateKYCStatus(
      id,
      status,
      rejectionReason
    );
    if (kycError) {
      return res.status(kycError.status).json(kycError);
    }

    const emailOptions = {
      email: kycData.vendor.email,
      subject: `Your KYC Update`,
      message: getKYCEmailTemplate(status, rejectionReason),
    };

    await sendMail(emailOptions);
    return res
      .status(200)
      .json({ message: 'KYC status updated and email sent to vendor.' });
  } catch (error) {
    console.error('Error in updating KYC status:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
