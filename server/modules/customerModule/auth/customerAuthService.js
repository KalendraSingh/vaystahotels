// services/customerAuthService.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../../config/db.js';
import dotenv from 'dotenv';
import sendEmail from '../../../middleware/verifyEmail.js';
import crypto from 'crypto';
import axios from 'axios';

dotenv.config();

export const sendOTP = async ({ email, name, phone, password }) => {
  const checkCustomer = await prisma.customer.findFirst({
    where: {
      email: email,
      phone: phone,
    },
  });

  if (checkCustomer !== null && checkCustomer.isVerifiedEmail) {
    return {
      rdata: null,
      rerror: {
        status: 400,
        message: 'Email or Phone already exist!',
      },
    };
  }

  if (!checkCustomer) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const sendOTP = async (email, otp) => {
    const mailOptions = {
      email: email,
      subject: 'Email Verification - OTP Code',
      message: `
        <p>Dear User,</p>
        <p>Thank you for registering with <strong>Aone Prime Hotel</strong>. To complete your email verification, please use the OTP code provided below:</p>
        <h2 style="color: #4CAF50;">${otp}</h2>
        <p>This OTP is valid for the next 5 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Aone Prime Hotel Support Team</strong></p>
        <p><a href="https://mreverierooms.in/">Visit our website</a></p>
      `,
    };

    try {
      await sendEmail(mailOptions);

      return otp;
    } catch (error) {
      console.error('Error sending OTP email:', error);
      throw error;
    }
  };

  try {
    // Save OTP to the database
    await prisma.otp.create({
      data: {
        email: email,
        otp: otp,
      },
    });

    // Send OTP via email
    const result = await sendOTP(email, otp);

    return {
      rdata: { message: 'OTP sent successfully', status: 200 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in sendOTP:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const verifyOTP = async ({ email, enteredOtp }) => {
  try {
    const otpRecord = await prisma.otp.findFirst({
      where: { email: email },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'OTP not found',
        },
      };
    }

    if (otpRecord.otp === parseInt(enteredOtp)) {
      await prisma.otp.delete({
        where: { id: otpRecord.id },
      });

      await prisma.customer.update({
        where: { email: email },
        data: { isVerifiedEmail: true },
      });

      return {
        rdata: {
          status: 200,
          message: 'OTP verified successfully',
        },
        rerror: null,
      };
    } else {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Invalid OTP',
        },
      };
    }
  } catch (error) {
    console.error('Error in verifyOTP:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Failed to verify OTP',
      },
    };
  }
};

