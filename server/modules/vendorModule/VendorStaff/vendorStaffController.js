import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  assignPermission,
  deleteStaff,
  getAllStaffByVendorId,
  toggleActive,
} from './vendorStaffService.js';

export const getAllStaffByVendorIdController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { name, phone, email, isActive } = req.query;

    const { rdata, rerror } = await getAllStaffByVendorId(
      vendorId,
      name,
      phone,
      email,
      isActive
    );

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    if (!rdata.length) {
      return res.status(404).json(rdata, { message: 'No staff found' });
    }

    return res.status(200).json(rdata);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const assignPermissionController = async (req, res) => {
  try {
    const { vendorStaffId, permissions } = req.body;

    const { rdata, rerror } = await assignPermission(
      vendorStaffId,
      permissions
    );
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json({ message: 'Permission assigned' });
  } catch (error) {
    console.error('Error in assigning permission:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const toggleActiveController = async (req, res) => {
  try {
    const { staffId } = req.params;

    const { rdata, rerror } = await toggleActive(staffId);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    return res.status(200).json({ message: 'Staff status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const deleteVendorStaffController = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { rdata, rerror } = await deleteStaff(staffId);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res
      .status(200)
      .json({ message: 'Vendor staff deleted', staff: rdata });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete vendor staff' });
  }
};
