// controllers/customerAuthController.js
import jwt from 'jsonwebtoken';
import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  newCustomer,
  loginCustomer,
  customerLogout,
  newRefreshToken,
  verifyEmail,
  forgotPassword,
  resetPassword,
  sendOTP,
  verifyOTP,
} from './customerAuthService.js';

export const sendOTPController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'email',
      'name',
      'phone',
      'password',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await sendOTP({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in sendOTPController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const verifyOTPController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      'email',
      'enteredOtp',
    ]);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await verifyOTP({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in verifyPhoneController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const newCustomerController = async (req, res) => {
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

    const { rdata, rerror } = await newCustomer({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in newCustomerController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const verifyEmailController = async (req, res) => {
  const verifyId = req.params.id;

  try {
    const { rdata, rerror } = await verifyEmail({ verifyId });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in verifyEmailController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const customerLoginController = async (req, res) => {
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

    const { rdata, rerror } = await loginCustomer({ ...data });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    const { accessToken, refreshToken, customer } = rdata;

    res.cookie('userjwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    res.status(rdata.status).json({ data: customer, accessToken: accessToken });
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};

export const customerLogoutController = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.userjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.userjwt;
    const customer = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!customer) {
      return res.sendStatus(204);
    }

    const { rdata } = await customerLogout({ customer });

    res.clearCookie('userjwt', {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
    });
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send('Something went wrong');
  }
};

export const customerAuthRefreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.userjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.userjwt;
    const { rdata, rerror } = await newRefreshToken({
      refreshToken,
    });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json({ ...rdata });
  } catch (error) {
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

    const { rdata, rerror } = await forgotPassword({ ...data });

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
