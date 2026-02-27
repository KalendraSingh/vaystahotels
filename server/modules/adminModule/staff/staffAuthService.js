import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import prisma from '../../../config/db.js';
import dotenv from 'dotenv';
import crypto from 'crypto';
import sendEmail from '../../../middleware/verifyEmail.js';

dotenv.config();

export const newStaff = async ({ name, email, password, roleId, phone }) => {
  try {
    const checkStaff = await prisma.staff.findFirst({
      where: {
        OR: [{ email: email }, { phone: phone }],
      },
    });

    if (checkStaff) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: 'Staff already exists',
        },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = await prisma.staff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        phone,
      },
    });

    return {
      rdata: { staff, status: 201 },
      rerror: null,
    };
  } catch (error) {
    console.error('Error in newStaff:', error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: 'Internal server error',
      },
    };
  }
};

export const loginStaff = async ({ email, password }) => {
  const checkStaff = await prisma.staff.findFirst({
    where: {
      email: email,
    },
    include: {
      role: true,
      PermitedRoutes: true,
    },
  });
  if (!checkStaff) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: 'Staff not found',
      },
    };
  }

  const checkPassword = await bcrypt.compare(password, checkStaff.password);

  if (!checkPassword) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: 'Unauthorized',
      },
    };
  }

  const staff = {
    id: checkStaff.id,
    name: checkStaff.name,
    email: checkStaff.email,
    phone: checkStaff.phone,
    role: checkStaff.role,
    permittedRoutes: checkStaff.PermitedRoutes,
  };

  console.log('Staff:', staff);

  const accessToken = jwt.sign(
    {
      staff,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '7d',
    }
  );

  const refreshToken = jwt.sign(
    {
      staff,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '7d',
    }
  );

  await prisma.staff.update({
    where: {
      id: checkStaff.id,
    },
    data: {
      refreshToken: refreshToken,
    },
  });
  return {
    rdata: {
      staff,
      accessToken,
      refreshToken,
      status: 200,
    },
  };
};

export const staffLogout = async ({ staff }) => {
  await prisma.staff.update({
    where: {
      id: staff.staff.id,
    },
    data: {
      refreshToken: null,
    },
  });
  return {
    rdata: {
      message: 'Logout successful',
      status: 200,
    },
  };
};

export const newRefreshToken = async ({ refreshToken }) => {
  let foundStaff;

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
      foundStaff = await prisma.staff.findUnique({
        where: {
          id: decoded.staff.id,
        },
        include: {
          role: true,
          PermitedRoutes: true,
        },
      });

      if (!foundStaff) {
        return {
          rerror: {
            status: 403,
            message: 'Unauthorized',
          },
        };
      }

      if (foundStaff.refreshToken !== refreshToken) {
        return {
          rerror: {
            status: 403,
            message: 'Unauthorized',
          },
        };
      }

      const staff = {
        id: foundStaff.id,
        name: foundStaff.name,
        email: foundStaff.email,
        phone: foundStaff.phone,
        role: foundStaff.role,
        permittedRoutes: foundStaff.PermitedRoutes,
      };

      console.log('Staff:', staff);

      const newAccessToken = jwt.sign(
        {
          staff,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: '1d',
        }
      );

      return {
        rdata: {
          staff: staff,
          accessToken: newAccessToken,
          status: 200,
        },
      };
    }
  );

  return {
    rdata: rdata,
    rerror: rerror,
  };
};

export const forgotPassword = async ({ email }) => {
  try {
    const staff = await prisma.staff.findFirst({
      where: { email },
    });

    if (!staff) {
      return {
        rdata: null,
        rerror: { status: 404, message: 'No staff with this email address' },
      };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.staff.update({
      where: { id: staff.id },
      data: { resetToken: hash, passwordResetExpires },
    });

    const resetURL = `${process.env.BASE_URL}/customer-forgot-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      await sendEmail({
        email: staff.email,
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

    const staff = await prisma.staff.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: { gt: new Date(Date.now()) },
      },
    });

    if (!staff) {
      return {
        rdata: null,
        rerror: { status: 400, message: 'Token is invalid or has expired' },
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.staff.update({
      where: { id: staff.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null,
      },
    });

    const accessToken = jwt.sign({ id: staff.id }, process.env.ACCESS_TOKEN, {
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