export const newCustomer = async ({ name, email, password, phone }) => {
  try {
    const checkCustomer = await prisma.customer.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (checkCustomer && checkCustomer.isVerifiedEmail) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Email or Phone already exist!',
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
    });

    if (customer) {
      const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${customer.id}`;
      const message = `Verify your Email: Hi ${customer.name}, please click the following link to verify your email: ${verifyURL}`;

      try {
        await sendEmail({
          email: customer.email,
          subject: 'Your Email Verification',
          message,
        });

        return {
          rdata: {
            message: 'Verification link sent to email!',
            status: 200,
          },
          rerror: null,
        };
      } catch (error) {
        console.error('Error sending email:', error);
        return {
          rdata: null,
          rerror: {
            status: 500,
            message: 'Failed to send verification email',
          },
        };
      }
    }

    return {
      rdata: { customer, status: 201 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in newCustomer:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const verifyEmail = async ({ verifyId }) => {
  try {
    const customer = await prisma.customer.findUnique({
      where: {
        id: verifyId,
      },
    });
    if (!customer) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Invalid verification ID',
        },
      };
    }

    await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        isVerifiedEmail: true,
      },
    });

    return {
      rdata: {
        status: 'success',
        message: 'Email verified successfully',
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in verifyEmail:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const loginCustomer = async ({ email, password }) => {
  const checkCustomer = await prisma.customer.findFirst({
    where: { email: email },
  });

  if (checkCustomer && !checkCustomer) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: 'Your email is incorrect',
      },
    };
  }

  // If the email is not verified, send a verification link
  if (checkCustomer && !checkCustomer.isVerifiedEmail) {
    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${checkCustomer.id}`;
    const message = `Verify your Email: Hi ${checkCustomer.name}, please click the following link to verify your email: ${verifyURL}`;

    try {
      await sendEmail({
        email: checkCustomer.email,
        subject: 'Your Email Verification',
        message,
      });

      return {
        rdata: null,
        rerror: {
          status: 403,
          message:
            'Please verify your email! A new verification link has been sent.',
        },
      };
    } catch (error) {
      console.error('Error sending email:', error);
      return {
        rdata: null,
        rerror: {
          status: 500,
          message: 'Failed to send verification email. Please try again later.',
        },
      };
    }
  }

  // Check if password is correct
  const checkPassword = await bcrypt.compare(password, checkCustomer.password);

  if (!checkPassword) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: 'Password is incorrect',
      },
    };
  }

  // Generate tokens
  const customer = {
    id: checkCustomer.id,
    name: checkCustomer.name,
    email: checkCustomer.email,
    phone: checkCustomer.phone,
  };

  const accessToken = jwt.sign({ customer }, process.env.ACCESS_TOKEN, {
    expiresIn: '1d',
  });

  const refreshToken = jwt.sign({ customer }, process.env.REFRESH_TOKEN, {
    expiresIn: '7d',
  });

  // Save refresh token in the database
  await prisma.customer.update({
    where: { id: checkCustomer.id },
    data: { refreshToken: refreshToken },
  });

  return {
    rdata: {
      customer,
      accessToken,
      refreshToken,
      status: 200,
    },
    rerror: null,
  };
};

export const customerLogout = async ({ customer }) => {
  await prisma.customer.update({
    where: { id: customer.customer.id },
    data: { refreshToken: null },
  });
  return {
    rdata: {
      message: 'Logout successful',
      status: 200,
    },
  };
};

export const newRefreshToken = async ({ refreshToken }) => {
  let foundCustomer;

  const { rdata, rerror } = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        return {
          rerror: {
            status: 403,
            message: 'Unauthorized',
          },
        };
      }
      foundCustomer = await prisma.customer.findUnique({
        where: { id: decoded.customer.id },
      });

      if (!foundCustomer || foundCustomer.refreshToken !== refreshToken) {
        return {
          rerror: {
            status: 403,
            message: 'Unauthorized',
          },
        };
      }

      const customer = {
        id: foundCustomer.id,
        name: foundCustomer.name,
        email: foundCustomer.email,
        phone: foundCustomer.phone,
      };

      const newAccessToken = jwt.sign({ customer }, process.env.ACCESS_TOKEN, {
        expiresIn: '1d',
      });

      return {
        rdata: {
          customer: customer,
          accessToken: newAccessToken,
          status: 200,
        },
      };
    }
  );

  return { rdata, rerror };
};

export const forgotPassword = async ({ email }) => {
  try {
    const customer = await prisma.customer.findFirst({
      where: { email },
    });

    if (!customer) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'No customer with this email address' },
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.customer.update({
      where: { id: customer.id },
      data: { resetToken: hash, passwordResetExpires },
    });

    const resetURL = `${process.env.FRONTEND_URL}/customer-forgot-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: customer.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      return {
        rdata: { message: 'Token sent to email!', status: 200 },
        rerror: null,
      };
    } catch (emailError) {
      return {
        rdata: null,
        rerror: { status: 500, message: 'Failed to send email' },
      };
    }
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};

export const resetPassword = async ({ token, password }) => {
  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const customer = await prisma.customer.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: { gt: new Date(Date.now()) },
      },
    });

    if (!customer) {
      return {
        rdata: null,
        rerror: { status: 400, message: 'Token is invalid or has expired' },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null,
      },
    });

    const accessToken = jwt.sign(
      { id: customer.id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: '10d',
      }
    );

    return {
      rdata: { status: 200, accessToken },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in resetPassword:', error);
    return {
      rdata: null,
      rerror: { status: 500, message: 'Internal server error' },
    };
  }
};
