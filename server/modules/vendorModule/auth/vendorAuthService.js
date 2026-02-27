import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../../config/db.js';
import dotenv from 'dotenv';
import sendEmail from '../../../middleware/verifyEmail.js';
import crypto from 'crypto';

dotenv.config();

export const newVendor = async ({
  name,
  email,
  password,
  phone,
  lastName,
  agreeTerms,
}) => {
  try {
    const checkVendor = await prisma.vendor.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (checkVendor) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Email or Phone already exist!',
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendor = await prisma.vendor.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        phone,
        isVerifiedEmail: false,
        agreeTerms: Boolean(agreeTerms),
      },
    });

    if (vendor) {
      const verifyURL = `${process.env.FRONTEND_URL}/verify-vendor-email/${vendor.id}`;
      const message = `Hi ${vendor.name}, Please click this link to verify your email: ${verifyURL}`;
      try {
        await sendEmail({
          email: vendor.email,
          subject: 'Verify Your Email!',
          message,
        });
        return {
          rdata: { message: 'Verification link sent to email!', status: 200 },
          rerror: null,
        };
      } catch (error) {
        console.error('Error sending verification email:', error);
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
      rdata: { vendor, status: 201 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in newVendor:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const newVendorStaff = async ({
  name,
  email,
  password,
  phone,
  vendorId,
  roleId,
}) => {
  try {
    const checkVendorStaff = await prisma.vendorStaff.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    const checkVendor = await prisma.vendor.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (checkVendor) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Email or phone already used in another account',
        },
      };
    }

    if (checkVendorStaff) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Vendor staff already exists',
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const vendorStaff = await prisma.vendorStaff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        isVerifiedEmail: true,
        role: {
          connect: {
            id: roleId,
          },
        },
        vendor: {
          connect: {
            id: vendorId,
          },
        },
      },
    });

    return {
      rdata: { vendorStaff, status: 201 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in newVendorStaff:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const verifyVendorEmail = async ({ verifyId }) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: {
        id: verifyId,
      },
    });

    if (!vendor) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Invalid verification ID',
        },
      };
    }

    await prisma.vendor.update({
      where: {
        id: vendor.id,
      },
      data: {
        isVerifiedEmail: true,
      },
    });

    return {
      rdata: {
        status: 200,
        message: 'Email verified successfully',
      },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in verifyVendorEmail:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const loginVendor = async ({ email, password }) => {
  let role = 'vendor';
  let permittedRoutes = [];
  let vendorId = '';

  // Check if the user is a vendor
  let user = await prisma.vendor.findFirst({
    where: { email },
  });

  if (!user) {
    // If not found in vendors, check in vendorStaff
    user = await prisma.vendorStaff.findFirst({
      where: { email },
    });

    if (user) {
      role = 'vendorStaff';
      vendorId = user.vendorId;
      permittedRoutes = await prisma.permitedRoutes.findMany({
        where: { vendorStaffId: user.id },
      });
    }
  }

  // If user is not found
  if (!user) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: 'Email or Password is wrong',
      },
    };
  }

  // If email is not verified, resend verification link
  if (!user.isVerifiedEmail) {
    const verifyURL = `${process.env.FRONTEND_URL}/verify-vendor-email/${user.id}`;
    const message = `Hi ${user.email}, Please click this link to verify your email: ${verifyURL}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email!',
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
      console.error('Error sending verification email:', error);
      return {
        rdata: null,
        rerror: {
          status: 500,
          message: 'Failed to send verification email',
        },
      };
    }
  }

  // Check if the password is correct
  const checkPassword = await bcrypt.compare(password, user.password);

  if (!checkPassword) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: 'Email or Password is wrong',
      },
    };
  }

  // Generate JWT tokens
  const userOptions = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
  };

  const accessToken = jwt.sign({ userOptions }, process.env.ACCESS_TOKEN, {
    expiresIn: '7d',
  });

  const refreshToken = jwt.sign({ userOptions }, process.env.REFRESH_TOKEN, {
    expiresIn: '7d',
  });

  // Save refresh token in the database
  if (role === 'vendor') {
    await prisma.vendor.update({
      where: { id: user.id },
      data: { refreshToken },
    });
  } else {
    await prisma.vendorStaff.update({
      where: { id: user.id },
      data: { refreshToken },
    });
  }

  return {
    rdata: {
      userOptions,
      accessToken,
      refreshToken,
      role,
      vendorId,
      permittedRoutes,
      status: 200,
    },
    rerror: null,
  };
};

export const vendorLogout = async ({ vendor }) => {
  let user;
  if (vendor.userOptions.role === 'vendor') {
    user = await prisma.vendor.update({
      where: {
        id: vendor.userOptions.id,
      },
      data: {
        refreshToken: null,
      },
    });
  } else if (vendor.userOptions.role === 'vendorStaff') {
    user = await prisma.vendorStaff.update({
      where: {
        id: vendor.userOptions.id,
      },
      data: {
        refreshToken: null,
      },
    });
  }
  return {
    rdata: {
      message: 'Logout successful',
      status: 200,
    },
    rerror: null,
  };
};

export const newRefreshToken = async ({ refreshToken }) => {
  let foundVendor;

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
      let role = 'vendor';
      let permittedRoutes = [];
      let vendorId = '';
      foundVendor = await prisma.vendor.findUnique({
        where: {
          id: decoded.userOptions.id,
        },
      });

      if (!foundVendor) {
        foundVendor = await prisma.vendorStaff.findUnique({
          where: {
            id: decoded.userOptions.id,
          },
        });
        vendorId = foundVendor.vendorId;
        if (foundVendor) {
          permittedRoutes = await prisma.permitedRoutes.findMany({
            where: {
              vendorStaffId: foundVendor.id,
            },
          });
        }
        role = 'vendorStaff';
      }

      if (!foundVendor) {
        return {
          rerror: {
            status: 403,
            message: 'Unauthorized',
          },
        };
      }

      if (foundVendor.refreshToken !== refreshToken) {
        return {
          rerror: {
            status: 403,
            message: 'Unauthorized',
          },
        };
      }

      const userOptions = {
        id: foundVendor.id,
        name: foundVendor.name,
        email: foundVendor.email,
        phone: foundVendor.phone,
      };

      const newAccessToken = jwt.sign(
        { userOptions },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: '1d',
        }
      );

      return {
        rdata: {
          data: {
            data: { ...userOptions, role, permittedRoutes, vendorId },
            accessToken: newAccessToken,
          },
          status: 200,
        },
      };
    }
  );

  return {
    rdata,
    rerror,
  };
};

export const forgotPassword = async ({ email }) => {
  try {
    const vendor = await prisma.vendor.findFirst({
      where: { email },
    });

    if (!vendor) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'No vendor with this email address' },
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: { resetToken: hash, passwordResetExpires },
    });

    const resetURL = `${process.env.FRONTEND_URL}/vendor-new-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: vendor.email,
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

    const vendor = await prisma.vendor.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: { gt: new Date(Date.now()) },
      },
    });

    if (!vendor) {
      return {
        rdata: null,
        rerror: { status: 400, message: 'Token is invalid or has expired' },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.vendor.update({
      where: { id: vendor.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null,
      },
    });

    const accessToken = jwt.sign({ id: vendor.id }, process.env.ACCESS_TOKEN, {
      expiresIn: '10d',
    });

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
