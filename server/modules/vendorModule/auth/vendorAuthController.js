import jwt from 'jsonwebtoken';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  loginVendor,
  newRefreshToken,
  newVendor,
  vendorLogout,
  verifyVendorEmail,
  forgotPassword,
  resetPassword,
  newVendorStaff,
} from './vendorAuthService.js';

export const newVendorController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'name',
      'email',
      'password',
      'phone',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await newVendor({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res
      .status(rdata.status)
      .json({ message: rdata.message || 'Vendor created successfully' });
  } catch (error) {
    console.error('Error in newVendorController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const newVendorStaffController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'name',
      'email',
      'password',
      'phone',
      'vendorId',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await newVendorStaff({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res
      .status(rdata.status)
      .json({ message: rdata.message || 'Vendor staff created successfully' });
  } catch (error) {
    console.error('Error in newVendorStaffController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const verifyVendorEmailController = async (req, res) => {
  const verifyId = req.params.id;

  try {
    const { rdata, rerror } = await verifyVendorEmail({ verifyId });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(rdata.status).json({ message: rdata.message });
  } catch (error) {
    console.error('Error in verifyVendorEmailController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const vendorLoginController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'email',
      'password',
    ]);
    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await loginVendor({ ...data, res });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    const {
      accessToken,
      refreshToken,
      role,
      userOptions,
      permittedRoutes,
      vendorId,
    } = rdata;

    res.cookie('vendorjwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(rdata.status).json({
      data: { ...userOptions, role, permittedRoutes, vendorId },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error('Error in vendorLoginController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const vendorLogoutController = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.vendorjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.vendorjwt;
    const vendor = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!vendor) {
      return res.sendStatus(204);
    }

    const { rdata } = await vendorLogout({ vendor });

    res.clearCookie('vendorjwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    res.status(rdata.status).json(rdata);
  } catch (error) {
    // console.error('Error in vendorLogoutController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const vendorAuthRefreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.vendorjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.vendorjwt;
    const { rdata, rerror } = await newRefreshToken({ refreshToken, res });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in vendorAuthRefreshTokenController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ['email']);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await forgotPassword({ email: data.email });

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in forgotPasswordController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ['password']);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await resetPassword({
      token: req.params.token,
      ...data,
    });

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in resetPasswordController:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};
