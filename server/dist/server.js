// server.js
import express5 from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import bodyParser from "body-parser";

// routes/index.js
import { Router as Router35 } from "express";

// routes/admin/index.js
import { Router as Router15 } from "express";

// modules/adminModule/staff/staffAuthController.js
import jwt2 from "jsonwebtoken";

// utils/checkRequiredFields.js
var checkRequiredFields = (body, requiredFields) => {
  const missingFields = requiredFields.filter((field) => !(field in body));
  if (missingFields.length > 0) {
    return {
      data: null,
      error: {
        message: "Missing required fields",
        fields: missingFields
      }
    };
  }
  return { data: body, error: null };
};

// modules/adminModule/staff/staffAuthService.js
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// config/db.js
import { PrismaClient } from "@prisma/client";
var prisma = new PrismaClient();
var db_default = prisma;

// modules/adminModule/staff/staffAuthService.js
import dotenv from "dotenv";
import crypto from "crypto";

// middleware/verifyEmail.js
import nodemailer from "nodemailer";
var sendMail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  const mailOptions = {
    from: "Vaysta Hotels <fgroupservicess@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message
  };
  await transporter.sendMail(mailOptions);
};
var verifyEmail_default = sendMail;

// modules/adminModule/staff/staffAuthService.js
dotenv.config();
var newStaff = async ({ name, email, password, roleId, phone }) => {
  try {
    const checkStaff = await db_default.staff.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });
    if (checkStaff) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Staff already exists"
        }
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const staff = await db_default.staff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        phone
      }
    });
    return {
      rdata: { staff, status: 201 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in newStaff:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var loginStaff = async ({ email, password }) => {
  const checkStaff = await db_default.staff.findFirst({
    where: {
      email
    },
    include: {
      role: true,
      PermitedRoutes: true
    }
  });
  if (!checkStaff) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: "Staff not found"
      }
    };
  }
  const checkPassword = await bcrypt.compare(password, checkStaff.password);
  if (!checkPassword) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: "Unauthorized"
      }
    };
  }
  const staff = {
    id: checkStaff.id,
    name: checkStaff.name,
    email: checkStaff.email,
    phone: checkStaff.phone,
    role: checkStaff.role,
    permittedRoutes: checkStaff.PermitedRoutes
  };
  console.log("Staff:", staff);
  const accessToken = jwt.sign(
    {
      staff
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: "7d"
    }
  );
  const refreshToken = jwt.sign(
    {
      staff
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d"
    }
  );
  await db_default.staff.update({
    where: {
      id: checkStaff.id
    },
    data: {
      refreshToken
    }
  });
  return {
    rdata: {
      staff,
      accessToken,
      refreshToken,
      status: 200
    }
  };
};
var staffLogout = async ({ staff }) => {
  await db_default.staff.update({
    where: {
      id: staff.staff.id
    },
    data: {
      refreshToken: null
    }
  });
  return {
    rdata: {
      message: "Logout successful",
      status: 200
    }
  };
};
var newRefreshToken = async ({ refreshToken }) => {
  let foundStaff;
  const { rdata, rerror } = await jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      foundStaff = await db_default.staff.findUnique({
        where: {
          id: decoded.staff.id
        },
        include: {
          role: true,
          PermitedRoutes: true
        }
      });
      if (!foundStaff) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      if (foundStaff.refreshToken !== refreshToken) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      const staff = {
        id: foundStaff.id,
        name: foundStaff.name,
        email: foundStaff.email,
        phone: foundStaff.phone,
        role: foundStaff.role,
        permittedRoutes: foundStaff.PermitedRoutes
      };
      console.log("Staff:", staff);
      const newAccessToken = jwt.sign(
        {
          staff
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1d"
        }
      );
      return {
        rdata: {
          staff,
          accessToken: newAccessToken,
          status: 200
        }
      };
    }
  );
  return {
    rdata,
    rerror
  };
};
var forgotPassword = async ({ email }) => {
  try {
    const staff = await db_default.staff.findFirst({
      where: { email }
    });
    if (!staff) {
      return {
        rdata: null,
        rerror: { status: 404, message: "No staff with this email address" }
      };
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hash = crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1e3);
    await db_default.staff.update({
      where: { id: staff.id },
      data: { resetToken: hash, passwordResetExpires }
    });
    const resetURL = `${process.env.BASE_URL}/customer-forgot-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}.
If you didn't forget your password, please ignore this email!`;
    try {
      await verifyEmail_default({
        email: staff.email,
        subject: "Your password reset token (valid for 10 min)",
        message
      });
      return {
        rdata: { message: "Token sent to email!", status: 200 },
        rerror: null
      };
    } catch (emailError) {
      return {
        rdata: null,
        rerror: { status: 500, message: "Failed to send email" }
      };
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var resetPassword = async ({ token, password }) => {
  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const staff = await db_default.staff.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: { gt: new Date(Date.now()) }
      }
    });
    if (!staff) {
      return {
        rdata: null,
        rerror: { status: 400, message: "Token is invalid or has expired" }
      };
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db_default.staff.update({
      where: { id: staff.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null
      }
    });
    const accessToken = jwt.sign({ id: staff.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "10d"
    });
    return {
      rdata: { status: 200, accessToken },
      rerror: null
    };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/adminModule/staff/staffAuthController.js
var newStaffController = async (req, res) => {
  console.log(req.body);
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "name",
      "email",
      "password",
      "roleId",
      "phone"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await newStaff({ ...data, res });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in newStaffController:", error);
    res.status(500).send("Something went wrong");
  }
};
var staffLoginController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "email",
      "password"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await loginStaff({
      ...data,
      res
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    const { accessToken, refreshToken, staff } = rdata;
    console.log("Staff:", staff);
    res.cookie("userjwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    res.status(rdata.status).json({ data: staff, accessToken });
  } catch (error) {
    console.error("Error in staffLoginController:", error);
    res.status(500).send("Something went wrong");
  }
};
var staffLogoutController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.userjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.userjwt;
    const staff = jwt2.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!staff) {
      return res.sendStatus(204);
    }
    const { rdata } = await staffLogout({ staff });
    res.clearCookie("userjwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true
    });
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var staffAuthRefreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.userjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.userjwt;
    const { rdata, rerror } = await newRefreshToken({
      refreshToken,
      res
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json({ ...rdata });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var forgotPasswordController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ["email"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await forgotPassword({ email: data.email });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var resetPasswordController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ["password"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await resetPassword({
      token: req.params.token,
      ...data
    });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in resetPasswordController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/admin/staff/authRoutes.js
import { Router } from "express";
var router = Router();
var authRoutes_default = router.post("/register", newStaffController).post("/login", staffLoginController).get("/logout", staffLogoutController).get("/refresh", staffAuthRefreshTokenController).post("/forgotPassword", forgotPasswordController).patch("/resetPasssword/:token", resetPasswordController);

// utils/getData.js
var getPagenationData = async ({ page, pageSize, totalData }) => {
  let totalPages;
  let prev;
  let next;
  let currentPage;
  if (page && pageSize) {
    page = Number.parseInt(page);
    pageSize = Number.parseInt(pageSize);
    totalPages = Math.ceil(totalData / pageSize);
    prev = page > 1 ? page - 1 : null;
    next = page < totalPages ? page + 1 : null;
    currentPage = Number.parseInt(page);
  } else {
    totalPages = 1;
    currentPage = 1;
    prev = null;
    next = null;
    pageSize = totalData;
  }
  return {
    totalPages,
    currentPage,
    pagesize: pageSize,
    prev,
    next
  };
};

// modules/adminModule/staff/staffService.js
var getAllStaff = async ({
  name,
  state,
  phone,
  page,
  pageSize,
  orderby,
  order,
  email
}) => {
  const where = {};
  const orderBy = {};
  let skip = 0;
  let take = 10;
  if (page) skip = (Number(page) - 1) * Number(pageSize);
  if (pageSize) take = Number(pageSize);
  if (name) where.name = { contains: name, mode: "insensitive" };
  if (email) where.email = { contains: email, mode: "insensitive" };
  if (phone) where.phone = { contains: phone, mode: "insensitive" };
  if (state) where.state = { contains: state, mode: "insensitive" };
  if (orderby && order) orderBy[orderby] = order;
  const data = await db_default.staff.findMany({
    where,
    take,
    skip,
    orderBy,
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      state: true,
      role: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    }
  });
  const totalData = await db_default.staff.count({ where });
  const paginationData = await getPagenationData({
    page,
    pageSize,
    totalData
  });
  return {
    data,
    totalData,
    ...paginationData
  };
};
var getStaffById = async (id) => {
  const data = await db_default.staff.findUnique({
    where: {
      id
    },
    omit: {
      password: true,
      refreshToken: true
    }
  });
  return data;
};
var updateStaff = async (id, data) => {
  try {
    const staff = await db_default.staff.update({
      where: {
        id
      },
      data,
      select: {
        id: true,
        name: true,
        gender: true,
        dob: true,
        phone: true,
        street: true,
        pincode: true,
        city: true,
        state: true,
        country: true,
        profileImage: true,
        // Exclude password and refreshToken from response
        password: false,
        refreshToken: false
      }
    });
    return staff;
  } catch (error) {
    console.error("Error updating staff:", error);
    throw new Error("Failed to update staff");
  }
};
var toggleActive = async (id) => {
  const getStaff = await db_default.staff.findUnique({
    where: {
      id
    }
  });
  const data = await db_default.staff.update({
    omit: {
      password: true,
      refreshToken: true
    },
    where: {
      id
    },
    data: {
      isActive: !getStaff.isActive
    }
  });
  return data;
};
var assignPermission = async (staffId, permissions) => {
  if (!staffId || !permissions) {
    return { rerror: { status: 400, message: "Please provide all fields" } };
  }
  try {
    const providedRoutes = [];
    permissions.map(async (route) => {
      const newRoute = await db_default.permitedRoutes.findFirst({
        where: {
          routeName: route.name,
          staffId
        }
      });
      if (!newRoute) {
        const createdRoute = await db_default.permitedRoutes.create({
          data: {
            routeName: route.name,
            route: route.route,
            staffId
          }
        });
        providedRoutes.push(createdRoute);
      }
    });
    return { rdata: providedRoutes };
  } catch (error) {
    return { rerror: { status: 500, message: "Something went wrong" } };
  }
};

// modules/adminModule/staff/staffController.js
var getAllStaffController = async (req, res) => {
  const { name, email, phone, page, pageSize, orderby, order } = req.query;
  const data = await getAllStaff({
    name,
    email,
    phone,
    page,
    pageSize,
    orderby,
    order
  });
  res.send(data);
};
var getStaffByIdController = async (req, res) => {
  const { id } = req.params;
  console.log("id", id);
  const data = await getStaffById(id);
  res.send(data);
};
var updateStaffController = async (req, res) => {
  try {
    const { id } = req.params;
    const imageUrls = req.body.fileUrls;
    const { name, gender, dob, phone, street, pincode, city, state, country } = req.body;
    const hotelUrls = imageUrls && imageUrls.filter((file) => file.fieldname === "profileImg").map((file) => file.location);
    const profileData = {
      name,
      gender,
      dob,
      phone,
      street,
      pincode,
      city,
      state,
      country,
      profileImage: hotelUrls[0]
    };
    const updatedData = await updateStaff(id, profileData);
    res.status(200).json(updatedData);
  } catch (error) {
    console.error("Error in updateStaffController:", error);
    res.status(500).json({ message: "Failed to update staff" });
  }
};
var toggleActiveController = async (req, res) => {
  const { id } = req.params;
  const data = await toggleActive(id);
  res.send(data);
};
var assignPermissionController = async (req, res) => {
  try {
    const { staffId, permissions } = req.body;
    const data = await assignPermission(staffId, permissions);
    res.send(data);
  } catch (error) {
    console.error("Error in assignPermissionController:", error);
    res.status(500).json({ message: "Failed to assign permission" });
  }
};

// routes/admin/staff/staffRoutes.js
import { Router as Router2 } from "express";

// middleware/verifyRole.js
import jwt3 from "jsonwebtoken";
import dotenv2 from "dotenv";
dotenv2.config();

// middleware/multerS3Upload.js
import multer from "multer";
import { Upload } from "@aws-sdk/lib-storage";
import { PassThrough } from "stream";

// config/awsConfig.js
import { S3Client } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@aws-sdk/node-http-handler";
var s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 1e5,
    socketTimeout: 1e5
  })
});

// utils/urlUtils.js
var convertS3ToCloudFrontUrl = (s3Url) => {
  if (!s3Url) return null;
  return s3Url.replace(
    process.env.AWS_S3_BUCKET_URL,
    // Example: 'https://your-bucket.s3.amazonaws.com'
    process.env.AWS_CLOUDFRONT_URL
    // Example: 'https://your-cloudfront-id.cloudfront.net'
  );
};

// middleware/multerS3Upload.js
import { v4 as uuid } from "uuid";
var storage = multer.memoryStorage();
var upload = multer({ storage });
var uploadFiles = async (req, res, next) => {
  try {
    upload.fields([
      { name: "cityImage", maxCount: 1 },
      { name: "iconImage", maxCount: 1 },
      { name: "profileImg", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
      { name: "hotelImage" },
      { name: "roomImage" },
      { name: "roomCatImage" },
      { name: "categoryImage" },
      { name: "propertyImage", maxCount: 5 },
      { name: "ownershipDocument", maxCount: 5 },
      { name: "pancardDocument" },
      { name: "aadharDocuments" },
      { name: "gstDocument" },
      { name: "signature" }
    ])(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: "An unknown error occurred." });
      }
      if (!req.files) {
        return res.status(400).json({ error: "No files uploaded." });
      }
      const uploadedFiles = [];
      for (const field in req.files) {
        for (const file of req.files[field]) {
          const pass = new PassThrough();
          const sanitizedFileName = `${uuid()}_${file.originalname.replace(/\s+/g, "")}`;
          const upload3 = new Upload({
            client: s3,
            params: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `images/${sanitizedFileName}`,
              Body: pass,
              ContentType: file.mimetype,
              ContentDisposition: "inline"
            }
          });
          pass.end(file.buffer);
          await upload3.done();
          const s3Url = `${process.env.AWS_S3_BUCKET_URL}/images/${sanitizedFileName}`;
          const cloudFrontUrl = convertS3ToCloudFrontUrl(s3Url);
          uploadedFiles.push({
            fieldname: file.fieldname,
            originalname: sanitizedFileName,
            location: cloudFrontUrl
          });
        }
      }
      req.body.fileUrls = uploadedFiles;
      next();
    });
  } catch (error) {
    console.error("Error uploading files to S3:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

// routes/admin/staff/staffRoutes.js
var router2 = Router2();
var staffRoutes_default = router2.get(
  "/getallStaff",
  // verifyRole({ route: 'GET_STAFF' }),
  getAllStaffController
).get("/getstaffById/:id", getStaffByIdController).patch("/toggleactive/:id", toggleActiveController).patch("/updatestaff/:id", uploadFiles, updateStaffController).post("/assignPermission", assignPermissionController);

// modules/adminModule/staff/staffRoleService.js
var newRole = async ({ name, rank }) => {
  try {
    const checkRole = await db_default.role.findFirst({
      where: {
        name: {
          equals: name.toLowerCase(),
          mode: "insensitive"
        }
      }
    });
    if (checkRole) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Role already exists"
        }
      };
    }
    const role = await db_default.role.create({
      data: {
        name,
        rank
      }
    });
    return {
      rdata: { role, status: 201 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in newRole:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getAllRoles = async () => {
  try {
    const roles = await db_default.role.findMany();
    return {
      rdata: { roles, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getAllRoles:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteRole = async (id) => {
  try {
    const role = await db_default.role.delete({
      where: {
        id
      }
    });
    return {
      rdata: { role, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in deleteRole:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var updateRole = async (id, { name, rank }) => {
  try {
    const role = await db_default.role.update({
      where: {
        id
      },
      data: {
        name,
        rank
      }
    });
    return {
      rdata: { role, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in updateRole:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getRoleById = async (id) => {
  try {
    const role = await db_default.role.findUnique({
      where: {
        id
      }
    });
    if (!role) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Role not found"
        }
      };
    }
    return {
      rdata: { role, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getRoleById:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/adminModule/staff/staffRoleController.js
var newRoleContoller = async (req, res) => {
  try {
    if (req.body.name === "") {
      return res.status(400).json({ message: "Role name is required" });
    } else if (req.body.rank === null) {
      return res.status(400).json({ message: "Role rank is required" });
    }
    const { data, error } = checkRequiredFields(req.body, ["name", "rank"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await newRole({ ...data, res });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in newRole:", error);
    res.status(500).send("Something went wrong");
  }
};
var getAllRolesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllRoles();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in getAllRolesController:", error);
    res.status(500).send("Something went wrong");
  }
};
var deleteRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteRole(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in deleteRoleController:", error);
    res.status(500).send("Something went wrong");
  }
};
var updateRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = checkRequiredFields(req.body, ["name", "rank"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await updateRole(id, data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in updateRoleController:", error);
    res.status(500).send("Something went wrong");
  }
};
var getRoleByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getRoleById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in getRoleByIdController:", error);
    res.status(500).send("Something went wrong");
  }
};

// routes/admin/staff/roleRoutes.js
import { Router as Router3 } from "express";
var router3 = Router3();
router3.get("/getAllRoles", getAllRolesController).delete("/deleteRole/:id", deleteRoleController).patch("/updateRole/:id", updateRoleController).get("/getRole/:id", getRoleByIdController).post("/newRole", newRoleContoller);
var roleRoutes_default = router3;

// modules/adminModule/permitedRoutes/permitedRouteService.js
var createPermitedRoutes = async ({ staffId, routeNames }) => {
  try {
    const createdPermitedRoutes = [];
    const userStaff = await db_default.staff.findUnique({
      where: { id: staffId }
    });
    if (!userStaff) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Staff record not found"
        }
      };
    }
    const uniquePermitedRoutes = [...new Set(routeNames)];
    let duplicateFound = false;
    for (let i = 0; i < uniquePermitedRoutes.length; i++) {
      const permittedRoute = uniquePermitedRoutes[i];
      const isDuplicatePermission = await db_default.permitedRoutes.findFirst({
        where: {
          routeName: permittedRoute,
          staffId
        }
      });
      if (isDuplicatePermission) {
        duplicateFound = true;
        continue;
      }
      const createdRoute = await db_default.permitedRoutes.create({
        data: {
          routeName: permittedRoute,
          staff: {
            connect: {
              id: staffId
            }
          }
        }
      });
      createdPermitedRoutes.push(createdRoute);
    }
    if (duplicateFound) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Some duplicate permissions were found and skipped"
        }
      };
    }
    return {
      rdata: {
        message: "Permitted routes created successfully",
        createdPermitedRoutes
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in createPermitedRoutes:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deletePermitedRoutes = async ({ staffId, permitedRouteId }) => {
  try {
    const userStaff = await db_default.permitedRoutes.findFirst({
      where: { id: permitedRouteId, staffId }
    });
    if (!userStaff) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Permitted route not found for the given staff ID"
        }
      };
    }
    await db_default.permitedRoutes.delete({
      where: {
        id: permitedRouteId
      }
    });
    return {
      rdata: {
        message: "Permitted route deleted successfully"
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in deletePermitedRoutes:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getPermittedRouteByStaffId = async ({ staffId }) => {
  try {
    const findPermittedRoutes = await db_default.permitedRoutes.findMany({
      where: {
        staffId
      }
    });
    if (!findPermittedRoutes.length) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No permitted routes found for the given staff ID"
        }
      };
    }
    return {
      rdata: findPermittedRoutes,
      rerror: null
    };
  } catch (error) {
    console.error("Error in getPermittedRouteByStaffId:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/adminModule/permitedRoutes/permitedRouteController.js
var createPermitedRoutesController = async (req, res) => {
  try {
    const { staffId, routeNames } = req.body;
    const { rdata, rerror } = await createPermitedRoutes({
      staffId,
      routeNames
    });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in createPermitedRoutesController:", error);
    res.status(500).send("Something went wrong");
  }
};
var deletePermitedRoutesController = async (req, res) => {
  try {
    const { staffId, permitedRouteId } = req.params;
    const { rdata, rerror } = await deletePermitedRoutes({
      staffId,
      permitedRouteId
    });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deletePermitedRoutesController:", error);
    res.status(500).send("Something went wrong");
  }
};
var getPermittedRouteByStaffIdController = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { rdata, rerror } = await getPermittedRouteByStaffId({ staffId });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getPermittedRouteByStaffIdController:", error);
    res.status(500).send("Something went wrong");
  }
};

// routes/admin/permitedRoutes/permitedRoutes.js
import { Router as Router4 } from "express";
var router4 = Router4();
var permitedRoutes_default = router4.post("/newPermitedRoute", createPermitedRoutesController).delete(
  "/deletePermitedRoute/:staffId/:permitedRouteId",
  deletePermitedRoutesController
).get("/getAllPermitedRoutes/:staffId", getPermittedRouteByStaffIdController);

// modules/adminModule/hotel/hotelController.js
import express from "express";

// modules/hotel/hotelService.js
var addCityAddress = async ({
  city,
  state,
  country,
  zipcode,
  landmark,
  location,
  cityImage,
  cityAvgPrice
}) => {
  try {
    if (!city || !state || !cityImage) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "all fiels are required!"
        }
      };
    }
    const cities = await db_default.cityAddress.findMany({
      where: {
        city: {
          equals: city,
          mode: "insensitive"
        }
      }
    });
    if (cities.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "City already exist!"
        }
      };
    }
    const newCity = await db_default.cityAddress.create({
      data: {
        city,
        state,
        country: country || "",
        zipcode: zipcode || "",
        cityImage,
        cityAvgPrice: parseFloat(cityAvgPrice) || 0,
        landmark: landmark || "",
        location: location || ""
      }
    });
    return { rdata: newCity, rerror: null };
  } catch (error) {
    console.error("Error in creating cityAddress:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getCityById = async (id) => {
  try {
    const city = await db_default.cityAddress.findUnique({
      where: { id }
    });
    if (!city) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "City not found!"
        }
      };
    }
    return { rdata: city, rerror: null };
  } catch (error) {
    console.error("Error in fetching city by ID:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getAllCities = async () => {
  try {
    const cities = await db_default.cityAddress.findMany();
    return { rdata: cities, rerror: null };
  } catch (error) {
    console.error("Error in fetching all cities:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var updateCityAddress = async (id, data) => {
  try {
    const city = await db_default.cityAddress.findUnique({
      where: { id }
    });
    if (!city) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "City not found!"
        }
      };
    }
    const updateFields = {};
    if (data.name) updateFields.name = data.name;
    if (data.city) updateFields.city = data.city;
    if (data.state) updateFields.state = data.state;
    if (data.country) updateFields.country = data.country;
    if (data.zipcode) updateFields.zipcode = data.zipcode;
    if (data.landmark) updateFields.landmark = data.landmark;
    if (data.location) updateFields.location = data.location;
    if (data.cityImage) updateFields.cityImage = data.cityImage;
    if (data.cityAvgPrice)
      updateFields.cityAvgPrice = parseFloat(data.cityAvgPrice);
    const updatedCity = await db_default.CityAddress.update({
      where: { id },
      data: updateFields
    });
    return { rdata: updatedCity, rerror: null };
  } catch (error) {
    console.error("Error in updating cityAddress:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteCityAddress = async (id) => {
  try {
    const city = await db_default.cityAddress.findUnique({
      where: { id }
    });
    if (!city) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "City not found!"
        }
      };
    }
    await db_default.cityAddress.delete({
      where: { id }
    });
    return { rdata: { message: "City deleted successfully!" }, rerror: null };
  } catch (error) {
    console.error("Error in deleting cityAddress:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var createHotel = async (hotelData) => {
  const {
    type,
    phone,
    website,
    email,
    name,
    city,
    state,
    country,
    zipcode,
    landmark,
    avgPrice,
    location,
    vendorId,
    cityAddressId,
    description,
    bannerImage,
    amenities,
    longitude,
    latitude
  } = hotelData;
  try {
    const ifHotelExist = await db_default.hotel.findMany({
      where: { name: { equals: name, mode: "insensitive" } }
    });
    if (ifHotelExist.length > 0) {
      return {
        rdata: null,
        rerror: { status: 401, message: "Hotel already listed!" }
      };
    }
    const hotel = await db_default.hotel.create({
      data: {
        type,
        phone,
        website,
        email,
        name,
        city,
        state,
        country,
        zipcode,
        landmark,
        vendorId,
        cityAddressId,
        avgPrice: parseFloat(avgPrice),
        location,
        description,
        bannerImage,
        longitude,
        latitude,
        amenities: JSON.parse(amenities)
      }
    });
    return { rdata: hotel, rerror: null };
  } catch (error) {
    console.error("Error in createHotel:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getAllHotels = async (filters, sorting, checkIn2, checkOut2) => {
  const {
    search,
    state,
    latitude,
    longitude,
    guestCount,
    price,
    rating,
    amenities,
    page = 1,
    pageSize = 10
  } = filters;
  let skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const { sortBy = "avgPrice", sortOrder = "desc" } = sorting;
  const validCheckIn = checkIn2 ? new Date(checkIn2) : null;
  const validCheckOut = checkOut2 ? new Date(checkOut2) : null;
  if (validCheckIn && isNaN(validCheckIn.getTime())) {
    return {
      rdata: null,
      rerror: { status: 400, message: "Invalid check-in date" }
    };
  }
  if (validCheckOut && isNaN(validCheckOut.getTime())) {
    return {
      rdata: null,
      rerror: { status: 400, message: "Invalid check-out date" }
    };
  }
  try {
    const filterConditions = {
      isActive: true,
      ...search && {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { city: { contains: search, mode: "insensitive" } },
          { landmark: { contains: search, mode: "insensitive" } }
        ]
      },
      ...state && { state: { contains: state, mode: "insensitive" } },
      // ...(latitude &&
      //   longitude && {
      //     latitude: latitude,
      //     longitude: longitude,
      //   }),
      ...price && {
        avgPrice: { lte: price }
      }
    };
    let hotels = await db_default.hotel.findMany({
      where: filterConditions,
      include: {
        RoomCategories: {
          include: {
            rooms: {
              where: {
                isActive: true,
                isAvailable: true
              }
            }
          }
        },
        ReviewAndRating: {
          include: {
            customer: {
              select: {
                name: true,
                gender: true,
                profileImage: true
              }
            }
          }
        },
        hotelImages: true
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take
    });
    if (amenities && amenities.length > 0) {
      hotels = hotels.filter((hotel) => {
        if (!hotel.amenities || hotel.amenities.length === 0) return false;
        return amenities.some((selectedAmenity) => {
          return hotel.amenities.some((hotelAmenity) => {
            const amenityName = typeof hotelAmenity === "string" ? hotelAmenity : hotelAmenity.name || hotelAmenity;
            return amenityName.toLowerCase() === selectedAmenity.toLowerCase();
          });
        });
      });
    }
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;
      return {
        ...hotel,
        avgRating
      };
    });
    let filteredHotels = guestCount ? hotelsWithAvgRating.filter(
      (hotel) => hotel.RoomCategories.some(
        (category) => parseInt(category.adultCount, 10) >= guestCount
      )
    ) : hotelsWithAvgRating;
    if (rating) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.avgRating >= rating
      );
    }
    const totalCount = await db_default.hotel.count({
      where: filterConditions
    });
    return {
      rdata: {
        data: filteredHotels,
        pagination: {
          total: totalCount,
          currentPage: Number(page),
          pageSize: take,
          totalPages: Math.ceil(totalCount / take)
        }
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getLatestHotels = async () => {
  try {
    const hotels = await db_default.hotel.findMany({
      where: { isActive: true },
      include: {
        hotelImages: true,
        ReviewAndRating: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;
      return {
        ...hotel,
        avgRating
      };
    });
    return { rdata: hotelsWithAvgRating, rerror: null };
  } catch (error) {
    console.error("Error in getLatestHotels:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getTopRatedHotels = async () => {
  try {
    const hotels = await db_default.hotel.findMany({
      where: { isActive: true },
      include: {
        hotelImages: true,
        ReviewAndRating: true
      }
    });
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : 0;
      return { ...hotel, avgRating };
    });
    const filteredHotels = hotelsWithAvgRating.filter(
      (hotel) => hotel.avgRating >= 4
    );
    filteredHotels.sort((a, b) => b.avgRating - a.avgRating);
    const topRatedHotels = filteredHotels.slice(0, 10);
    return { rdata: topRatedHotels, rerror: null };
  } catch (error) {
    console.error("Error in getTopRatedHotels:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getTrendingHotels = async () => {
  try {
    const hotels = await db_default.hotel.findMany({
      where: { isActive: true },
      include: {
        hotelImages: true,
        ReviewAndRating: true,
        bookings: true
        // Assuming trending hotels are based on bookings
      }
    });
    const hotelsWithTrendingScore = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const totalBookings = hotel.bookings.length;
      const trendingScore = totalReviews + totalBookings;
      return { ...hotel, trendingScore };
    });
    hotelsWithTrendingScore.sort((a, b) => b.trendingScore - a.trendingScore);
    const trendingHotels = hotelsWithTrendingScore.slice(0, 10);
    return { rdata: trendingHotels, rerror: null };
  } catch (error) {
    console.error("Error in getTrendingHotels:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getHotelsByCity = async (city, page = 1, pageSize = 10) => {
  try {
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const cityWithHotels = await db_default.cityAddress.findFirst({
      where: {
        city: {
          equals: city,
          mode: "insensitive"
        },
        isActive: true
      },
      include: {
        hotels: {
          where: {
            isActive: true
          },
          include: {
            RoomCategories: {
              include: {
                rooms: {
                  where: {
                    isActive: true,
                    isAvailable: true
                  }
                }
              }
            },
            ReviewAndRating: {
              include: {
                customer: {
                  select: {
                    name: true,
                    gender: true,
                    profileImage: true
                  }
                }
              }
            },
            hotelImages: true
          },
          skip,
          take
        }
      }
    });
    if (!cityWithHotels || cityWithHotels.hotels.length === 0) {
      return {
        data: null,
        error: { status: 404, message: "No hotels found in this city" }
      };
    }
    const totalHotels = await db_default.hotel.count({
      where: {
        city: {
          equals: city,
          mode: "insensitive"
        },
        isActive: true
      }
    });
    const hotelsWithAvgRating = cityWithHotels.hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;
      return {
        ...hotel,
        avgRating
      };
    });
    return {
      rdata: {
        data: hotelsWithAvgRating,
        pagination: {
          total: totalHotels,
          currentPage: Number(page),
          pageSize: take,
          totalPages: Math.ceil(totalHotels / take)
        }
      },
      error: null
    };
  } catch (error) {
    console.error("Error in getHotelsByCity service:", error);
    return {
      data: null,
      error: { status: 500, message: "Internal server error" }
    };
  }
};
var getHotelById = async (id) => {
  try {
    const hotel = await db_default.hotel.findUnique({
      where: { id },
      include: {
        RoomCategories: {
          include: {
            rooms: {
              where: {
                isAvailable: true,
                isActive: true
              }
            }
          }
        },
        ReviewAndRating: {
          include: {
            customer: {
              select: {
                name: true,
                gender: true,
                profileImage: true
              }
            }
          }
        },
        hotelImages: true,
        hotelPolicy: {
          select: {
            foreignGuests: true,
            coupleFriendly: true,
            childrenPolicy: true,
            localId: true,
            payAtHotel: true,
            checkOutTime: true,
            checkInTime: true,
            cancellationPolicy: true,
            nonRefundable: true
          }
        }
      }
    });
    if (!hotel) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Hotel not found" }
      };
    }
    const totalReviews = hotel.ReviewAndRating.length;
    const sumRatings = hotel.ReviewAndRating.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;
    return { rdata: { ...hotel, avgRating }, rerror: null };
  } catch (error) {
    console.error("Error in getHotelById:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var updateHotel = async (id, hotelData) => {
  const {
    type,
    phone,
    website,
    email,
    name,
    city,
    state,
    country,
    zipcode,
    avgPrice,
    location,
    landmark,
    description,
    bannerImage,
    amenities,
    latitude,
    longitude
  } = hotelData;
  try {
    const hotel = await db_default.hotel.update({
      where: { id },
      data: {
        type,
        phone,
        website,
        email,
        name,
        city,
        state,
        country,
        zipcode,
        avgPrice: parseFloat(avgPrice),
        location,
        landmark,
        description,
        bannerImage,
        amenities: JSON.parse(amenities),
        latitude,
        longitude
      }
    });
    return { rdata: hotel, rerror: null };
  } catch (error) {
    console.error("Error in updateHotel:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var deleteHotel = async (id) => {
  try {
    const hotel = await db_default.hotel.delete({ where: { id } });
    return { rdata: hotel, rerror: null };
  } catch (error) {
    console.error("Error in deleteHotel:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var addHotelImages = async ({ hotelId, category, imageUrls }) => {
  try {
    const ifCategoryExist = await db_default.hotelImage.findMany({
      where: {
        hotelId,
        category: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
    if (ifCategoryExist.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "Category already listed!"
        }
      };
    }
    const hotelImage = await db_default.hotelImage.create({
      data: {
        hotelId,
        category,
        imageUrls
      }
    });
    return { rdata: hotelImage, rerror: null };
  } catch (error) {
    console.error("Error in addHotelmages:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var updateHotelImages = async ({ hotelId, category, imageUrls }) => {
  console.log("imageUrls", imageUrls);
  try {
    const existingCategory = await db_default.hotelImage.findFirst({
      where: {
        hotelId,
        category: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
    if (!existingCategory) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Category not found for this hotel!"
        }
      };
    }
    const updatedHotelImage = await db_default.hotelImage.update({
      where: { id: existingCategory.id },
      data: { imageUrls }
    });
    return { rdata: updatedHotelImage, rerror: null };
  } catch (error) {
    console.error("Error in updateHotelImages:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var deleteHotelImages = async (id) => {
  try {
    const updatedHotelImage = await db_default.hotelImage.delete({
      where: { id }
    });
    return { rdata: updatedHotelImage, rerror: null };
  } catch (error) {
    console.error("Error in updateHotelImages:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/adminModule/hotel/hotelServices.js
var getAllHotels2 = async (filters, sorting, page = 1, pageSize = 10) => {
  const { search, rating, paymentStatus, policyStatus, hotelStatus } = filters;
  const { sortBy = "avgPrice", sortOrder = "desc" } = sorting;
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  try {
    const hotels = await db_default.hotel.findMany({
      where: {
        ...search && {
          OR: [{ name: { contains: search, mode: "insensitive" } }]
        },
        ...hotelStatus && { isActive: hotelStatus === "true" },
        ...paymentStatus && { isPaid: paymentStatus === "true" },
        ...policyStatus && { hotelPolicy: { some: { policyStatus } } }
      },
      include: {
        RoomCategories: {
          include: {
            rooms: {
              where: {
                isActive: true,
                isAvailable: true
              }
            }
          }
        },
        ReviewAndRating: {
          include: {
            customer: {
              select: {
                name: true,
                gender: true,
                profileImage: true
              }
            }
          }
        },
        hotelImages: true,
        hotelPolicy: true
      },
      orderBy: {
        [sortBy]: sortOrder
      },
      skip,
      take
    });
    const totalCount = await db_default.hotel.count({
      where: {
        ...search && {
          OR: [{ name: { contains: search, mode: "insensitive" } }]
        },
        ...hotelStatus !== void 0 && { isActive: hotelStatus === "true" },
        ...paymentStatus && { isPaid: paymentStatus === "true" }
      }
    });
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;
      return {
        ...hotel,
        avgRating
      };
    });
    let filteredHotels = hotelsWithAvgRating;
    if (rating) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.avgRating >= rating
      );
    }
    return {
      rdata: filteredHotels,
      pagination: {
        total: totalCount,
        page,
        pageSize,
        totalPages: Math.ceil(totalCount / pageSize)
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var toggleHotelStatus = async (hotelId, isActive) => {
  try {
    const updatedHotel = await db_default.hotel.update({
      where: { id: hotelId },
      data: { isActive }
    });
    return { data: updatedHotel, error: null };
  } catch (error) {
    console.error("Error updating hotel status:", error);
    return {
      data: null,
      error: { message: "Failed to update hotel status", status: 500 }
    };
  }
};
var updateHotelPolicyStatus = async (id, status, rejectionReason) => {
  try {
    const policy = await db_default.vendorHotelPolicy.findUnique({
      where: { id },
      include: { Vendor: true }
      // Include related Vendor details for email
    });
    console.log("policy", policy);
    if (!policy) {
      return {
        pdata: null,
        perror: { status: 404, message: "Policy not found" }
      };
    }
    const updatedPolicy = await db_default.vendorHotelPolicy.update({
      where: { id },
      data: {
        policyStatus: status,
        policyRejectionReason: status === "REJECTED" ? rejectionReason : null
      },
      include: { Vendor: true }
      // Include Vendor for email purposes
    });
    return { pdata: updatedPolicy, perror: null };
  } catch (error) {
    console.error("Error in updating policy status:", error);
    return {
      pdata: null,
      perror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/adminModule/hotel/hotelController.js
var router5 = express.Router();
var addNewHotelController = async (req, res) => {
  try {
    const hotelData = {
      ...req.body,
      hotelImage: req.body.fileUrls.map((file) => file.location)
    };
    const { data, error } = checkRequiredFields(hotelData, [
      "name",
      "city",
      "state",
      "country",
      "zipcode",
      "landmark",
      "hotelImage"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createHotel(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllHotelController = async (req, res) => {
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
      pageSize = 10
    } = req.query;
    const filters = {
      name,
      city,
      state,
      search,
      isActive: isActive === "true" ? true : isActive === "false" ? false : void 0,
      isPaid: isPaid === "true" ? true : isPaid === "false" ? false : void 0,
      rating: rating ? parseInt(rating) : void 0,
      paymentStatus,
      policyStatus,
      hotelStatus
    };
    const sorting = {
      sortBy: sortBy || (priceOrder === "High to Low" ? "avgPrice" : "name"),
      sortOrder: sortOrder || (priceOrder === "High to Low" ? "desc" : "asc")
    };
    const { rdata, pagination, rerror } = await getAllHotels2(
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
    console.error("Error in getting hotels:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getHotelByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateHotelController = async (req, res) => {
  const { id } = req.params;
  try {
    const hotelData = {
      ...req.body,
      hotelImage: req.body.fileUrls ? req.body.fileUrls.map((file) => file.location) : void 0
    };
    const { rdata, rerror } = await updateHotel(id, hotelData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updating hotel:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteHotelController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteHotel(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting hotel:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var toggleHotelStatusController = async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;
  console.log(isActive);
  if (typeof isActive !== "boolean") {
    return res.status(400).json({ message: "Invalid isActive status" });
  }
  const { data, error } = await toggleHotelStatus(id, isActive);
  if (error) {
    return res.status(error.status).json({ message: error.message });
  }
  return res.status(200).json({
    message: `Hotel has been ${isActive ? "activated" : "deactivated"}`,
    data
  });
};
var getEmailTemplate = (status, rejectionReason) => {
  const rejectionContent = status === "REJECTED" ? `<p style="color: red;"><strong>Reason:</strong> ${rejectionReason}</p>` : "";
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
var updateHotelPolicyStatusController = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  if (!["APPROVED", "REJECTED", "IN_PROGRESS"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status value. Must be APPROVED, REJECTED, or IN_PROGRESS."
    });
  }
  if (status === "REJECTED" && (!rejectionReason || rejectionReason.trim() === "")) {
    return res.status(400).json({
      message: "Rejection reason is required when status is REJECTED."
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
    console.log("pdata", pdata);
    const emailOptions = {
      email: pdata.Vendor.email,
      subject: `Hotel Policy`,
      message: getEmailTemplate(status, rejectionReason)
    };
    await verifyEmail_default(emailOptions);
    return res.status(200).json({ message: `Policy updated and email sent to vendor.` });
  } catch (error) {
    console.error("Error in updating hotel policy status:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/admin/hotel/hotelRoutes.js
import { Router as Router5 } from "express";
var router6 = Router5();
var hotelRoutes_default = router6.post("/addNewHotel", uploadFiles, addNewHotelController).patch("/updateHotel/:id", uploadFiles, updateHotelController).get("/getAllHotels", getAllHotelController).get("/getHotelById/:id", getHotelByIdController).delete("/deleteHotel/:id", deleteHotelController).post("/toggleHotelStatus/:id", toggleHotelStatusController).put("/updateHotelPolicy/:id", updateHotelPolicyStatusController);

// modules/adminModule/hotel/hotelAmenitiesController.js
var addNewHotelAmenitiesController = async (req, res) => {
  try {
    const amenitiesData = {
      ...req.body
    };
    const { data, error } = checkRequiredFields(amenitiesData, ["hotelId"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createHotelAmenities(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllHotelAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelAmenities();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getHotelAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelAmenitiesById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel amenities by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateHotelAmenitiesController = async (req, res) => {
  const { id } = req.params;
  try {
    const amenitiesData = {
      ...req.body
    };
    const { rdata, rerror } = await updateHotelAmenities(id, amenitiesData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updating hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteHotelAmenitiesController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteHotelAmenities(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/admin/hotel/hotelAmenitiesRoutes.js
import { Router as Router6 } from "express";
var router7 = Router6();
var hotelAmenitiesRoutes_default = router7.post("/addNewHotelAmenities", addNewHotelAmenitiesController).patch("/updateHotelAmenities/:id", updateHotelAmenitiesController).get("/getAllHotelsAmenities", getAllHotelAmenitiesController).get("/getHotelAmenitiesById/:id", getHotelAmenitiesByIdController).delete("/deleteHotelAmenities/:id", deleteHotelAmenitiesController);

// modules/hotel/hotelRoomService.js
var addRoomCategory = async ({
  category,
  hotelId,
  bedType,
  adultCount,
  roomSize,
  description,
  price,
  discount,
  discountedPrice,
  categoryImage,
  perGuestPrice,
  amenities
}) => {
  try {
    const ifCategoryExist = await db_default.roomCategory.findMany({
      where: {
        hotelId,
        category: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
    if (ifCategoryExist.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "Category already exists!"
        }
      };
    }
    const roomCategory = await db_default.roomCategory.create({
      data: {
        hotelId,
        category,
        bedType,
        adultCount,
        roomSize,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        discountedPrice: parseFloat(discountedPrice),
        categoryImage,
        perGuestPrice: parseInt(perGuestPrice),
        amenities: JSON.parse(amenities)
      }
    });
    return { rdata: roomCategory, rerror: null };
  } catch (error) {
    console.error("Error in addRoomCategory:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var updateRoomCategory = async ({
  categoryId,
  category,
  bedType,
  adultCount,
  roomSize,
  description,
  price,
  discount,
  discountedPrice,
  categoryImage,
  perGuestPrice,
  amenities
}) => {
  try {
    const roomCategory = await db_default.roomCategory.update({
      where: {
        id: categoryId
      },
      data: {
        category,
        bedType,
        adultCount,
        roomSize,
        description,
        price: parseFloat(price),
        discount: parseFloat(discount) || 0,
        discountedPrice: parseFloat(discountedPrice),
        categoryImage,
        perGuestPrice: parseFloat(perGuestPrice),
        amenities: JSON.parse(amenities)
        // Parse amenities JSON string
      }
    });
    return { rdata: roomCategory, rerror: null };
  } catch (error) {
    console.error("Error in updateRoomCategory:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getAllRoomCategories = async () => {
  try {
    const categoriesWithRooms = await db_default.roomCategory.findMany({
      include: {
        rooms: true
      }
    });
    return { rdata: categoriesWithRooms, rerror: null };
  } catch (error) {
    console.error("Error in getAllCategoriesWithAvailableRooms:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getCategoryByHotel = async (id) => {
  try {
    const hotelCategories = await db_default.roomCategory.findMany({
      where: {
        hotelId: id
      },
      include: {
        rooms: true
      }
    });
    return { rdata: hotelCategories, rerror: null };
  } catch (error) {
    console.error("Error in getHotelCategoriesWithAvailableRooms:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getCategoryById = async (id) => {
  try {
    const hotelCategories = await db_default.roomCategory.findUnique({
      where: {
        id
      },
      include: {
        rooms: true
      }
    });
    return { rdata: hotelCategories, rerror: null };
  } catch (error) {
    console.error("Error in getHotelCategoriesWithAvailableRooms:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var deleteCategoryById = async (id) => {
  try {
    const hotelCategories = await db_default.roomCategory.delete({
      where: {
        id
      }
    });
    return { rdata: hotelCategories, rerror: null };
  } catch (error) {
    console.error("Error in getHotelCategoriesWithAvailableRooms:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var createRoom = async ({ hotelId, roomCategoryId, roomNo }) => {
  try {
    const existingRoom = await db_default.room.findFirst({
      where: {
        hotelId,
        roomCategoryId,
        roomNo
      }
    });
    if (existingRoom) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Room number already exists in this hotel and room category"
        }
      };
    }
    const room = await db_default.room.create({
      data: {
        hotelId,
        roomCategoryId,
        roomNo
      }
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error("Error in createRoom:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var updateRoom = async (roomId, updateData) => {
  const { roomNo } = updateData;
  try {
    const room = await db_default.room.update({
      where: { id: roomId },
      data: {
        roomNo
      }
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error("Error in updateRoom:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var deleteRoom = async (roomId) => {
  try {
    const room = await db_default.room.delete({
      where: { id: roomId }
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error("Error in deleteRoom:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var activeRoomUpdate = async (roomId) => {
  try {
    const room = await db_default.room.findUnique({
      where: { id: roomId }
    });
    await db_default.room.update({
      where: {
        id: roomId
      },
      data: {
        isActive: !room.isActive
      }
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error("Error in active update:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var availabilityRoomUpdate = async (roomId) => {
  try {
    const room = await db_default.room.findUnique({
      where: { id: roomId }
    });
    await db_default.room.update({
      where: {
        id: roomId
      },
      data: {
        isAvailable: !room.isAvailable
      }
    });
    return { rdata: room, rerror: null };
  } catch (error) {
    console.error("Error in availability update:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getAllRooms = async () => {
  try {
    const rooms = await db_default.room.findMany();
    return { rdata: rooms, rerror: null };
  } catch (error) {
    console.error("Error in getAllRooms:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var addRoomImages = async ({
  roomCategoryId,
  category,
  imageUrls
}) => {
  try {
    const ifCategoryExist = await db_default.roomImage.findMany({
      where: {
        roomCategoryId,
        category: {
          equals: category,
          mode: "insensitive"
        }
      }
    });
    if (ifCategoryExist.length > 0) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "Category already listed!"
        }
      };
    }
    const roomImage = await db_default.roomImage.create({
      data: {
        roomCategoryId,
        category,
        imageUrls
      }
    });
    return { rdata: roomImage, rerror: null };
  } catch (error) {
    console.error("Error in addRoomImages:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var updateRoomImages = async (imageId, updateData) => {
  try {
    const roomImage = await db_default.roomImage.update({
      where: { id: imageId },
      data: updateData
    });
    return { rdata: roomImage, rerror: null };
  } catch (error) {
    console.error("Error in updateRoomImages:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var deleteRoomImages = async (imageId) => {
  try {
    const roomImage = await db_default.roomImage.delete({
      where: { id: imageId }
    });
    return { rdata: roomImage, rerror: null };
  } catch (error) {
    console.error("Error in deleteRoomImages:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/adminModule/hotel/hotelRoomController.js
var handleCreateRoom = async (req, res) => {
  const {
    hotelId,
    roomType,
    price,
    discount,
    discountedPrice,
    isAvailable,
    isActive
  } = req.body;
  const { rdata, rerror } = await createRoom({
    hotelId,
    roomType,
    price,
    discount,
    discountedPrice,
    isAvailable,
    isActive
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};
var handleUpdateRoom = async (req, res) => {
  const { roomId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoom(roomId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleDeleteRoom = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await deleteRoom(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: "Room deleted successfully" });
};
var handleGetAllRooms = async (req, res) => {
  const { rdata, rerror } = await getAllRooms();
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleAddRoomImages = async (req, res) => {
  const { roomId, category, imageUrls } = req.body;
  const { rdata, rerror } = await addRoomImages({
    roomId,
    category,
    imageUrls
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};
var handleUpdateRoomImages = async (req, res) => {
  const { imageId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoomImages(imageId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleDeleteRoomImages = async (req, res) => {
  const { imageId } = req.params;
  const { rdata, rerror } = await deleteRoomImages(imageId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: "Room image deleted successfully" });
};

// routes/admin/hotel/hotelRoomRoutes.js
import { Router as Router7 } from "express";
var router8 = Router7();
router8.post("/addNewRoom", handleCreateRoom);
router8.put("/updateRoom/:roomId", handleUpdateRoom);
router8.delete("/deleteRoom/:roomId", handleDeleteRoom);
router8.get("/getAllRooms", handleGetAllRooms);
router8.post("/addRoomImages", handleAddRoomImages);
router8.put("/updateImages/:imageId", handleUpdateRoomImages);
router8.delete("/deleteRoomImages/:imageId", handleDeleteRoomImages);
var hotelRoomRoutes_default = router8;

// modules/adminModule/hotel/hotelRoomAmenitiesController.js
var addNewHotelRoomAmenitiesController = async (req, res) => {
  try {
    const amenitiesData = {
      ...req.body
    };
    const { data, error } = checkRequiredFields(amenitiesData, ["hotelId"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createHotelRoomAmenities(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllHotelRoomAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelRoomAmenities();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getHotelRoomAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelRoomAmenitiesById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel amenities by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateHotelRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;
  try {
    const amenitiesData = {
      ...req.body
    };
    const { rdata, rerror } = await updateHotelRoomAmenities(id, amenitiesData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updating hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteHotelRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteHotelRoomAmenities(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting hotel amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/admin/hotel/hotelRoomAmenitiesRoutes.js
import { Router as Router8 } from "express";
var router9 = Router8();
var hotelRoomAmenitiesRoutes_default = router9.post("/addNewRoomAmenities", addNewHotelRoomAmenitiesController).patch("/updateRoomAmenities/:id", updateHotelRoomAmenitiesController).get("/getAllRoomsAmenities", getAllHotelRoomAmenitiesController).get("/getRoomAmenitiesById/:id", getHotelRoomAmenitiesByIdController).delete("/deleteRoomAmenities/:id", deleteHotelRoomAmenitiesController);

// modules/hotel/hotelRatingService.js
var addNewRating = async ({
  rating,
  comment,
  hotelId,
  customerId
}) => {
  try {
    const existingReview = await db_default.reviewAndRating.findFirst({
      where: {
        hotelId,
        customerId
      }
    });
    if (existingReview) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "You have already submitted a review for this hotel."
        }
      };
    }
    const booking = await db_default.booking.findFirst({
      where: {
        hotelId
      }
    });
    if (!booking) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Booking not found"
        }
      };
    }
    const hotelRating = await db_default.reviewAndRating.create({
      data: {
        rating,
        comment,
        hotelId,
        customerId
      }
    });
    return { rdata: hotelRating, rerror: null };
  } catch (error) {
    console.error("Error in rating and reviews:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getAllReviews = async () => {
  try {
    const allRating = await db_default.reviewAndRating.findMany();
    if (!allRating) {
      return {
        rdata: null,
        rerror: { status: 404, message: "rating not found" }
      };
    }
    return { rdata: allRating, eerror: null };
  } catch (error) {
    console.error("Error in rating and reviews:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getById = async (id) => {
  try {
    const rating = await db_default.reviewAndRating.findUnique({
      where: { id }
    });
    if (!rating) {
      return {
        rdata: null,
        rerror: { status: 404, message: "rating not found" }
      };
    }
    return { rdata: rating, eerror: null };
  } catch (error) {
    console.error("Error in rating and reviews:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var updateReview = async (id, { rating, comment }) => {
  try {
    const updateRating = await db_default.reviewAndRating.update({
      where: { id },
      data: {
        rating,
        comment
      }
    });
    if (!updateRating) {
      return {
        rdata: null,
        rerror: { status: 404, message: "rating not found" }
      };
    }
    return { rdata: updateRating, rerror: null };
  } catch (error) {
    console.error("Error in rating and reviews:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteRating = async (id) => {
  try {
    const deletedData = await db_default.reviewAndRating.delete({
      where: {
        id
      }
    });
    return { rdata: deletedData, rerror: null };
  } catch (error) {
    console.error("Error in rating and reviews:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/adminModule/hotel/hotelRatingController.js
var addNewRatingController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "hotelId",
      "customerId"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await addNewRating(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllRatingController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllReviews();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getRatingByIdController = async (req, res) => {
  const id = req.params.id;
  try {
    const { rdata, rerror } = await getById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateRatingController = async (req, res) => {
  const id = req.params.id;
  const { rating, comment } = req.body;
  try {
    const { rdata, rerror } = await updateReview(id, { rating, comment });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteRatingController = async (req, res) => {
  const id = req.params.id;
  try {
    const { rdata, rerror } = await deleteRating(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/admin/hotel/hotelRatingRoutes.js
import { Router as Router9 } from "express";
var router10 = Router9();
var hotelRatingRoutes_default = router10.post("/addNewRating", addNewRatingController).get("/getAllRatings", getAllRatingController).patch("/updateRating/:id", updateRatingController).get("/getRatingById/:id", getRatingByIdController).delete("/deleteRating/:id", deleteRatingController);

// modules/adminModule/customer/customerService.js
var getAllCustomers = async (filters) => {
  const { name, email, phone, isActive, page = 1, pageSize = 10 } = filters;
  const skip = (Number(page) - 1) * Number(pageSize);
  const take = Number(pageSize);
  const total = await db_default.customer.count({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : void 0,
      email: email ? { contains: email, mode: "insensitive" } : void 0,
      phone: phone ? { contains: phone, mode: "insensitive" } : void 0,
      isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
    }
  });
  const data = await db_default.customer.findMany({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : void 0,
      email: email ? { contains: email, mode: "insensitive" } : void 0,
      phone: phone ? { contains: phone, mode: "insensitive" } : void 0,
      isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
    },
    select: {
      id: true,
      email: true,
      name: true,
      phone: true,
      isActive: true,
      createdAt: true,
      updatedAt: true
    },
    skip,
    take,
    orderBy: { createdAt: "desc" }
  });
  return {
    data,
    pagination: {
      total,
      page: Number(page),
      pageSize: take
    }
  };
};
var getCustomerById = async (id) => {
  return await db_default.customer.findUnique({
    where: {
      id
    },
    omit: {
      password: true
    }
  });
};
var toggleCustomerStatus = async (id) => {
  const customer = await db_default.customer.findUnique({
    where: { id },
    select: {
      isActive: true
    }
  });
  return await db_default.customer.update({
    where: { id },
    data: {
      isActive: !customer.isActive
    }
  });
};
var deleteCustomer = async (id) => {
  await db_default.vendor.update({
    where: { id },
    data: { isActive: false }
  });
};

// modules/adminModule/customer/customerController.js
var getAllCustomersController = async (req, res) => {
  try {
    const filters = req.query;
    const customers = await getAllCustomers(filters);
    res.status(200).json(customers);
  } catch (error) {
    console.error("Error in getAllCustomersController:", error);
    res.status(500).json({ message: "Failed to fetch customers", error: error.message });
  }
};
var getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customer details",
      error: error.message
    });
  }
};
var toggleCustomerStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await toggleCustomerStatus(id);
    res.status(200).json({
      message: `Customer status updated`,
      customer: updatedCustomer
    });
  } catch (error) {
    console.error("Error in toggleCustomerStatusController:", error);
    res.status(500).json({
      message: "Failed to update customer status",
      error: error.message
    });
  }
};
var deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCustomer(id);
    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete customer", error: error.message });
  }
};

// routes/admin/customer/customerRoutes.js
import { Router as Router10 } from "express";
var router11 = Router10();
var customerRoutes_default = router11.get("/getAllCustomer", getAllCustomersController).get("/getCustomerById", getCustomerByIdController).get("/toggleCustomerStatus/:id", toggleCustomerStatusController).delete("/deleteCustomer", deleteCustomerController);

// modules/adminModule/vendor/vendorService.js
var getAllVendors = async (filters) => {
  const { name, email, phone, isActive, page = 1, pageSize = 10 } = filters;
  const skip = (page - 1) * pageSize;
  const take = parseInt(pageSize);
  const total = await db_default.vendor.count({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : void 0,
      email: email ? { contains: email, mode: "insensitive" } : void 0,
      phone: phone ? { contains: phone, mode: "insensitive" } : void 0,
      isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
    }
  });
  const vendors = await db_default.vendor.findMany({
    where: {
      name: name ? { contains: name, mode: "insensitive" } : void 0,
      email: email ? { contains: email, mode: "insensitive" } : void 0,
      phone: phone ? { contains: phone, mode: "insensitive" } : void 0,
      isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
    },
    skip,
    take,
    omit: {
      password: true
    },
    include: {
      bankKYC: true,
      hotels: {
        include: {
          ReviewAndRating: true
        }
      }
    }
  });
  return {
    data: vendors,
    pagination: {
      total,
      page: parseInt(page),
      pageSize: take
    }
  };
};
var getVendorById = async (id) => {
  return await db_default.vendor.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      lastName: true,
      phone: true,
      isActive: true,
      isVerifiedEmail: true,
      profileImage: true,
      city: true,
      state: true,
      country: true,
      createdAt: true,
      updatedAt: true
    }
  });
};
var toggleVendorActivation = async (id) => {
  const vendor = await db_default.vendor.findUnique({
    where: {
      id
    }
  });
  return await db_default.vendor.update({
    where: { id },
    data: { isActive: !vendor.isActive },
    select: {
      id: true,
      name: true,
      isActive: true
    }
  });
};
var deleteVendor = async (id) => {
  await db_default.vendor.update({
    where: { id },
    data: { isActive: false }
  });
};
var getVendorPayments = async (filters) => {
  const {
    vendorName,
    status,
    method,
    maxAmount,
    startDate,
    endDate,
    sortBy = "createdAt",
    sortOrder = "desc",
    page = 1,
    pageSize = 10
  } = filters;
  const whereClause = {};
  if (vendorName) {
    whereClause.vendor = {
      OR: [
        { name: { contains: vendorName, mode: "insensitive" } },
        { lastName: { contains: vendorName, mode: "insensitive" } }
      ]
    };
  }
  if (status) {
    whereClause.status = status;
  }
  if (method) {
    whereClause.method = method;
  }
  if (maxAmount) {
    whereClause.amount = {
      lte: parseFloat(maxAmount)
    };
  }
  if (startDate || endDate) {
    whereClause.createdAt = {
      ...startDate && { gte: new Date(startDate) },
      ...endDate && { lte: new Date(endDate) }
    };
  }
  const orderByClause = {};
  if (["createdAt", "amount"].includes(sortBy)) {
    orderByClause[sortBy] = sortOrder === "asc" ? "asc" : "desc";
  } else {
    orderByClause.createdAt = "desc";
  }
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  const vendorPayments = await db_default.vendorPayment.findMany({
    where: whereClause,
    include: {
      vendor: {
        select: {
          name: true,
          lastName: true
        }
      }
    },
    orderBy: orderByClause,
    skip,
    take
  });
  const totalCount = await db_default.vendorPayment.count({ where: whereClause });
  const totalAmount = await db_default.vendorPayment.aggregate({
    where: {
      status: "PAID"
    },
    _sum: {
      amount: true
    }
  });
  return {
    data: vendorPayments,
    totalAmount: totalAmount._sum.amount,
    pagination: {
      total: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize)
    }
  };
};
var updateKYCStatus = async (id, status, rejectionReason) => {
  try {
    const kycRecord = await db_default.bankKYC.findUnique({
      where: { id },
      include: { vendor: true }
    });
    if (!kycRecord) {
      return {
        kycData: null,
        kycError: { status: 404, message: "KYC record not found" }
      };
    }
    const updatedKYC = await db_default.bankKYC.update({
      where: { id },
      data: {
        kycStatus: status,
        kycRejectedAt: status === "REJECTED" ? /* @__PURE__ */ new Date() : null,
        kycVerifiedAt: status === "VERIFIED" ? /* @__PURE__ */ new Date() : null,
        kycRejectionReason: status === "REJECTED" ? rejectionReason : null
      },
      include: { vendor: true }
    });
    return { kycData: updatedKYC, kycError: null };
  } catch (error) {
    console.error("Error updating KYC status:", error);
    return {
      kycData: null,
      kycError: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/adminModule/vendor/vendorController.js
var getAllVendorsController = async (req, res) => {
  try {
    const filters = req.query;
    const result = await getAllVendors(filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendors", error: error.message });
  }
};
var getVendorByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await getVendorById(id);
    if (vendor) {
      res.status(200).json(vendor);
    } else {
      res.status(404).json({ message: "Vendor not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vendor", error: error.message });
  }
};
var toggleVendorActivationController = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await toggleVendorActivation(id);
    res.status(200).json({
      message: `Vendor ${vendor.isActive ? "activated" : "deactivated"} successfully`,
      vendor
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update vendor status",
      error: error.message
    });
  }
};
var deleteVendorController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteVendor(id);
    res.status(200).json({ message: "Vendor deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vendor", error: error.message });
  }
};
var getAllVendorPaymentsController = async (req, res) => {
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
      pageSize: parseInt(req.query.pageSize) || 10
    };
    const result = await getVendorPayments(filters);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch vendor payments",
      error: error.message
    });
  }
};
var getKYCEmailTemplate = (status, rejectionReason) => {
  const statusColor = {
    VERIFIED: "#28a745",
    REJECTED: "#dc3545",
    IN_PROGRESS: "#ffc107",
    PENDING: "#007bff"
  };
  const rejectionContent = status === "REJECTED" ? `<p style="color: red;"><strong>Rejection Reason:</strong> ${rejectionReason}</p>` : "";
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
var updateKYCStatusController = async (req, res) => {
  const { id } = req.params;
  const { status, rejectionReason } = req.body;
  if (!["VERIFIED", "REJECTED", "IN_PROGRESS", "PENDING"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status value. Must be VERIFIED, REJECTED, IN_PROGRESS, or PENDING."
    });
  }
  if (status === "REJECTED" && (!rejectionReason || rejectionReason.trim() === "")) {
    return res.status(400).json({
      message: "Rejection reason is required when status is REJECTED."
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
      message: getKYCEmailTemplate(status, rejectionReason)
    };
    await verifyEmail_default(emailOptions);
    return res.status(200).json({ message: "KYC status updated and email sent to vendor." });
  } catch (error) {
    console.error("Error in updating KYC status:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/admin/vendor/vendorRoutes.js
import { Router as Router11 } from "express";
var router12 = Router11();
var vendorRoutes_default = router12.get("/getAllVendors", getAllVendorsController).get("/getVendorById/:id", getVendorByIdController).put("/toggleVendorStatus/:id", toggleVendorActivationController).delete("/deleteVendor/:id", deleteVendorController).get("/getPayments", getAllVendorPaymentsController).put("/kyc/:id/status", updateKYCStatusController);

// routes/admin/bookings/bookingRoutes.js
import { Router as Router12 } from "express";

// modules/adminModule/booking/bookingService.js
import { BookingStatus } from "@prisma/client";
var getAllBookings = async () => {
  try {
    const bookings = await db_default.booking.findMany({
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            description: true,
            avgPrice: true,
            bannerImage: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true
          }
        }
      }
    });
    return { rdata: bookings, error: null };
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getBookingByBookingId = async (bookingId) => {
  try {
    const booking = await db_default.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            location: true,
            description: true,
            avgPrice: true,
            bannerImage: true,
            website: true,
            phone: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true
          }
        }
      }
    });
    if (!booking) {
      return { rdata: null, error: "No booking found for this ID." };
    }
    return { rdata: booking, error: null };
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getAdminBookingsStatus = async (hotelId, status, startDate, endDate, page, pageSize) => {
  try {
    const parsedStartDate = startDate ? new Date(startDate) : void 0;
    const parsedEndDate = endDate ? new Date(endDate) : void 0;
    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);
    const hotelCondition = hotelId ? { hotelId } : {};
    let statusCondition = {};
    let dateCondition = {};
    if (status === "ongoing") {
      dateCondition = {
        checkIn: { lte: parsedEndDate || /* @__PURE__ */ new Date() },
        checkOut: { gte: parsedStartDate || /* @__PURE__ */ new Date() }
      };
      statusCondition = {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.CHECKED_IN] }
      };
    } else if (status === "upcoming") {
      dateCondition = { checkIn: { gte: parsedStartDate || /* @__PURE__ */ new Date() } };
      statusCondition = {
        status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] }
      };
    } else if (status === "past") {
      dateCondition = { checkOut: { lte: parsedEndDate || /* @__PURE__ */ new Date() } };
      statusCondition = { status: BookingStatus.CHECKED_OUT };
    } else if (status === "canceled") {
      dateCondition = {
        updatedAt: { gte: parsedStartDate, lte: parsedEndDate }
      };
      statusCondition = { status: BookingStatus.CANCELED };
    } else {
      return { rdata: null, error: "Invalid status provided." };
    }
    const bookings = await db_default.booking.findMany({
      where: {
        ...hotelCondition,
        ...dateCondition,
        ...statusCondition
      },
      skip,
      take,
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            description: true,
            avgPrice: true,
            bannerImage: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true
          }
        }
      },
      orderBy: status === "upcoming" ? { checkIn: "asc" } : status === "past" || status === "canceled" ? { updatedAt: "desc" } : {}
    });
    const total = await db_default.booking.count({
      where: {
        ...hotelCondition,
        ...dateCondition,
        ...statusCondition
      }
    });
    return {
      rdata: {
        data: bookings,
        pagination: {
          total,
          page: Number(page),
          pageSize: take
        }
      },
      error: null
    };
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};

// modules/adminModule/booking/bookingController.js
var getAllBookingsController = async (req, res) => {
  try {
    const { rdata, error } = await getAllBookings();
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching all bookings:", error);
    res.status(500).json({ message: "Something went wrong during fetching bookings" });
  }
};
var getBookingByBookingIdController = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { rdata, error } = await getBookingByBookingId(bookingId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during getting booking :", error);
    res.status(500).json({ message: "Something went wrong during booking retrieval" });
  }
};
var getAdminBookingsStatusController = async (req, res) => {
  try {
    const { status } = req.params;
    const { hotelId, startDate, endDate, page = 1, pageSize = 10 } = req.query;
    if (!status) {
      return res.status(400).json({ message: "Fields are required" });
    }
    const { rdata, error } = await getAdminBookingsStatus(
      hotelId,
      status,
      startDate,
      endDate,
      page,
      pageSize
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching customer bookings:", error);
    res.status(500).json({ message: "Something went wrong during fetching bookings" });
  }
};

// routes/admin/bookings/bookingRoutes.js
var router13 = Router12();
var bookingRoutes_default = router13.get("/getAllBookings", getAllBookingsController).get("/getBookingById/:bookingId", getBookingByBookingIdController).get("/getBookingsByStatus/:status", getAdminBookingsStatusController);

// routes/admin/inquiry/inquiryRoutes.js
import { Router as Router13 } from "express";

// modules/adminModule/inquiry/inquiryServices.js
var getAllInquiry = async ({ page = 1, limit = 10 }) => {
  page = parseInt(page);
  limit = parseInt(limit);
  try {
    const offset = (page - 1) * limit;
    const inquiries = await db_default.inquiry.findMany({
      skip: offset,
      take: limit,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        createdAt: true
      }
    });
    const totalInquiries = await db_default.inquiry.count();
    return {
      rdata: {
        status: 200,
        inquiries,
        total: totalInquiries,
        page,
        limit
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getAllInquiry:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Something went wrong" }
    };
  }
};

// modules/adminModule/inquiry/inquiryController.js
var getAllInquiryController = async (req, res) => {
  const { page, limit } = req.query;
  try {
    const { rdata, rerror } = await getAllInquiry({ page, limit });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in getAllInquiryController:", error);
    res.status(500).send("Something went wrong");
  }
};

// routes/admin/inquiry/inquiryRoutes.js
var router14 = Router13();
var inquiryRoutes_default = router14.use("/getAll", getAllInquiryController);

// modules/vendorModule/chartData/chartDataService.js
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format
} from "date-fns";
var getDashboardMetrics = async () => {
  try {
    const totalActiveCustomers = await db_default.customer.count({
      where: {
        isActive: true
      }
    });
    const totalActiveVendors = await db_default.vendor.count({
      where: {
        isActive: true
      }
    });
    const totalActiveHotels = await db_default.hotel.count({
      where: {
        isActive: true
      }
    });
    const totalPaidAmount = await db_default.vendorPayment.aggregate({
      _sum: {
        amount: true
      },
      where: {
        isPaid: true
      }
    });
    return {
      totalCustomer: totalActiveCustomers,
      totalVendor: totalActiveVendors,
      totalHotel: totalActiveHotels,
      totalAmountPaid: totalPaidAmount._sum.amount || 0
      // Default to 0 if no data
    };
  } catch (error) {
    console.error("Error fetching dashboard metrics:", error);
    throw new Error("Internal Server Error");
  }
};
var getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const diff = date - startDate;
  const oneDay = 1e3 * 60 * 60 * 24;
  const days = Math.floor(diff / oneDay);
  return Math.ceil(days / 7);
};
var getRevenueData = async () => {
  try {
    const today = /* @__PURE__ */ new Date();
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayOfWeek = format(day, "E");
      const dailyRevenue = await db_default.vendorPayment.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          createdAt: {
            gte: new Date(day.setHours(0, 0, 0, 0)),
            lt: new Date(day.setHours(23, 59, 59, 999))
          }
        }
      });
      dailyData.push({
        day: dayOfWeek,
        revenue: dailyRevenue._sum.amount || 0
      });
    }
    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const startOfWeekDate = startOfWeek(
        today.setDate(today.getDate() - i * 7)
      );
      const endOfWeekDate = endOfWeek(startOfWeekDate);
      const weeklyRevenue = await db_default.vendorPayment.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          createdAt: {
            gte: startOfWeekDate,
            lt: endOfWeekDate
          }
        }
      });
      weeklyData.push({
        week: `Week ${getWeekNumber(startOfWeekDate)}`,
        revenue: weeklyRevenue._sum.amount || 0
      });
    }
    const currentMonth = today.getMonth();
    const monthlyData = [];
    for (let i = 0; i <= currentMonth; i++) {
      const month = /* @__PURE__ */ new Date();
      month.setMonth(i);
      const startOfMonthDate = startOfMonth(month);
      const endOfMonthDate = endOfMonth(month);
      const monthlyRevenue = await db_default.vendorPayment.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          createdAt: {
            gte: startOfMonthDate,
            lt: endOfMonthDate
          }
        }
      });
      monthlyData.push({
        month: format(startOfMonthDate, "MMMM"),
        revenue: monthlyRevenue._sum.amount || 0
      });
    }
    return {
      dailyData,
      weeklyData,
      monthlyData
    };
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    throw new Error("Internal Server Error");
  }
};
var getHotelsData = async () => {
  try {
    const hotels = await db_default.hotel.findMany({
      select: {
        name: true,
        city: true,
        latitude: true,
        longitude: true
      }
    });
    return hotels;
  } catch (error) {
    console.error("Error fetching hotels data:", error);
    throw new Error("Internal Server Error");
  }
};

// modules/vendorModule/chartData/chartDataController.js
var getDashboardDataController = async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    return res.status(200).json(metrics);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
var getRevenueDataController = async (req, res) => {
  try {
    const data = await getRevenueData();
    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching revenue data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
var getHotelsController = async (req, res) => {
  try {
    const hotels = await getHotelsData();
    return res.status(200).json(hotels);
  } catch (error) {
    console.error("Error in getHotelsController:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// routes/admin/ChartData/chartDataRoutes.js
import { Router as Router14 } from "express";
var router15 = Router14();
var chartDataRoutes_default = router15.get("/getMetrics", getDashboardDataController).get("/getRevenueData", getRevenueDataController).get("/getAllHotelsDetails", getHotelsController);

// routes/admin/index.js
var router16 = Router15();
router16.use("/role", roleRoutes_default).use("/staff", staffRoutes_default).use("/customer", customerRoutes_default).use("/vendor", vendorRoutes_default).use("/bookings", bookingRoutes_default).use("/staff/auth", authRoutes_default).use("/staff/permission", permitedRoutes_default).use("/hotel", hotelRoutes_default).use("/hotel/rating", hotelRatingRoutes_default).use("/hotel/amenities", hotelAmenitiesRoutes_default).use("/room/amenities", hotelRoomAmenitiesRoutes_default).use("/hotel/room", hotelRoomRoutes_default).use("/inquiry", inquiryRoutes_default).use("/chartData", chartDataRoutes_default);
var admin_default = router16;

// routes/customer/index.js
import { Router as Router18 } from "express";

// modules/customerModule/auth/customerAuthController.js
import jwt5 from "jsonwebtoken";

// modules/customerModule/auth/customerAuthService.js
import jwt4 from "jsonwebtoken";
import bcrypt2 from "bcrypt";
import dotenv3 from "dotenv";
import crypto2 from "crypto";
import axios from "axios";
dotenv3.config();
var sendOTP = async ({ email, name, phone, password }) => {
  const checkCustomer = await db_default.customer.findFirst({
    where: {
      email,
      phone
    }
  });
  if (checkCustomer !== null && checkCustomer.isVerifiedEmail) {
    return {
      rdata: null,
      rerror: {
        status: 400,
        message: "Email or Phone already exist!"
      }
    };
  }
  if (!checkCustomer) {
    const hashedPassword = await bcrypt2.hash(password, 10);
    const customer = await db_default.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone
      }
    });
  }
  const otp = Math.floor(1e5 + Math.random() * 9e5);
  const sendOTP2 = async (email2, otp2) => {
    const mailOptions = {
      email: email2,
      subject: "Email Verification - OTP Code",
      message: `
        <p>Dear User,</p>
        <p>Thank you for registering with <strong>Aone Prime Hotel</strong>. To complete your email verification, please use the OTP code provided below:</p>
        <h2 style="color: #4CAF50;">${otp2}</h2>
        <p>This OTP is valid for the next 5 minutes. Please do not share it with anyone.</p>
        <p>If you did not request this code, please ignore this email.</p>
        <br>
        <p>Best regards,</p>
        <p><strong>Aone Prime Hotel Support Team</strong></p>
        <p><a href="https://mreverierooms.in/">Visit our website</a></p>
      `
    };
    try {
      await verifyEmail_default(mailOptions);
      return otp2;
    } catch (error) {
      console.error("Error sending OTP email:", error);
      throw error;
    }
  };
  try {
    await db_default.otp.create({
      data: {
        email,
        otp
      }
    });
    const result = await sendOTP2(email, otp);
    return {
      rdata: { message: "OTP sent successfully", status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in sendOTP:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var verifyOTP = async ({ email, enteredOtp }) => {
  try {
    const otpRecord = await db_default.otp.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" }
    });
    if (!otpRecord) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "OTP not found"
        }
      };
    }
    if (otpRecord.otp === parseInt(enteredOtp)) {
      await db_default.otp.delete({
        where: { id: otpRecord.id }
      });
      await db_default.customer.update({
        where: { email },
        data: { isVerifiedEmail: true }
      });
      return {
        rdata: {
          status: 200,
          message: "OTP verified successfully"
        },
        rerror: null
      };
    } else {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Invalid OTP"
        }
      };
    }
  } catch (error) {
    console.error("Error in verifyOTP:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Failed to verify OTP"
      }
    };
  }
};
var newCustomer = async ({ name, email, password, phone }) => {
  try {
    const checkCustomer = await db_default.customer.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });
    if (checkCustomer && checkCustomer.isVerifiedEmail) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Email or Phone already exist!"
        }
      };
    }
    const hashedPassword = await bcrypt2.hash(password, 10);
    const customer = await db_default.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone
      }
    });
    if (customer) {
      const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${customer.id}`;
      const message = `Verify your Email: Hi ${customer.name}, please click the following link to verify your email: ${verifyURL}`;
      try {
        await verifyEmail_default({
          email: customer.email,
          subject: "Your Email Verification",
          message
        });
        return {
          rdata: {
            message: "Verification link sent to email!",
            status: 200
          },
          rerror: null
        };
      } catch (error) {
        console.error("Error sending email:", error);
        return {
          rdata: null,
          rerror: {
            status: 500,
            message: "Failed to send verification email"
          }
        };
      }
    }
    return {
      rdata: { customer, status: 201 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in newCustomer:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var verifyEmail = async ({ verifyId }) => {
  try {
    const customer = await db_default.customer.findUnique({
      where: {
        id: verifyId
      }
    });
    if (!customer) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Invalid verification ID"
        }
      };
    }
    await db_default.customer.update({
      where: {
        id: customer.id
      },
      data: {
        isVerifiedEmail: true
      }
    });
    return {
      rdata: {
        status: "success",
        message: "Email verified successfully"
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in verifyEmail:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var loginCustomer = async ({ email, password }) => {
  const checkCustomer = await db_default.customer.findFirst({
    where: { email }
  });
  if (checkCustomer && !checkCustomer) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: "Your email is incorrect"
      }
    };
  }
  if (checkCustomer && !checkCustomer.isVerifiedEmail) {
    const verifyURL = `${process.env.FRONTEND_URL}/verify-email/${checkCustomer.id}`;
    const message = `Verify your Email: Hi ${checkCustomer.name}, please click the following link to verify your email: ${verifyURL}`;
    try {
      await verifyEmail_default({
        email: checkCustomer.email,
        subject: "Your Email Verification",
        message
      });
      return {
        rdata: null,
        rerror: {
          status: 403,
          message: "Please verify your email! A new verification link has been sent."
        }
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        rdata: null,
        rerror: {
          status: 500,
          message: "Failed to send verification email. Please try again later."
        }
      };
    }
  }
  const checkPassword = await bcrypt2.compare(password, checkCustomer.password);
  if (!checkPassword) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: "Password is incorrect"
      }
    };
  }
  const customer = {
    id: checkCustomer.id,
    name: checkCustomer.name,
    email: checkCustomer.email,
    phone: checkCustomer.phone
  };
  const accessToken = jwt4.sign({ customer }, process.env.ACCESS_TOKEN, {
    expiresIn: "1d"
  });
  const refreshToken = jwt4.sign({ customer }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d"
  });
  await db_default.customer.update({
    where: { id: checkCustomer.id },
    data: { refreshToken }
  });
  return {
    rdata: {
      customer,
      accessToken,
      refreshToken,
      status: 200
    },
    rerror: null
  };
};
var customerLogout = async ({ customer }) => {
  await db_default.customer.update({
    where: { id: customer.customer.id },
    data: { refreshToken: null }
  });
  return {
    rdata: {
      message: "Logout successful",
      status: 200
    }
  };
};
var newRefreshToken2 = async ({ refreshToken }) => {
  let foundCustomer;
  const { rdata, rerror } = await jwt4.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      foundCustomer = await db_default.customer.findUnique({
        where: { id: decoded.customer.id }
      });
      if (!foundCustomer || foundCustomer.refreshToken !== refreshToken) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      const customer = {
        id: foundCustomer.id,
        name: foundCustomer.name,
        email: foundCustomer.email,
        phone: foundCustomer.phone
      };
      const newAccessToken = jwt4.sign({ customer }, process.env.ACCESS_TOKEN, {
        expiresIn: "1d"
      });
      return {
        rdata: {
          customer,
          accessToken: newAccessToken,
          status: 200
        }
      };
    }
  );
  return { rdata, rerror };
};
var forgotPassword2 = async ({ email }) => {
  try {
    const customer = await db_default.customer.findFirst({
      where: { email }
    });
    if (!customer) {
      return {
        rdata: null,
        rerror: { status: 404, message: "No customer with this email address" }
      };
    }
    const resetToken = crypto2.randomBytes(32).toString("hex");
    const hash = crypto2.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1e3);
    await db_default.customer.update({
      where: { id: customer.id },
      data: { resetToken: hash, passwordResetExpires }
    });
    const resetURL = `${process.env.FRONTEND_URL}/customer-forgot-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}.
If you didn't forget your password, please ignore this email!`;
    try {
      await verifyEmail_default({
        email: customer.email,
        subject: "Your password reset token (valid for 10 min)",
        message
      });
      return {
        rdata: { message: "Token sent to email!", status: 200 },
        rerror: null
      };
    } catch (emailError) {
      return {
        rdata: null,
        rerror: { status: 500, message: "Failed to send email" }
      };
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var resetPassword2 = async ({ token, password }) => {
  try {
    const hashedToken = crypto2.createHash("sha256").update(token).digest("hex");
    const customer = await db_default.customer.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: { gt: new Date(Date.now()) }
      }
    });
    if (!customer) {
      return {
        rdata: null,
        rerror: { status: 400, message: "Token is invalid or has expired" }
      };
    }
    const hashedPassword = await bcrypt2.hash(password, 10);
    await db_default.customer.update({
      where: { id: customer.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null
      }
    });
    const accessToken = jwt4.sign(
      { id: customer.id },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: "10d"
      }
    );
    return {
      rdata: { status: 200, accessToken },
      rerror: null
    };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/customerModule/auth/customerAuthController.js
var sendOTPController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "email",
      "name",
      "phone",
      "password"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await sendOTP({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in sendOTPController:", error);
    res.status(500).send("Something went wrong");
  }
};
var verifyOTPController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "email",
      "enteredOtp"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await verifyOTP({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in verifyPhoneController:", error);
    res.status(500).send("Something went wrong");
  }
};
var newCustomerController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "name",
      "email",
      "password",
      "phone"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await newCustomer({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in newCustomerController:", error);
    res.status(500).send("Something went wrong");
  }
};
var verifyEmailController = async (req, res) => {
  const verifyId = req.params.id;
  try {
    const { rdata, rerror } = await verifyEmail({ verifyId });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in verifyEmailController:", error);
    res.status(500).send("Something went wrong");
  }
};
var customerLoginController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "email",
      "password"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await loginCustomer({ ...data });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    const { accessToken, refreshToken, customer } = rdata;
    res.cookie("userjwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    res.status(rdata.status).json({ data: customer, accessToken });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var customerLogoutController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.userjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.userjwt;
    const customer = jwt5.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!customer) {
      return res.sendStatus(204);
    }
    const { rdata } = await customerLogout({ customer });
    res.clearCookie("userjwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true
    });
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var customerAuthRefreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.userjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.userjwt;
    const { rdata, rerror } = await newRefreshToken2({
      refreshToken
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json({ ...rdata });
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var forgotPasswordController2 = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ["email"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await forgotPassword2({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var resetPasswordController2 = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ["password"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await resetPassword2({
      token: req.params.token,
      ...data
    });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in resetPasswordController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// middleware/verifyToken.js
import jwt6 from "jsonwebtoken";

// routes/customer/customerAuthRoutes.js
import { Router as Router16 } from "express";
var router17 = Router16();
var customerAuthRoutes_default = router17.post("/sendOTP", sendOTPController).post("/verifyOTP", verifyOTPController).post("/register", newCustomerController).post("/login", customerLoginController).get("/logout", customerLogoutController).get("/refresh", customerAuthRefreshTokenController).get("/verifyEmail/:id", verifyEmailController).post("/forgotPassword", forgotPasswordController2).patch("/resetPassword/:token", resetPasswordController2);

// routes/customer/customerRoutes.js
import express2 from "express";

// modules/customerModule/profile/customerService.js
var updateCustomerProfile = async (id, profileData) => {
  try {
    const customer = await db_default.customer.update({
      where: { id },
      data: profileData
    });
    return { rdata: customer, rerror: null };
  } catch (error) {
    console.error("Error in updateCustomerProfile:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getCustomerProfileById = async (id) => {
  try {
    const customer = await db_default.customer.findUnique({
      where: { id }
    });
    if (!customer) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Customer not found"
        }
      };
    }
    return { rdata: customer, rerror: null };
  } catch (error) {
    console.error("Error in getCustomerProfileById:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteCustomerProfile = async (id) => {
  try {
    await db_default.customer.delete({
      where: { id }
    });
    return {
      rdata: { message: "Customer deleted successfully" },
      rerror: null
    };
  } catch (error) {
    console.error("Error in deleteCustomerProfile:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/customerModule/profile/customerController.js
var updateCustomerProfileController = async (req, res) => {
  const { id } = req.params;
  const imageUrls = req.body.fileUrls;
  const { name, gender, dob, phone, street, pincode, city, state, country } = req.body;
  const profileImage = imageUrls.filter((file) => file.fieldname === "profileImg").map((file) => file.location);
  try {
    const profileData = {
      name,
      gender,
      dob,
      phone,
      street,
      pincode,
      city,
      state,
      country,
      profileImage: profileImage[0]
    };
    const { rdata, rerror } = await updateCustomerProfile(id, profileData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updateCustomerProfileController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getCustomerProfileByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getCustomerProfileById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getCustomerProfileByIdController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteCustomerProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteCustomerProfile(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleteCustomerProfileController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// modules/customerModule/Rating/CustomerRatingController.js
var addNewRatingController2 = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "hotelId",
      "customerId"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await addNewRating(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getRatingByIdController2 = async (req, res) => {
  const id = req.params.id;
  try {
    const { rdata, rerror } = await getById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteRatingController2 = async (req, res) => {
  const id = req.params.id;
  try {
    const { rdata, rerror } = await deleteRating(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel rating:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/customer/customerRoutes.js
import { Router as Router17 } from "express";
var router18 = Router17();
router18.patch("/update/:id", uploadFiles, updateCustomerProfileController);
router18.get("/getById/:id/", getCustomerProfileByIdController);
router18.delete("/deleteById/:id/", deleteCustomerProfileController);
router18.post("/addNewRating", addNewRatingController2);
router18.get("/getRatingById/:id", getRatingByIdController2);
router18.delete("/deleteRating/:id", deleteRatingController2);
var customerRoutes_default2 = router18;

// routes/customer/index.js
var router19 = Router18();
var customer_default = router19.use("/auth", customerAuthRoutes_default).use("/profile", customerRoutes_default2);

// routes/vendor/index.js
import { Router as Router30 } from "express";

// modules/vendorModule/auth/vendorAuthController.js
import jwt8 from "jsonwebtoken";

// modules/vendorModule/auth/vendorAuthService.js
import jwt7 from "jsonwebtoken";
import bcrypt3 from "bcrypt";
import dotenv4 from "dotenv";
import crypto3 from "crypto";
dotenv4.config();
var newVendor = async ({
  name,
  email,
  password,
  phone,
  lastName,
  agreeTerms
}) => {
  try {
    const checkVendor = await db_default.vendor.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });
    if (checkVendor) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Email or Phone already exist!"
        }
      };
    }
    const hashedPassword = await bcrypt3.hash(password, 10);
    const vendor = await db_default.vendor.create({
      data: {
        name,
        lastName,
        email,
        password: hashedPassword,
        phone,
        isVerifiedEmail: false,
        agreeTerms: Boolean(agreeTerms)
      }
    });
    if (vendor) {
      const verifyURL = `${process.env.FRONTEND_URL}/verify-vendor-email/${vendor.id}`;
      const message = `Hi ${vendor.name}, Please click this link to verify your email: ${verifyURL}`;
      try {
        await verifyEmail_default({
          email: vendor.email,
          subject: "Verify Your Email!",
          message
        });
        return {
          rdata: { message: "Verification link sent to email!", status: 200 },
          rerror: null
        };
      } catch (error) {
        console.error("Error sending verification email:", error);
        return {
          rdata: null,
          rerror: {
            status: 500,
            message: "Failed to send verification email"
          }
        };
      }
    }
    return {
      rdata: { vendor, status: 201 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in newVendor:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var newVendorStaff = async ({
  name,
  email,
  password,
  phone,
  vendorId,
  roleId
}) => {
  try {
    const checkVendorStaff = await db_default.vendorStaff.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });
    const checkVendor = await db_default.vendor.findFirst({
      where: {
        OR: [{ email }, { phone }]
      }
    });
    if (checkVendor) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Email or phone already used in another account"
        }
      };
    }
    if (checkVendorStaff) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Vendor staff already exists"
        }
      };
    }
    const hashedPassword = await bcrypt3.hash(password, 10);
    const vendorStaff = await db_default.vendorStaff.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
        isVerifiedEmail: true,
        role: {
          connect: {
            id: roleId
          }
        },
        vendor: {
          connect: {
            id: vendorId
          }
        }
      }
    });
    return {
      rdata: { vendorStaff, status: 201 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in newVendorStaff:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var verifyVendorEmail = async ({ verifyId }) => {
  try {
    const vendor = await db_default.vendor.findFirst({
      where: {
        id: verifyId
      }
    });
    if (!vendor) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Invalid verification ID"
        }
      };
    }
    await db_default.vendor.update({
      where: {
        id: vendor.id
      },
      data: {
        isVerifiedEmail: true
      }
    });
    return {
      rdata: {
        status: 200,
        message: "Email verified successfully"
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in verifyVendorEmail:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var loginVendor = async ({ email, password }) => {
  let role = "vendor";
  let permittedRoutes = [];
  let vendorId = "";
  let user = await db_default.vendor.findFirst({
    where: { email }
  });
  if (!user) {
    user = await db_default.vendorStaff.findFirst({
      where: { email }
    });
    if (user) {
      role = "vendorStaff";
      vendorId = user.vendorId;
      permittedRoutes = await db_default.permitedRoutes.findMany({
        where: { vendorStaffId: user.id }
      });
    }
  }
  if (!user) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: "Email or Password is wrong"
      }
    };
  }
  if (!user.isVerifiedEmail) {
    const verifyURL = `${process.env.FRONTEND_URL}/verify-vendor-email/${user.id}`;
    const message = `Hi ${user.email}, Please click this link to verify your email: ${verifyURL}`;
    try {
      await verifyEmail_default({
        email: user.email,
        subject: "Verify Your Email!",
        message
      });
      return {
        rdata: null,
        rerror: {
          status: 403,
          message: "Please verify your email! A new verification link has been sent."
        }
      };
    } catch (error) {
      console.error("Error sending verification email:", error);
      return {
        rdata: null,
        rerror: {
          status: 500,
          message: "Failed to send verification email"
        }
      };
    }
  }
  const checkPassword = await bcrypt3.compare(password, user.password);
  if (!checkPassword) {
    return {
      rdata: null,
      rerror: {
        status: 401,
        message: "Email or Password is wrong"
      }
    };
  }
  const userOptions = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone
  };
  const accessToken = jwt7.sign({ userOptions }, process.env.ACCESS_TOKEN, {
    expiresIn: "7d"
  });
  const refreshToken = jwt7.sign({ userOptions }, process.env.REFRESH_TOKEN, {
    expiresIn: "7d"
  });
  if (role === "vendor") {
    await db_default.vendor.update({
      where: { id: user.id },
      data: { refreshToken }
    });
  } else {
    await db_default.vendorStaff.update({
      where: { id: user.id },
      data: { refreshToken }
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
      status: 200
    },
    rerror: null
  };
};
var vendorLogout = async ({ vendor }) => {
  let user;
  if (vendor.userOptions.role === "vendor") {
    user = await db_default.vendor.update({
      where: {
        id: vendor.userOptions.id
      },
      data: {
        refreshToken: null
      }
    });
  } else if (vendor.userOptions.role === "vendorStaff") {
    user = await db_default.vendorStaff.update({
      where: {
        id: vendor.userOptions.id
      },
      data: {
        refreshToken: null
      }
    });
  }
  return {
    rdata: {
      message: "Logout successful",
      status: 200
    },
    rerror: null
  };
};
var newRefreshToken3 = async ({ refreshToken }) => {
  let foundVendor;
  const { rdata, rerror } = await jwt7.verify(
    refreshToken,
    process.env.REFRESH_TOKEN,
    async (err, decoded) => {
      if (err) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      let role = "vendor";
      let permittedRoutes = [];
      let vendorId = "";
      foundVendor = await db_default.vendor.findUnique({
        where: {
          id: decoded.userOptions.id
        }
      });
      if (!foundVendor) {
        foundVendor = await db_default.vendorStaff.findUnique({
          where: {
            id: decoded.userOptions.id
          }
        });
        vendorId = foundVendor.vendorId;
        if (foundVendor) {
          permittedRoutes = await db_default.permitedRoutes.findMany({
            where: {
              vendorStaffId: foundVendor.id
            }
          });
        }
        role = "vendorStaff";
      }
      if (!foundVendor) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      if (foundVendor.refreshToken !== refreshToken) {
        return {
          rerror: {
            status: 403,
            message: "Unauthorized"
          }
        };
      }
      const userOptions = {
        id: foundVendor.id,
        name: foundVendor.name,
        email: foundVendor.email,
        phone: foundVendor.phone
      };
      const newAccessToken = jwt7.sign(
        { userOptions },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "1d"
        }
      );
      return {
        rdata: {
          data: {
            data: { ...userOptions, role, permittedRoutes, vendorId },
            accessToken: newAccessToken
          },
          status: 200
        }
      };
    }
  );
  return {
    rdata,
    rerror
  };
};
var forgotPassword3 = async ({ email }) => {
  try {
    const vendor = await db_default.vendor.findFirst({
      where: { email }
    });
    if (!vendor) {
      return {
        rdata: null,
        rerror: { status: 404, message: "No vendor with this email address" }
      };
    }
    const resetToken = crypto3.randomBytes(32).toString("hex");
    const hash = crypto3.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1e3);
    await db_default.vendor.update({
      where: { id: vendor.id },
      data: { resetToken: hash, passwordResetExpires }
    });
    const resetURL = `${process.env.FRONTEND_URL}/vendor-new-password/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password to ${resetURL}.
If you didn't forget your password, please ignore this email!`;
    try {
      await verifyEmail_default({
        email: vendor.email,
        subject: "Your password reset token (valid for 10 min)",
        message
      });
      return {
        rdata: { message: "Token sent to email!", status: 200 },
        rerror: null
      };
    } catch (emailError) {
      return {
        rdata: null,
        rerror: { status: 500, message: "Failed to send email" }
      };
    }
  } catch (error) {
    console.error("Error in forgotPassword:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var resetPassword3 = async ({ token, password }) => {
  try {
    const hashedToken = crypto3.createHash("sha256").update(token).digest("hex");
    const vendor = await db_default.vendor.findFirst({
      where: {
        resetToken: hashedToken,
        passwordResetExpires: { gt: new Date(Date.now()) }
      }
    });
    if (!vendor) {
      return {
        rdata: null,
        rerror: { status: 400, message: "Token is invalid or has expired" }
      };
    }
    const hashedPassword = await bcrypt3.hash(password, 10);
    await db_default.vendor.update({
      where: { id: vendor.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        passwordResetExpires: null
      }
    });
    const accessToken = jwt7.sign({ id: vendor.id }, process.env.ACCESS_TOKEN, {
      expiresIn: "10d"
    });
    return {
      rdata: { status: 200, accessToken },
      rerror: null
    };
  } catch (error) {
    console.error("Error in resetPassword:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/vendorModule/auth/vendorAuthController.js
var newVendorController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "name",
      "email",
      "password",
      "phone"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await newVendor({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json({ message: rdata.message || "Vendor created successfully" });
  } catch (error) {
    console.error("Error in newVendorController:", error);
    res.status(500).send("Something went wrong");
  }
};
var newVendorStaffController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "name",
      "email",
      "password",
      "phone",
      "vendorId"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await newVendorStaff({ ...data });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json({ message: rdata.message || "Vendor staff created successfully" });
  } catch (error) {
    console.error("Error in newVendorStaffController:", error);
    res.status(500).send("Something went wrong");
  }
};
var verifyVendorEmailController = async (req, res) => {
  const verifyId = req.params.id;
  try {
    const { rdata, rerror } = await verifyVendorEmail({ verifyId });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json({ message: rdata.message });
  } catch (error) {
    console.error("Error in verifyVendorEmailController:", error);
    res.status(500).send("Something went wrong");
  }
};
var vendorLoginController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "email",
      "password"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
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
      vendorId
    } = rdata;
    res.cookie("vendorjwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 7 * 24 * 60 * 60 * 1e3
      // 7 days
    });
    res.status(rdata.status).json({
      data: { ...userOptions, role, permittedRoutes, vendorId },
      accessToken,
      refreshToken
    });
  } catch (error) {
    console.error("Error in vendorLoginController:", error);
    res.status(500).send("Something went wrong");
  }
};
var vendorLogoutController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.vendorjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.vendorjwt;
    const vendor = jwt8.verify(refreshToken, process.env.REFRESH_TOKEN);
    if (!vendor) {
      return res.sendStatus(204);
    }
    const { rdata } = await vendorLogout({ vendor });
    res.clearCookie("vendorjwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true
    });
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var vendorAuthRefreshTokenController = async (req, res) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.vendorjwt) {
      return res.sendStatus(204);
    }
    const refreshToken = cookies.vendorjwt;
    const { rdata, rerror } = await newRefreshToken3({ refreshToken, res });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in vendorAuthRefreshTokenController:", error);
    res.status(500).send("Something went wrong");
  }
};
var forgotPasswordController3 = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ["email"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await forgotPassword3({ email: data.email });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in forgotPasswordController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var resetPasswordController3 = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, ["password"]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await resetPassword3({
      token: req.params.token,
      ...data
    });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error("Error in resetPasswordController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorAuthRoutes.js
import { Router as Router19 } from "express";
var router20 = Router19();
var vendorAuthRoutes_default = router20.post("/register", newVendorController).post("/registerStaff", newVendorStaffController).post("/login", vendorLoginController).post(
  "/logout",
  // verifyToken,
  vendorLogoutController
).get("/refresh", vendorAuthRefreshTokenController).get("/verifyEmail/:id", verifyVendorEmailController).post("/forgotPassword", forgotPasswordController3).patch("/resetPasword/:token", resetPasswordController3);

// modules/vendorModule/auth/vendorVerificationService.js
import { VerificationStatus } from "@prisma/client";
var createVerificationRequest = async (data) => {
  try {
    const {
      vendorId,
      hotelName,
      address,
      city,
      state,
      pincode,
      gstNo,
      aadharCardImage,
      hotelImages
    } = data;
    const verification = await db_default.vendorVerification.create({
      data: {
        vendorId,
        hotelName,
        address,
        city,
        state,
        pincode,
        gstNo,
        aadharCardImage,
        hotelImages: {
          set: hotelImages
        }
      }
    });
    return {
      rdata: { verification, status: 201 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in createVerificationRequest:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getVendorVerifications = async () => {
  try {
    const verifications = await db_default.vendorVerification.findMany();
    return {
      rdata: { verifications, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getVendorVerifications:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getVerificationById = async (id) => {
  try {
    const verification = await db_default.vendorVerification.findUnique({
      where: { id }
    });
    if (!verification) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Verification not found"
        }
      };
    }
    return {
      rdata: { verification, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in getVerificationById:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var updateVerificationStatus = async (id, { status, rejectedReason, hotelImages }) => {
  try {
    const verification = await db_default.vendorVerification.findUnique({
      where: { id }
    });
    if (!verification) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Verification not found"
        }
      };
    }
    const updatedVerification = await db_default.vendorVerification.update({
      where: { id },
      data: {
        status: status || verification.status,
        rejectedReason: rejectedReason || verification.rejectedReason,
        hotelImages: hotelImages ? { set: hotelImages } : verification.hotelImages,
        verifiedAt: status === VerificationStatus.APPROVED ? /* @__PURE__ */ new Date() : verification.verifiedAt
      }
    });
    return {
      rdata: { updatedVerification, status: 200 },
      rerror: null
    };
  } catch (error) {
    console.error("Error in updateVerificationStatus:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/vendorModule/auth/vendorVerificationController.js
var createVendorVerificationController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "vendorId",
      "hotelName",
      "address",
      "city",
      "state",
      "pincode",
      "aadharCardImage",
      "hotelImages"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createVerificationRequest(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var getVendorVerificationsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getVendorVerifications();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var getVerificationByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getVerificationById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};
var updateVerificationStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, rejectedReason } = req.body;
    const { rdata, rerror } = await updateVerificationStatus(id, {
      status,
      rejectedReason
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    res.status(rdata.status).json(rdata);
  } catch (error) {
    res.status(500).send("Something went wrong");
  }
};

// routes/vendor/vendorVerificationRoutes.js
import { Router as Router20 } from "express";
var router21 = Router20();
var vendorVerificationRoutes_default = router21.post("/apply", createVendorVerificationController).get("/getAll", getVendorVerificationsController).patch("/updateVerification/:id", updateVerificationStatusController).get("/getById/:id", getVerificationByIdController);

// routes/vendor/vendorRoutes.js
import express3 from "express";

// modules/vendorModule/profile/vendorService.js
var updateVendorProfile = async (id, profileData) => {
  try {
    const vendor = await db_default.vendor.update({
      where: { id },
      data: profileData
    });
    return { rdata: vendor, rerror: null };
  } catch (error) {
    console.error("Error in updateCustomerProfile:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getVendorProfileById = async (id) => {
  try {
    const vendor = await db_default.vendor.findUnique({
      where: { id }
    });
    if (!vendor) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Customer not found"
        }
      };
    }
    return { rdata: vendor, rerror: null };
  } catch (error) {
    console.error("Error in getCustomerProfileById:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteVendorProfile = async (id) => {
  try {
    await db_default.vendor.delete({
      where: { id }
    });
    return {
      rdata: { message: "Customer deleted successfully" },
      rerror: null
    };
  } catch (error) {
    console.error("Error in deleteCustomerProfile:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/vendorModule/profile/vendorController.js
var updateVendorProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const imageUrls = req.body.fileUrls;
    console.log("imageUrls", imageUrls);
    const { name, phone, street, pincode, city, state, country, gender, dob } = req.body;
    const profileImage = imageUrls && imageUrls.filter((file) => file.fieldname === "profileImg").map((file) => file.location);
    const profileData = {
      name,
      gender,
      dob,
      phone,
      street,
      pincode,
      city,
      state,
      country,
      profileImage: profileImage[0]
    };
    const { rdata, rerror } = await updateVendorProfile(id, profileData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updateCustomerProfileController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getVendorByIdController2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getVendorProfileById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getCustomerProfileByIdController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteVendorProfileController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteVendorProfile(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleteCustomerProfileController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorRoutes.js
var router22 = express3.Router();
router22.patch("/update/:id", uploadFiles, updateVendorProfileController);
router22.get("/getById/:id/", getVendorByIdController2);
router22.delete("/deleteById/:id/", deleteVendorProfileController);
var vendorRoutes_default2 = router22;

// routes/vendor/vendorHotelRoutes.js
import { Router as Router21 } from "express";

// modules/vendorModule/hotel/hotelController.js
import express4 from "express";

// modules/vendorModule/hotel/hotelService.js
var getAllHotelsByVendor = async (filters, sorting, checkIn2, checkOut2, vendorId) => {
  const {
    search,
    state,
    landmark,
    latitude,
    longitude,
    guestCount,
    price,
    rating,
    // Filter by average rating
    amenities
  } = filters;
  const { sortBy = "avgPrice", sortOrder = "desc" } = sorting;
  const validCheckIn = checkIn2 ? new Date(checkIn2) : null;
  const validCheckOut = checkOut2 ? new Date(checkOut2) : null;
  if (validCheckIn && isNaN(validCheckIn.getTime())) {
    return {
      rdata: null,
      rerror: { status: 400, message: "Invalid check-in date" }
    };
  }
  if (validCheckOut && isNaN(validCheckOut.getTime())) {
    return {
      rdata: null,
      rerror: { status: 400, message: "Invalid check-out date" }
    };
  }
  try {
    const hotels = await db_default.hotel.findMany({
      where: {
        vendorId,
        ...search && {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { landmark: { contains: search, mode: "insensitive" } }
          ]
        },
        ...state && { state: { contains: state, mode: "insensitive" } },
        ...latitude && longitude && {
          latitude,
          longitude
        },
        ...price && {
          avgPrice: { lte: price }
        },
        ...amenities && {
          RoomCategories: {
            some: {
              amenities: {
                hasEvery: amenities
              }
            }
          }
        }
      },
      include: {
        RoomCategories: {
          include: {
            rooms: {
              where: {
                isActive: true,
                isAvailable: true
              }
            }
          }
        },
        ReviewAndRating: {
          // Include reviews with customer details
          include: {
            customer: {
              // Assuming there's a relationship between reviews and customers
              select: {
                name: true,
                gender: true,
                profileImage: true
              }
            }
          }
        },
        hotelImages: true,
        hotelPolicy: true
      },
      orderBy: {
        [sortBy]: sortOrder
      }
    });
    const hotelsWithAvgRating = hotels.map((hotel) => {
      const totalReviews = hotel.ReviewAndRating.length;
      const sumRatings = hotel.ReviewAndRating.reduce(
        (sum, review) => sum + review.rating,
        0
      );
      const avgRating = totalReviews > 0 ? sumRatings / totalReviews : null;
      return {
        ...hotel,
        avgRating
        // Add calculated average rating to the hotel object
      };
    });
    let filteredHotels = guestCount ? hotelsWithAvgRating.filter(
      (hotel) => hotel.RoomCategories.some(
        (category) => parseInt(category.adultCount, 10) >= guestCount
      )
    ) : hotelsWithAvgRating;
    if (rating) {
      filteredHotels = filteredHotels.filter(
        (hotel) => hotel.avgRating >= rating
      );
    }
    return { rdata: filteredHotels, rerror: null };
  } catch (error) {
    console.error("Error in getAllHotels:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/vendorModule/hotel/hotelController.js
var router23 = express4.Router();
var addCityAddressController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "city",
      "state",
      "country",
      "zipcode"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const imageUrls = req.body.fileUrls;
    const formattedImageUrls = imageUrls.filter((file) => file.fieldname === "cityImage").map((file) => file.location)[0];
    const cityData = {
      ...data,
      cityImage: formattedImageUrls
    };
    const { rdata, rerror } = await addCityAddress(cityData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel with amenities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllCitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllCities();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in fetching all cities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getCityByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getCityById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in fetching city by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateCityAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const { fileUrls, ...restBody } = req.body;
    let formattedImageUrls;
    if (fileUrls && fileUrls.length > 0) {
      formattedImageUrls = fileUrls.filter((file) => file.fieldname === "cityImage").map((file) => file.location)[0];
    }
    const cityData = {
      ...restBody,
      ...formattedImageUrls && { cityImage: formattedImageUrls }
    };
    const { rdata, rerror } = await updateCityAddress(id, cityData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updating cityAddress:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteCityAddressController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteCityAddress(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting cityAddress:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var addNewHotelController2 = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "name",
      "city",
      "state",
      "country",
      "zipcode",
      "vendorId",
      "type"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const imageUrls = req.body.fileUrls || [];
    const formattedBannerImage = imageUrls.filter((file) => file.fieldname === "bannerImage").map((file) => file.location)[0];
    const hotelData = {
      ...data,
      bannerImage: formattedBannerImage,
      amenities: req.body.amenities || []
    };
    const { rdata, rerror } = await createHotel(hotelData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating hotel:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllHotelByVendorController = async (req, res) => {
  try {
    const {
      search,
      city,
      state,
      landmark,
      latitude,
      longitude,
      checkIn: checkIn2,
      checkOut: checkOut2,
      guestCount,
      price,
      rating,
      amenities,
      sortBy,
      sortOrder
    } = req.query;
    const { vendorId } = req.params;
    const filters = {
      search,
      city,
      state,
      landmark,
      latitude,
      longitude,
      guestCount: guestCount ? parseInt(guestCount, 10) : void 0,
      price: price ? parseFloat(price) : void 0,
      rating: rating ? parseInt(rating, 10) : void 0,
      amenities: amenities ? amenities.split(",") : void 0
    };
    const sorting = {
      sortBy: sortBy || "name",
      sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "asc"
    };
    const { rdata, rerror } = await getAllHotelsByVendor(
      filters,
      sorting,
      checkIn2,
      checkOut2,
      vendorId
    );
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotels:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getHotelByIdController2 = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateHotelController2 = async (req, res) => {
  const { id } = req.params;
  try {
    const imageUrls = req.body.fileUrls || [];
    const formattedBannerImage = imageUrls.filter((file) => file.fieldname === "bannerImage").map((file) => file.location)[0];
    const hotelData = {
      ...req.body,
      bannerImage: formattedBannerImage || req.body.bannerImage,
      amenities: req.body.amenities || []
    };
    const { rdata, rerror } = await updateHotel(id, hotelData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updating hotel:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteHotelController2 = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteHotel(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting hotel:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var handleAddHotelImagesController = async (req, res) => {
  const { hotelId, category } = req.body;
  const imageUrls = req.body.fileUrls;
  const formattedImageUrls = imageUrls.filter((file) => file.fieldname === "hotelImage").map((file) => file.location);
  const { rdata, rerror } = await addHotelImages({
    hotelId,
    category,
    imageUrls: formattedImageUrls
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};
var handleUpdateHotelImagesController = async (req, res) => {
  const { hotelId, category } = req.body;
  const existingUrls = req.body.existingImageUrls || [];
  const imageUrls = req.body.fileUrls;
  const uploadedFiles = imageUrls.filter((file) => file.fieldname === "hotelImage").map((file) => file.location);
  const formattedImageUrls = [...existingUrls, ...uploadedFiles];
  console.log("formattedImageUrls", formattedImageUrls);
  const { rdata, rerror } = await updateHotelImages({
    hotelId,
    category,
    imageUrls: formattedImageUrls
  });
  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  return res.status(200).json(rdata);
};
var handleDeleteHotelImagesController = async (req, res) => {
  const { id } = req.params;
  const { rdata, rerror } = await deleteHotelImages(id);
  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  return res.status(200).json(rdata);
};

// modules/vendorModule/policy/policyService.js
var addVendorHotelPolicy = async ({
  checkInTime,
  checkOutTime,
  childrenPolicy = true,
  localId = true,
  coupleFriendly = true,
  foreignGuests = true,
  workWithChannelManager = false,
  payAtHotel = true,
  ownershipDocument = [],
  propertyImage = [],
  cancellationPolicy,
  nonRefundable = true,
  ownershipType,
  additionalPolicies = null,
  channelManagerDetails = null,
  vendorId,
  hotelId
}) => {
  try {
    if (!checkInTime || !checkOutTime || cancellationPolicy === void 0 || !ownershipType) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "All required fields must be provided!"
        }
      };
    }
    const existingPolicy = await db_default.vendorHotelPolicy.findFirst({
      where: {
        vendorId,
        hotelId
      }
    });
    if (existingPolicy) {
      return {
        rdata: null,
        rerror: {
          status: 401,
          message: "Policy for this vendor and hotel already exists!"
        }
      };
    }
    const newPolicy = await db_default.vendorHotelPolicy.create({
      data: {
        checkInTime,
        checkOutTime,
        childrenPolicy: Boolean(childrenPolicy),
        localId: Boolean(localId),
        coupleFriendly: Boolean(coupleFriendly),
        foreignGuests: Boolean(foreignGuests),
        workWithChannelManager: Boolean(workWithChannelManager),
        payAtHotel: Boolean(payAtHotel),
        ownershipDocument,
        propertyImage,
        cancellationPolicy: Boolean(cancellationPolicy),
        nonRefundable: Boolean(nonRefundable),
        ownershipType,
        additionalPolicies,
        channelManagerDetails: channelManagerDetails ? {
          create: {
            companyName: channelManagerDetails.companyName || "",
            contactPerson: channelManagerDetails.contactPerson || "",
            email: channelManagerDetails.email || "",
            phone: channelManagerDetails.phone || ""
          }
        } : void 0,
        // set to undefined if no details are provided
        vendorId,
        hotelId
      }
    });
    return { rdata: newPolicy, rerror: null };
  } catch (error) {
    console.error("Error in creating VendorHotelPolicy:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getAllVendorHotelPoliciesByVendor = async (vendorId) => {
  try {
    const policies = await db_default.vendorHotelPolicy.findMany({
      where: { vendorId },
      include: {
        channelManagerDetails: true,
        Vendor: true,
        Hotel: true
      }
    });
    if (!policies || policies.length === 0) {
      return {
        rdata: [],
        rerror: {
          status: 404,
          message: "No policies found for this vendor!"
        }
      };
    }
    return { rdata: policies, rerror: null };
  } catch (error) {
    console.error(
      "Error in getting all VendorHotelPolicies by Vendor ID:",
      error
    );
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getAllVendorHotelPolicies = async () => {
  try {
    const policies = await db_default.vendorHotelPolicy.findMany({
      include: {
        channelManagerDetails: true,
        Vendor: true,
        Hotel: true
      }
    });
    if (!policies || policies.length === 0) {
      return {
        rdata: [],
        rerror: {
          status: 404,
          message: "No policies found!"
        }
      };
    }
    return { rdata: policies, rerror: null };
  } catch (error) {
    console.error("Error in getting all VendorHotelPolicies:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getVendorHotelPolicyById = async (id) => {
  try {
    const policy = await db_default.vendorHotelPolicy.findUnique({
      where: { id },
      include: {
        channelManagerDetails: true,
        Vendor: true,
        Hotel: true
      }
    });
    if (!policy) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Policy not found!"
        }
      };
    }
    return { rdata: policy, rerror: null };
  } catch (error) {
    console.error("Error in getting VendorHotelPolicy by ID:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteVendorHotelPolicy = async (id) => {
  try {
    const policy = await db_default.vendorHotelPolicy.findUnique({ where: { id } });
    if (!policy) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Policy not found!"
        }
      };
    }
    await db_default.vendorHotelPolicy.delete({ where: { id } });
    return { rdata: { message: "Policy deleted successfully" }, rerror: null };
  } catch (error) {
    console.error("Error in deleting VendorHotelPolicy:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/vendorModule/policy/policyController.js
var addVendorHotelPolicyController = async (req, res) => {
  console.log("req.body", req.body);
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "checkInTime",
      "checkOutTime",
      "cancellationPolicy",
      "ownershipType"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const currentDate = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    const checkInTime = /* @__PURE__ */ new Date(`${currentDate}T${req.body.checkInTime}:00Z`);
    const checkOutTime = /* @__PURE__ */ new Date(
      `${currentDate}T${req.body.checkOutTime}:00Z`
    );
    const documentUrls = req.body.fileUrls.filter((file) => file.fieldname === "ownershipDocument").map((file) => file.location);
    const propertyImageUrls = req.body.fileUrls.filter((file) => file.fieldname === "propertyImage").map((file) => file.location);
    const policyData = {
      ...data,
      checkInTime,
      checkOutTime,
      ownershipDocument: documentUrls,
      propertyImage: propertyImageUrls,
      vendorId: req.body.vendorId,
      hotelId: req.body.hotelId
    };
    const { rdata, rerror } = await addVendorHotelPolicy(policyData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating VendorHotelPolicy:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllVendorHotelPoliciesByVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rdata, rerror } = await getAllVendorHotelPoliciesByVendor(vendorId);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error(
      "Error in getting all VendorHotelPolicies by Vendor ID:",
      error
    );
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllVendorHotelPoliciesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllVendorHotelPolicies();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting all VendorHotelPolicies:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getVendorHotelPolicyByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getVendorHotelPolicyById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting VendorHotelPolicy by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteVendorHotelPolicyController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteVendorHotelPolicy(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting VendorHotelPolicy:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorHotelRoutes.js
var router24 = Router21();
var vendorHotelRoutes_default = router24.post("/addNewHotel", uploadFiles, addNewHotelController2).post("/addHotelImages", uploadFiles, handleAddHotelImagesController).patch("/updateHotelImages", uploadFiles, handleUpdateHotelImagesController).delete("/deleteHotelImages/:id", handleDeleteHotelImagesController).get("/getAllHotelByVendorId/:vendorId", getAllHotelByVendorController).get("/getHotelById/:id", getHotelByIdController2).put("/updateHotel/:id", uploadFiles, updateHotelController2).delete("/deleteHotel/:id", deleteHotelController2).post("/addCity", uploadFiles, addCityAddressController).get("/getAllCity", getAllCitiesController).get("/getCityById/:id", getCityByIdController).patch("/updateCity/:id", uploadFiles, updateCityAddressController).delete("/deleteCity/:id", deleteCityAddressController).post("/addHotelPolicy", uploadFiles, addVendorHotelPolicyController).get("/getAllHotelPolicy", getAllVendorHotelPoliciesController).get(
  "/getAllHotelPolicyByVendor/:vendorId",
  getAllVendorHotelPoliciesByVendorController
).get("/getAllHotelPolicyById/:id", getVendorHotelPolicyByIdController).delete("/deleteHotelPolicy/:id", deleteVendorHotelPolicyController);

// modules/vendorModule/hotel/hotelRoomController.js
var handleAddRoomCategoryController = async (req, res) => {
  const {
    category,
    hotelId,
    bedType,
    adultCount,
    roomSize,
    description,
    price,
    discount,
    perGuestPrice,
    amenities
  } = req.body;
  const imageUrls = req.body.fileUrls;
  const discountedPrice = discount ? price - price * discount / 100 : price;
  const formattedImageUrls = imageUrls.filter((file) => file.fieldname === "roomCatImage").map((file) => file.location);
  const { rdata, rerror } = await addRoomCategory({
    category,
    hotelId,
    bedType,
    adultCount,
    roomSize,
    description,
    price,
    discount,
    discountedPrice,
    categoryImage: formattedImageUrls,
    perGuestPrice,
    amenities
  });
  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  return res.status(201).json(rdata);
};
var handleUpdateRoomCategoryController = async (req, res) => {
  const {
    category,
    bedType,
    adultCount,
    roomSize,
    description,
    price,
    discount,
    perGuestPrice,
    amenities,
    existingImageUrls = []
  } = req.body;
  const { id } = req.params;
  const imageUrls = req.body.fileUrls || [];
  const uploadedFiles = imageUrls.filter((file) => file.fieldname === "categoryImage").map((file) => file.location);
  const formattedImageUrls = [...existingImageUrls, ...uploadedFiles];
  const discountedPrice = discount ? price - price * discount / 100 : price;
  try {
    const { rdata, rerror } = await updateRoomCategory({
      categoryId: id,
      category,
      bedType,
      adultCount,
      roomSize,
      description,
      price,
      discount,
      discountedPrice,
      categoryImage: formattedImageUrls,
      perGuestPrice,
      amenities
    });
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in handleUpdateRoomCategoryController:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
var handleGetAllRoomCategoryController = async (req, res) => {
  const { rdata, rerror } = await getAllRoomCategories();
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleGetCategoryByHotelController = async (req, res) => {
  const id = req.params.id;
  const { rdata, rerror } = await getCategoryByHotel(id);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleGetCategoryByIdController = async (req, res) => {
  const id = req.params.id;
  const { rdata, rerror } = await getCategoryById(id);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleDeleteCategoryByIdController = async (req, res) => {
  const id = req.params.id;
  const { rdata, rerror } = await deleteCategoryById(id);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleCreateRoomController = async (req, res) => {
  const { hotelId, roomCategoryId, roomNo } = req.body;
  const { rdata, rerror } = await createRoom({
    hotelId,
    roomCategoryId,
    roomNo
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};
var handleUpdateRoomController = async (req, res) => {
  const { roomId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoom(roomId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleDeleteRoomController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await deleteRoom(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: "Room deleted successfully" });
};
var handleActiveController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await activeRoomUpdate(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleAvailabilityController = async (req, res) => {
  const { roomId } = req.params;
  const { rdata, rerror } = await availabilityRoomUpdate(roomId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleGetAllRoomsController = async (req, res) => {
  const { rdata, rerror } = await getAllRooms();
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleAddRoomImagesController = async (req, res) => {
  const { roomCategoryId, category } = req.body;
  const imageUrls = req.body.fileUrls;
  const formattedImageUrls = imageUrls.filter((file) => file.fieldname === "roomImage").map((file) => file.location);
  const { rdata, rerror } = await addRoomImages({
    roomCategoryId,
    category,
    imageUrls: formattedImageUrls
  });
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(201).json(rdata);
};
var handleUpdateRoomImagesController = async (req, res) => {
  const { imageId } = req.params;
  const updateData = req.body;
  const { rdata, rerror } = await updateRoomImages(imageId, updateData);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var handleDeleteRoomImagesController = async (req, res) => {
  const { imageId } = req.params;
  const { rdata, rerror } = await deleteRoomImages(imageId);
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json({ message: "Room image deleted successfully" });
};

// routes/vendor/vendorHotelRoomRoutes.js
import { Router as Router22 } from "express";
var router25 = Router22();
var vendorHotelRoomRoutes_default = router25.post("/addNewRoom", handleCreateRoomController).get("/getAllRoom", handleGetAllRoomsController).put("/updateRoom/:roomId", handleUpdateRoomController).put("/activeRoom/:roomId", handleActiveController).put("/availabilityRoom/:roomId", handleAvailabilityController).delete("/deleteRoom/:roomId", handleDeleteRoomController).post("/addNewCategory", uploadFiles, handleAddRoomCategoryController).get("/getAllCategory", handleGetAllRoomCategoryController).get("/getCategoryByHotel/:id", handleGetCategoryByHotelController).put("/updateCategory/:id", uploadFiles, handleUpdateRoomCategoryController).get("/getCategoryById/:id", handleGetCategoryByIdController).delete("/deleteCategoryById/:id", handleDeleteCategoryByIdController).post("/addRoomImages", uploadFiles, handleAddRoomImagesController).put("/updateRoomImages/:id", uploadFiles, handleUpdateRoomImagesController).delete("/deleteRoomImages/:id", handleDeleteRoomImagesController);

// modules/hotel/hotelAmenitiesService.js
var createHotelAmenities2 = async (data) => {
  try {
    const amenities = await db_default.hotelAmenities.create({
      data: {
        amenities: data.amenities
      }
    });
    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error("Error in createHotelAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error creating hotel amenities" }
    };
  }
};
var getAllHotelAmenities2 = async () => {
  try {
    const amenities = await db_default.hotelAmenities.findMany({
      select: {
        amenities: true,
        id: true
      }
    });
    const allAmenities = amenities.flatMap(
      (hotelAmenity) => hotelAmenity.amenities.map((amenity) => ({
        id: hotelAmenity.id,
        name: amenity.name,
        icon: amenity.icon
      }))
    );
    return { rdata: allAmenities, rerror: null };
  } catch (error) {
    console.error("Error in getAllHotelAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error retrieving hotel amenities" }
    };
  }
};
var getHotelAllAmenitiesById = async (id) => {
  try {
    const amenities = await db_default.hotelAmenities.findUnique({
      where: { id }
    });
    if (!amenities) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Hotel amenities not found" }
      };
    }
    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error("Error in getHotelAllAmenitiesById:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Error retrieving hotel amenities by ID"
      }
    };
  }
};
var updateHotelAmenities2 = async (id, data) => {
  try {
    const updatedAmenities = await db_default.hotelAmenities.update({
      where: { id },
      data: {
        amenities: data.amenities
      }
    });
    return { rdata: updatedAmenities, rerror: null };
  } catch (error) {
    console.error("Error in updateHotelAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error updating hotel amenities" }
    };
  }
};
var deleteHotelAmenities2 = async (id) => {
  try {
    const deletedAmenity = await db_default.hotelAmenities.delete({
      where: { id }
    });
    return { rdata: deletedAmenity, rerror: null };
  } catch (error) {
    console.error("Error in deleteHotelAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error deleting hotel amenities" }
    };
  }
};

// modules/vendorModule/hotel/hotelAmenitiesController.js
var createHotelAmenitiesController = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrls = req.body.fileUrls;
    const formattedImageUrl = imageUrls.filter((file) => file.fieldname === "iconImage").map((file) => file.location)[0];
    const amenity = {
      name,
      icon: formattedImageUrl
    };
    const { rdata, rerror } = await createHotelAmenities2({
      amenities: [amenity]
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in createHotelAmenitiesController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllHotelAmenitiesController2 = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelAmenities2();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getAllHotelAmenitiesController:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getHotelAmenitiesByIdController2 = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelAllAmenitiesById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getHotelAmenitiesByIdController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateHotelAmenitiesController2 = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const imageUrls = req.body.fileUrls;
    const formattedImageUrl = imageUrls.filter((file) => file.fieldname === "iconImage").map((file) => file.location)[0];
    const amenity = {
      name,
      icon: formattedImageUrl
    };
    const { rdata, rerror } = await updateHotelAmenities2(id, {
      amenities: [amenity]
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updateHotelAmenitiesController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteHotelAmenitiesController2 = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteHotelAmenities2(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleteHotelAmenitiesController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorHotelAmenitiesRoutes.js
import { Router as Router23 } from "express";
var router26 = Router23();
var vendorHotelAmenitiesRoutes_default = router26.post("/addHotelAmenities", uploadFiles, createHotelAmenitiesController).get("/getAllHotelAmenities", getAllHotelAmenitiesController2).get("/getHotelAmenitiesById/:id", getHotelAmenitiesByIdController2).put("/updateHotelAmenities/:id", uploadFiles, updateHotelAmenitiesController2).delete("/deleteHotelAmenities/:id", deleteHotelAmenitiesController2);

// modules/hotel/hotelRoomAmenitiesService.js
var createRoomAmenities = async (data) => {
  try {
    const amenities = await db_default.roomAmenities.create({
      data: {
        amenities: data.amenities
      }
    });
    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error("Error in createRoomAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error creating room amenities" }
    };
  }
};
var getAllRoomAmenities = async () => {
  try {
    const amenities = await db_default.roomAmenities.findMany({
      select: {
        amenities: true,
        id: true
      }
    });
    const allAmenities = amenities.flatMap(
      (roomAmenity) => roomAmenity.amenities.map((amenity) => ({
        id: roomAmenity.id,
        name: amenity.name,
        icon: amenity.icon
      }))
    );
    return { rdata: allAmenities, rerror: null };
  } catch (error) {
    console.error("Error in getAllRoomAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error retrieving room amenities" }
    };
  }
};
var getRoomAmenitiesById = async (id) => {
  try {
    const amenities = await db_default.roomAmenities.findUnique({
      where: { id }
    });
    if (!amenities) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Room amenities not found" }
      };
    }
    return { rdata: amenities, rerror: null };
  } catch (error) {
    console.error("Error in getRoomAmenitiesById:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Error retrieving room amenities by ID"
      }
    };
  }
};
var updateRoomAmenities = async (id, data) => {
  try {
    const updatedAmenities = await db_default.roomAmenities.update({
      where: { id },
      data: {
        amenities: data.amenities
      }
    });
    return { rdata: updatedAmenities, rerror: null };
  } catch (error) {
    console.error("Error in updateRoomAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error updating room amenities" }
    };
  }
};
var deleteRoomAmenities = async (id) => {
  try {
    const deletedAmenity = await db_default.roomAmenities.delete({
      where: { id }
    });
    return { rdata: deletedAmenity, rerror: null };
  } catch (error) {
    console.error("Error in deleteRoomAmenities:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error deleting room amenities" }
    };
  }
};

// modules/vendorModule/hotel/hotelRoomAmenitiesController.js
var createRoomAmenitiesController = async (req, res) => {
  try {
    const { name } = req.body;
    const imageUrls = req.body.fileUrls;
    const formattedImageUrl = imageUrls.filter((file) => file.fieldname === "iconImage").map((file) => file.location)[0];
    const amenity = {
      name,
      icon: formattedImageUrl
    };
    const { rdata, rerror } = await createRoomAmenities({
      amenities: [amenity]
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in createRoomAmenitiesController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllRoomAmenitiesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllRoomAmenities();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getAllRoomAmenitiesController:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getRoomAmenitiesByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getRoomAmenitiesById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getRoomAmenitiesByIdController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    const imageUrls = req.body.fileUrls;
    const formattedImageUrl = imageUrls.filter((file) => file.fieldname === "iconImage").map((file) => file.location)[0];
    const amenity = {
      name,
      icon: formattedImageUrl
    };
    const { rdata, rerror } = await updateRoomAmenities(id, {
      amenities: [amenity]
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updateRoomAmenitiesController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteRoomAmenitiesController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteRoomAmenities(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleteRoomAmenitiesController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorHotelRoomAmenitiesRoutes.js
import { Router as Router24 } from "express";
var router27 = Router24();
var vendorHotelRoomAmenitiesRoutes_default = router27.post("/addNewRoomAmenities", uploadFiles, createRoomAmenitiesController).get("/getAllRoomAmenities", getAllRoomAmenitiesController).get("/getRoomAmenitiesById/:id", getRoomAmenitiesByIdController).put("/updateRoomAmenities/:id", uploadFiles, updateRoomAmenitiesController).delete("/deleteRoomAmenities/:id", deleteRoomAmenitiesController);

// modules/payment/vendorPaymentService.js
import crypto4 from "crypto";
import Razorpay from "razorpay";
var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
var createVendorPayment = async ({
  vendorId,
  hotelId,
  paymentAmount
}) => {
  if (paymentAmount !== 15e3) {
    return {
      rdata: null,
      rerror: { status: 400, message: "Invalid payment amount" }
    };
  }
  try {
    const truncatedHotelId = hotelId.slice(0, 20);
    const receiptId = `receipt_${truncatedHotelId}`;
    const options = {
      amount: paymentAmount * 100,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1
    };
    const order = await razorpay.orders.create(options);
    const payment = await db_default.vendorPayment.create({
      data: {
        vendorId,
        amount: paymentAmount,
        isPaid: false,
        hotelId
      }
    });
    return {
      rdata: { order, paymentId: payment.id },
      rerror: null
    };
  } catch (error) {
    console.error("Error in createVendorPayment:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var verifyVendorPayment = async ({
  razorpay_payment_id,
  razorpay_order_id,
  razorpay_signature,
  vendorId,
  hotelId
}) => {
  try {
    const hmac = crypto4.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== razorpay_signature) {
      await db_default.vendorPayment.update({
        where: { vendorId },
        data: { status: "FAILED" }
      });
      return {
        rdata: null,
        rerror: { status: 400, message: "Invalid payment signature" }
      };
    }
    const payment = await db_default.vendorPayment.findFirst({
      where: { hotelId, isPaid: false }
    });
    if (!payment) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Payment record not found" }
      };
    }
    await db_default.vendorPayment.update({
      where: { id: payment.id },
      data: { isPaid: true, status: "PAID", method: "Razorpay" }
    });
    const updatedHotel = await db_default.hotel.update({
      where: { id: hotelId },
      data: { isPaid: true }
    });
    return {
      rdata: {
        message: "Payment verified and hotel sent for review!",
        hotel: updatedHotel
      },
      rerror: null
    };
  } catch (error) {
    console.error("Error in verify Vendor Payment:", error);
    await db_default.vendorPayment.update({
      where: { vendorId },
      data: { status: "FAILED" }
    });
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getAllVendorPayments = async (vendorId) => {
  try {
    const payments = await db_default.vendorPayment.findMany({
      where: {
        vendorId
      }
    });
    if (!payments || payments.length === 0) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No vendor payments found!"
        }
      };
    }
    return { rdata: payments, rerror: null };
  } catch (error) {
    console.error("Error fetching vendor payments:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getVendorPaymentById = async (id) => {
  try {
    const payment = await db_default.vendorPayment.findUnique({
      where: { id }
    });
    if (!payment) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Payment not found!"
        }
      };
    }
    return { rdata: payment, rerror: null };
  } catch (error) {
    console.error("Error fetching vendor payment by ID:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/vendorModule/payment/vendorPaymentController.js
var createVendorPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "vendorId",
      "hotelId",
      "paymentAmount"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createVendorPayment(data);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in createVendorPaymentController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var verifyVendorPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "razorpay_payment_id",
      "razorpay_order_id",
      "razorpay_signature",
      "vendorId",
      "hotelId"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await verifyVendorPayment({
      ...data
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in verifyVendorPaymentController:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllVendorPaymentsController2 = async (req, res) => {
  const { vendorId } = req.params;
  try {
    const { rdata, rerror } = await getAllVendorPayments(vendorId);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in fetching vendor payments:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getVendorPaymentByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getVendorPaymentById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in fetching vendor payment by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorPaymentRoutes.js
import { Router as Router25 } from "express";
var router28 = Router25();
var vendorPaymentRoutes_default = router28.post("/payment", createVendorPaymentController).post("/payment/verification", verifyVendorPaymentController).get("/payment/allPayments/:vendorId", getAllVendorPaymentsController2).get("/payment/getPayment/:id", getVendorPaymentByIdController);

// modules/vendorModule/Bookings/vendorBookingService.js
import { BookingStatus as BookingStatus2 } from "@prisma/client";
import { subDays, startOfDay } from "date-fns";
var getVendorHotelBookings = async (vendorId) => {
  try {
    const bookings = await db_default.vendor.findUnique({
      where: {
        id: vendorId
      },
      select: {
        hotels: {
          select: {
            id: true,
            name: true,
            bookings: {
              select: {
                id: true,
                checkIn: true,
                checkOut: true,
                status: true,
                adultCount: true,
                roomCount: true,
                roomDetails: true,
                customer: {
                  select: {
                    name: true,
                    email: true,
                    phone: true,
                    gender: true,
                    profileImage: true
                  }
                },
                payment: {
                  select: {
                    amount: true,
                    gstAmount: true,
                    discountAmount: true,
                    status: true,
                    method: true,
                    createdAt: true,
                    updatedAt: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if (bookings.length === 0) {
      return { rdata: null, error: "No bookings found for this customer." };
    }
    return { rdata: bookings, error: null };
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getAllVendorHotelRatingsService = async (vendorId) => {
  try {
    const ratings = await db_default.vendor.findUnique({
      where: { id: vendorId },
      select: {
        hotels: {
          select: {
            name: true,
            ReviewAndRating: {
              select: {
                rating: true,
                comment: true,
                customer: {
                  select: {
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        }
      }
    });
    return { rdata: ratings, error: null };
  } catch (error) {
    console.error("Error fetching vendor hotel ratings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getNewestBookingService = async (vendorId) => {
  try {
    const newestBooking = await db_default.booking.findFirst({
      where: {
        Hotel: {
          vendorId
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      select: {
        id: true,
        checkIn: true,
        checkOut: true,
        status: true,
        Hotel: {
          select: {
            name: true,
            city: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true
          }
        }
      }
    });
    return { rdata: newestBooking, error: null };
  } catch (error) {
    console.error("Error fetching newest booking:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getCheckInOutOfTheDayService = async (vendorId) => {
  try {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    const checkInOut = await db_default.booking.findMany({
      where: {
        Hotel: {
          vendorId
        },
        OR: [{ status: "CHECKED_IN" }, { status: "CHECKED_OUT" }],
        checkIn: {
          gte: today
        },
        checkOut: {
          gte: today
        }
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true
          }
        },
        Hotel: {
          select: {
            name: true
          }
        }
      }
    });
    return { rdata: checkInOut, error: null };
  } catch (error) {
    console.error("Error fetching check-in and check-out of the day:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getAllCheckInOutService = async (vendorId) => {
  try {
    const checkInOut = await db_default.booking.findMany({
      where: {
        Hotel: {
          vendorId
        },
        OR: [{ status: "CHECKED_IN" }, { status: "CHECKED_OUT" }]
      },
      select: {
        checkIn: true,
        checkOut: true,
        status: true,
        customer: {
          select: {
            name: true,
            email: true
          }
        },
        Hotel: {
          select: {
            name: true
          }
        }
      }
    });
    return { rdata: checkInOut, error: null };
  } catch (error) {
    console.error("Error fetching all check-in and check-out:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getAllAvailableRoomsService = async (vendorId) => {
  try {
    const availableRooms = await db_default.hotel.findMany({
      where: {
        vendorId
      },
      select: {
        name: true,
        rooms: {
          where: {
            isAvailable: true
          },
          select: {
            id: true,
            RoomCategory: {
              select: {
                category: true,
                roomSize: true,
                bedType: true,
                price: true,
                discount: true,
                adultCount: true,
                perGuestPrice: true,
                discountedPrice: true,
                categoryImage: true
              }
            }
          }
        }
      }
    });
    return { rdata: availableRooms, error: null };
  } catch (error) {
    console.error("Error fetching available rooms:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getBookingStatusOfTheDayService = async (vendorId) => {
  const today = /* @__PURE__ */ new Date();
  today.setUTCHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(today.getUTCDate() + 1);
  try {
    const bookings = await db_default.booking.findMany({
      where: {
        Hotel: {
          vendorId
        },
        updatedAt: {
          gte: today,
          lt: tomorrow
        }
      },
      select: {
        status: true,
        createdAt: true,
        updatedAt: true,
        checkIn: true,
        checkOut: true,
        customer: {
          select: {
            name: true,
            email: true
          }
        },
        Hotel: {
          select: {
            name: true
          }
        }
      }
    });
    const confirmed = bookings.filter(
      (booking) => booking.status === "CONFIRMED"
    );
    const pending = bookings.filter((booking) => booking.status === "PENDING");
    const canceled = bookings.filter(
      (booking) => booking.status === "CANCELED"
    );
    const failed = bookings.filter((booking) => booking.status === "FAILED");
    const checkedIn = bookings.filter(
      (booking) => booking.status === "CHECKED_IN"
    );
    const checkedOut = bookings.filter(
      (booking) => booking.status === "CHECKED_OUT"
    );
    return {
      rdata: { confirmed, pending, canceled, failed, checkedIn, checkedOut },
      error: null
    };
  } catch (error) {
    console.error("Error fetching booking status of the day:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getTodayCheckInsService = async (vendorId, search, hotelId, date) => {
  try {
    const startDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);
    const searchFilter = search ? {
      OR: [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
        { customer: { phone: { contains: search, mode: "insensitive" } } }
      ]
    } : {};
    const checkIns = await db_default.booking.findMany({
      where: {
        Hotel: {
          vendorId,
          ...hotelId ? { id: hotelId } : {}
        },
        checkIn: {
          gte: startDate,
          lt: endDate
        },
        OR: [{ status: "CONFIRMED" }, { status: "CHECKED_IN" }],
        ...searchFilter
      },
      select: {
        checkIn: true,
        checkOut: true,
        id: true,
        status: true,
        roomDetails: true,
        payment: true,
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            guest: true
          }
        },
        Hotel: {
          select: {
            name: true
          }
        },
        createdAt: true
      }
    });
    const filteredCheckIns = checkIns.map((booking) => ({
      ...booking,
      customer: {
        ...booking.customer,
        guest: booking.customer.guest.filter(
          (guest) => guest.createdAt && booking.createdAt && guest.createdAt.toISOString().split("T")[0] === booking.createdAt.toISOString().split("T")[0]
        )
      }
    }));
    return { rdata: filteredCheckIns, error: null };
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getTodayCheckOutsService = async (vendorId, search, hotelId, date) => {
  try {
    const startDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    startDate.setUTCHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setUTCDate(startDate.getUTCDate() + 1);
    const searchFilter = search ? {
      OR: [
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
        { customer: { phone: { contains: search, mode: "insensitive" } } }
      ]
    } : {};
    const checkedOutBookings = await db_default.booking.findMany({
      where: {
        Hotel: {
          vendorId,
          ...hotelId ? { id: hotelId } : {}
        },
        checkOut: {
          gte: startDate,
          lt: endDate
        },
        status: "CHECKED_OUT",
        ...searchFilter
      },
      select: {
        checkOut: true,
        checkIn: true,
        status: true,
        updatedAt: true,
        payment: true,
        roomDetails: true,
        customer: {
          select: {
            name: true,
            email: true,
            phone: true,
            guest: true
          }
        },
        Hotel: {
          select: {
            name: true
          }
        },
        createdAt: true
      }
    });
    const filteredBookings = checkedOutBookings.map((booking) => ({
      ...booking,
      customer: {
        ...booking.customer,
        guest: booking.customer.guest.filter(
          (guest) => guest.createdAt && booking.createdAt && guest.createdAt.toISOString().split("T")[0] === booking.createdAt.toISOString().split("T")[0]
        )
      }
    }));
    return { rdata: filteredBookings, error: null };
  } catch (error) {
    console.error("Error fetching checkouts:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var vendorInventoryService = async (vendorId, filter) => {
  console.log("filter", filter);
  try {
    const today = /* @__PURE__ */ new Date();
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setUTCDate(today.getUTCDate() + 1);
    let result;
    if (filter === "CHECKED_OUT") {
      result = await db_default.booking.findMany({
        where: {
          Hotel: {
            vendorId
          },
          status: "CHECKED_OUT",
          updatedAt: {
            gte: today,
            lt: tomorrow
          }
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true
            }
          },
          Hotel: {
            select: {
              name: true
            }
          },
          payment: true
        }
      });
    } else if (filter === "OCCUPIED") {
      result = await db_default.roomCategory.findMany({
        where: {
          Hotel: {
            vendorId
          }
        },
        include: {
          Hotel: {
            select: {
              name: true
            }
          },
          rooms: {
            where: {
              isAvailable: false
            }
          }
        }
      });
    } else if (filter === "AVAILABLE") {
      result = await db_default.roomCategory.findMany({
        where: {
          Hotel: {
            vendorId
          }
        },
        include: {
          Hotel: {
            select: {
              name: true
            }
          },
          rooms: {
            where: {
              isAvailable: true
            }
          }
        }
      });
    } else if (filter === "NEW_BOOKINGS") {
      result = await db_default.booking.findMany({
        where: {
          Hotel: {
            vendorId
          },
          status: "CONFIRMED"
        },
        include: {
          customer: {
            select: {
              name: true,
              email: true
            }
          },
          Hotel: {
            select: {
              name: true
            }
          },
          payment: true
        }
      });
    }
    return { rdata: result, error: null };
  } catch (error) {
    console.error("Error fetching vendor data:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getBookingByBookingId2 = async (bookingId) => {
  try {
    const booking = await db_default.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            location: true,
            description: true,
            avgPrice: true,
            bannerImage: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true
          }
        }
      }
    });
    if (!booking) {
      return { rdata: null, error: "No booking found for this ID." };
    }
    return { rdata: booking, error: null };
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getVendorBookingsStatus = async (hotelId, status, date) => {
  try {
    const selectedDate = date ? new Date(date) : /* @__PURE__ */ new Date();
    let bookings;
    if (status === "ongoing") {
      bookings = await db_default.booking.findMany({
        where: {
          hotelId,
          checkIn: { lte: selectedDate },
          checkOut: { gte: selectedDate },
          status: { in: [BookingStatus2.CONFIRMED, BookingStatus2.CHECKED_IN] }
        },
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else if (status === "upcoming") {
      bookings = await db_default.booking.findMany({
        where: {
          hotelId,
          checkIn: { gte: selectedDate },
          status: { in: [BookingStatus2.CONFIRMED, BookingStatus2.PENDING] }
        },
        orderBy: { checkIn: "asc" },
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else if (status === "past") {
      bookings = await db_default.booking.findMany({
        where: {
          hotelId,
          checkOut: { lte: selectedDate },
          status: BookingStatus2.CHECKED_OUT
        },
        orderBy: { checkOut: "desc" },
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else if (status === "canceled") {
      bookings = await db_default.booking.findMany({
        where: {
          hotelId,
          status: BookingStatus2.CANCELED,
          updatedAt: { lte: selectedDate }
        },
        orderBy: { updatedAt: "desc" },
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else {
      return { rdata: null, error: "Invalid status provided." };
    }
    return { rdata: bookings, error: null };
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getVendorBookingSummary = async (vendorId) => {
  try {
    const currentDate = /* @__PURE__ */ new Date();
    const startOfDay2 = new Date(currentDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(currentDate.setHours(23, 59, 59, 999));
    const totalBookings = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        }
      }
    });
    const confirmedBookings = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        },
        status: "CONFIRMED"
      }
    });
    const newBookingsToday = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        },
        createdAt: {
          gte: startOfDay2,
          lte: endOfDay
        }
      }
    });
    const totalCheckIns = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        },
        status: "CHECKED_IN"
      }
    });
    const totalCheckOuts = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        },
        status: "CHECKED_OUT"
      }
    });
    const checkInsToday = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        },
        status: "CHECKED_IN",
        updatedAt: {
          gte: startOfDay2,
          lte: endOfDay
        }
      }
    });
    const checkOutsToday = await db_default.booking.count({
      where: {
        Hotel: {
          vendorId
        },
        status: "CHECKED_OUT",
        updatedAt: {
          gte: startOfDay2,
          lte: endOfDay
        }
      }
    });
    const availableRooms = await db_default.room.count({
      where: {
        hotel: {
          vendorId
        },
        isAvailable: true
      }
    });
    const bookedRooms = await db_default.room.count({
      where: {
        hotel: {
          vendorId
        },
        isAvailable: false
      }
    });
    return {
      bookedRooms,
      allBookings: totalBookings,
      newBookingsToday,
      confirmedBookings,
      checkInsToday,
      checkOutsToday,
      totalCheckIns,
      totalCheckOuts,
      availableRooms
    };
  } catch (error) {
    console.error("Failed to fetch booking summary", error);
    throw new Error("Failed to fetch booking summary");
  }
};
var getVendorBookingChartData = async (vendorId) => {
  try {
    const bookings = await db_default.vendor.findUnique({
      where: {
        id: vendorId
      },
      select: {
        hotels: {
          select: {
            bookings: {
              where: {
                payment: {
                  some: { status: "PAID" }
                }
              },
              select: {
                id: true,
                checkIn: true,
                status: true,
                payment: {
                  select: {
                    amount: true
                  }
                }
              }
            }
          }
        }
      }
    });
    if (!bookings) {
      return {
        weeklyData: null,
        monthlyData: null,
        error: "No bookings found for this vendor."
      };
    }
    const allBookings = bookings.hotels.flatMap((hotel) => hotel.bookings);
    const weeklyData = Array(7).fill(0).map((_, i) => ({
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][i],
      bookings: 0,
      revenue: 0
    }));
    const monthlyData = Array(4).fill(0).map((_, i) => ({
      week: `Week ${i + 1}`,
      bookings: 0,
      revenue: 0
    }));
    const now = /* @__PURE__ */ new Date();
    allBookings.forEach((booking) => {
      const bookingDate = new Date(booking.checkIn);
      const dayOfWeek = bookingDate.getDay();
      const weekOfMonth = Math.floor((bookingDate.getDate() - 1) / 7);
      const bookingAmount = booking.payment.reduce(
        (sum, p) => sum + (p.amount || 0),
        0
      );
      weeklyData[dayOfWeek].bookings += 1;
      weeklyData[dayOfWeek].revenue += bookingAmount;
      if (weekOfMonth >= 0 && weekOfMonth < 4) {
        monthlyData[weekOfMonth].bookings += 1;
        monthlyData[weekOfMonth].revenue += bookingAmount;
      }
    });
    return { weeklyData, monthlyData, error: null };
  } catch (error) {
    console.error("Error fetching vendor bookings:", error);
    return {
      weeklyData: null,
      monthlyData: null,
      error: "Internal Server Error"
    };
  }
};

// modules/vendorModule/Bookings/vendorBookingCotroller.js
var getAllVendorHotelBookigsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getVendorHotelBookings(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during getting booking :", error);
    res.status(500).json({ message: "Something went wrong during booking details" });
  }
};
var getAllVendorHotelRatingsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getAllVendorHotelRatingsService(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching hotel ratings:", error);
    res.status(500).json({ message: "Something went wrong during fetching hotel ratings" });
  }
};
var getNewestBookingController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getNewestBookingService(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching newest booking:", error);
    res.status(500).json({ message: "Something went wrong during fetching newest booking" });
  }
};
var getCheckInOutOfTheDayController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getCheckInOutOfTheDayService(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error(
      "Error during fetching check-in and check-out of the day:",
      error
    );
    res.status(500).json({
      message: "Something went wrong during fetching check-in and check-out of the day"
    });
  }
};
var getAllCheckInOutController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getAllCheckInOutService(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching all check-in and check-out:", error);
    res.status(500).json({
      message: "Something went wrong during fetching all check-in and check-out"
    });
  }
};
var getAllAvailableRoomsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getAllAvailableRoomsService(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching available rooms:", error);
    res.status(500).json({
      message: "Something went wrong during fetching available rooms"
    });
  }
};
var getBookingStatusOfTheDayController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getBookingStatusOfTheDayService(vendorId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching booking status of the day:", error);
    res.status(500).json({
      message: "Something went wrong during fetching booking status of the day"
    });
  }
};
var getTodayCheckInsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search, hotelId, date } = req.query;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getTodayCheckInsService(
      vendorId,
      search,
      hotelId,
      date
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching check-ins of the day:", error);
    res.status(500).json({
      message: "Something went wrong during fetching check-ins of the day"
    });
  }
};
var getTodayCheckOutsController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { search, hotelId, date } = req.query;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, error } = await getTodayCheckOutsService(
      vendorId,
      search,
      hotelId,
      date
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching checkouts of the day:", error);
    res.status(500).json({
      message: "Something went wrong during fetching checkouts of the day"
    });
  }
};
var vendorInventoryController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { filter } = req.query;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { rdata, count, error } = await vendorInventoryService(
      vendorId,
      filter
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ count, details: rdata });
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return res.status(500).json({
      message: "Something went wrong while fetching the inventory"
    });
  }
};
var getBookingByBookingIdController2 = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { rdata, error } = await getBookingByBookingId2(bookingId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during getting booking :", error);
    res.status(500).json({ message: "Something went wrong during booking retrieval" });
  }
};
var getVendorBookingsStatusController = async (req, res) => {
  try {
    const { hotelId, status } = req.params;
    const { date } = req.query;
    if (!hotelId || !status) {
      return res.status(400).json({ message: "fileds  are required" });
    }
    const { rdata, error } = await getVendorBookingsStatus(
      hotelId,
      status,
      date
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching customer bookings:", error);
    res.status(500).json({ message: "Something went wrong during fetching bookings" });
  }
};
var getVendorBookingSummaryController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const summaryData = await getVendorBookingSummary(vendorId);
    if (summaryData) {
      res.status(200).json(summaryData);
    } else {
      res.status(404).json({ message: "No booking summary found" });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch booking summary",
      error: error.message
    });
  }
};
var getVendorBookingChartDataController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) {
      return res.status(400).json({ message: "Vendor ID is required" });
    }
    const { weeklyData, monthlyData, error } = await getVendorBookingChartData(
      vendorId
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ weeklyData, monthlyData });
  } catch (error) {
    console.error("Error during getting booking:", error);
    res.status(500).json({ message: "Something went wrong during booking details" });
  }
};

// routes/vendor/vendorHotelBookingsRoutes.js
import { Router as Router26 } from "express";
var router29 = Router26();
var vendorHotelBookingsRoutes_default = router29.get("/getHotelBookings/:vendorId", getAllVendorHotelBookigsController).get("/getHotelRatings/:vendorId", getAllVendorHotelRatingsController).get("/getHotelNewestBookings/:vendorId", getNewestBookingController).get("/getCheckInCheckoutCurrent/:vendorId", getCheckInOutOfTheDayController).get("/getAllCheckInCheckout/:vendorId", getAllCheckInOutController).get("/getAllAvailableRooms/:vendorId", getAllAvailableRoomsController).get(
  "/getBookingStatusOftheDay/:vendorId",
  getBookingStatusOfTheDayController
).get("/getTodaysCheckIns/:vendorId", getTodayCheckInsController).get("/getTodaysCheckOuts/:vendorId", getTodayCheckOutsController).get("/vendorInventory/:vendorId", vendorInventoryController).get(
  "/getVendorBookingsByStatus/:hotelId/:status",
  getVendorBookingsStatusController
).get("/getVendorBookingById/:bookingId", getBookingByBookingIdController2).get("/getBookingSummary/:vendorId", getVendorBookingSummaryController).get("/getBookingsChartData/:vendorId", getVendorBookingChartDataController);

// routes/vendor/vendorKycRoutes.js
import { Router as Router27 } from "express";

// modules/vendorModule/kyc/vendorKycService.js
var addBankKYC = async (kycData) => {
  console.log(kycData);
  const {
    firstName,
    lastName,
    fatherFirstName,
    fatherLastName,
    maritalStatus,
    gender,
    dateOfBirth,
    nationality,
    email,
    phoneNumber,
    city,
    street,
    street2,
    state,
    postalCode,
    country,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    accountHolderName,
    pancardNumber,
    gstNumber,
    taxResidency,
    aadharNumber,
    passportNumber,
    drivingLicense,
    pancardDocument,
    aadharDocuments,
    gstDocument,
    signature,
    declarationFirstName,
    declarationLastName,
    vendorId
  } = kycData;
  const requiredFields = [
    firstName,
    lastName,
    fatherFirstName,
    fatherLastName,
    maritalStatus,
    gender,
    dateOfBirth,
    nationality,
    email,
    phoneNumber,
    street,
    city,
    state,
    postalCode,
    country,
    bankName,
    branchName,
    accountNumber,
    ifscCode,
    accountHolderName,
    pancardNumber,
    declarationFirstName,
    declarationLastName
  ];
  if (requiredFields.some((field) => !field)) {
    return {
      rdata: null,
      rerror: {
        status: 400,
        message: "All required fields must be provided!"
      }
    };
  }
  const existingKYC = await db_default.bankKYC.findFirst({
    where: {
      OR: [{ email }, { phoneNumber }]
    }
  });
  if (existingKYC) {
    return {
      rdata: null,
      rerror: {
        status: 409,
        message: "KYC entry with this email or phone number already exists!"
      }
    };
  }
  try {
    const newKYC = await db_default.bankKYC.create({
      data: {
        firstName,
        lastName,
        fatherFirstName,
        fatherLastName,
        maritalStatus,
        gender,
        dateOfBirth: new Date(dateOfBirth),
        nationality,
        email,
        phoneNumber,
        addressStreet: street,
        addressStreet2: street2,
        city,
        state,
        postalCode,
        country,
        bankName,
        branchName,
        accountNumber,
        ifscCode,
        accountHolderName,
        pancardNumber,
        gstNumber,
        taxResidency,
        aadharNumber,
        passportNumber,
        drivingLicense,
        pancardDocument,
        aadharDocuments,
        gstDocument,
        signature,
        declarationFirstName,
        declarationLastName,
        vendorId
      }
    });
    return { rdata: newKYC, rerror: null };
  } catch (error) {
    console.error("Error in creating Bank KYC:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getBankKYCById = async (id) => {
  try {
    const kycData = await db_default.bankKYC.findUnique({
      where: { id }
    });
    return { rdata: kycData, rerror: null };
  } catch (error) {
    console.error("Error in retrieving Bank KYC by ID:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var getBankKYCByVendor = async (vendorId) => {
  try {
    const kycData = await db_default.bankKYC.findMany({
      where: { vendorId }
    });
    return { rdata: kycData, rerror: null };
  } catch (error) {
    console.error("Error in retrieving Bank KYC by vendor:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};
var deleteBankKYC = async (id) => {
  try {
    await db_default.bankKYC.delete({
      where: { id }
    });
    return { rdata: null, rerror: null };
  } catch (error) {
    console.error("Error in deleting Bank KYC:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error"
      }
    };
  }
};

// modules/vendorModule/kyc/vendorKycController.js
var addBankKYCController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "firstName",
      "lastName",
      "fatherFirstName",
      "fatherLastName",
      "maritalStatus",
      "gender",
      "dateOfBirth",
      "nationality",
      "email",
      "phoneNumber",
      "city",
      "state",
      "postalCode",
      "country",
      "bankName",
      "branchName",
      "accountNumber",
      "ifscCode",
      "accountHolderName",
      "pancardNumber",
      "declarationFirstName",
      "declarationLastName",
      "vendorId"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const documentUrls = {
      pancardDocument: req.body.fileUrls.find((file) => file.fieldname === "pancardDocument")?.location || null,
      aadharDocuments: req.body.fileUrls.filter((file) => file.fieldname === "aadharDocuments").map((file) => file.location),
      gstDocument: req.body.fileUrls.find((file) => file.fieldname === "gstDocument")?.location || null,
      signature: req.body.fileUrls.find((file) => file.fieldname === "signature")?.location || null
    };
    const kycData = {
      ...data,
      ...documentUrls,
      kycStatus: "PENDING",
      vendorId: req.body.vendorId
    };
    const { rdata, rerror } = await addBankKYC(kycData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating Bank KYC:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getBankKYCByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await getBankKYCById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    if (!rdata) {
      return res.status(404).json({ message: "KYC not found" });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in retrieving Bank KYC by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getBankKYCByVendorController = async (req, res) => {
  try {
    const { vendorId } = req.params;
    const { rdata, rerror } = await getBankKYCByVendor(vendorId);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    if (!rdata.length) {
      return res.status(404).json({ message: "No KYC records found for this vendor" });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in retrieving Bank KYC by vendor:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteBankKYCController = async (req, res) => {
  try {
    const { id } = req.params;
    const { rdata, rerror } = await deleteBankKYC(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(204).json();
  } catch (error) {
    console.error("Error in deleting Bank KYC:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorKycRoutes.js
var router30 = Router27();
var vendorKycRoutes_default = router30.post("/addVendorKyc", uploadFiles, addBankKYCController).get("/getKycByVendor/:vendorId", getBankKYCByVendorController).get("/getKycById/:id", getBankKYCByIdController).delete("/deleteVendorKyc/:id", deleteBankKYCController);

// routes/vendor/vendorNotificationRoutes.js
import { Router as Router28 } from "express";

// modules/vendorModule/notifications/vendorNotificationService.js
var getVendorNotifications = async (vendorId) => {
  try {
    const notifications = await db_default.booking.findMany({
      where: {
        Hotel: {
          vendorId
        }
      },
      include: {
        Hotel: {
          select: {
            name: true
          }
        },
        customer: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: 10
    });
    console.log("notifications:", notifications);
    return { rdata: notifications };
  } catch (error) {
    return { error: error.message };
  }
};
var getNotificationById = async (id) => {
  try {
    const notification = await db_default.booking.findUnique({
      where: {
        id
      },
      include: {
        Hotel: {
          select: {
            name: true
          }
        },
        customer: {
          select: {
            name: true
          }
        }
      }
    });
    return { rdata: notification };
  } catch (error) {
    return { error: error.message };
  }
};

// modules/vendorModule/notifications/vendorNotificationsController.js
var getAllVendorNotificationController = async (req, res) => {
  const { vendorId } = req.params;
  if (!vendorId) {
    return res.status(400).json({ message: "Vendor ID is required" });
  }
  try {
    const { rdata, rerror } = await getVendorNotifications(vendorId);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getAllVendorNotifications:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getNotificationByIdController = async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ message: "Notification ID is required" });
  }
  try {
    const { rdata, rerror } = await getNotificationById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getNotificationById:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/vendor/vendorNotificationRoutes.js
var router31 = Router28();
var vendorNotificationRoutes_default = router31.get("/getAllNotifications/:vendorId", getAllVendorNotificationController).get("/getNotificationByID/:id", getNotificationByIdController);

// routes/vendor/vendorStaffRoutes.js
import { Router as Router29 } from "express";

// modules/vendorModule/VendorStaff/vendorStaffService.js
var getAllStaffByVendorId = async (vendorId, name, phone, email, isActive) => {
  try {
    const staff = await db_default.vendorStaff.findMany({
      where: {
        vendorId,
        name: { contains: name, mode: "insensitive" },
        phone: { contains: phone, mode: "insensitive" },
        email: { contains: email, mode: "insensitive" },
        isActive: isActive === "true" ? true : isActive === "false" ? false : void 0
      },
      orderBy: {
        createdAt: "desc"
      }
    });
    return { rdata: staff };
  } catch (error) {
    console.error("Error in retrieving staff by vendor:", error);
    return { rerror: { status: 500, message: "Something went wrong" } };
  }
};
var assignPermission2 = async (vendorStaffId, permissions) => {
  if (!vendorStaffId || !permissions) {
    return { rerror: { status: 400, message: "Please provide all fields" } };
  }
  try {
    const providedRoutes = [];
    permissions.map(async (route) => {
      const newRoute = await db_default.permitedRoutes.findFirst({
        where: {
          routeName: route.name,
          vendorStaffId
        }
      });
      if (!newRoute) {
        const createdRoute = await db_default.permitedRoutes.create({
          data: {
            routeName: route.name,
            route: route.route,
            vendorStaffId
          }
        });
        providedRoutes.push(createdRoute);
      }
    });
    return { rdata: providedRoutes };
  } catch (error) {
    return { rerror: { status: 500, message: "Something went wrong" } };
  }
};
var toggleActive2 = async (staffId) => {
  if (!staffId === void 0) {
    return { rerror: { status: 400, message: "Please provide all fields" } };
  }
  const getStaff = await db_default.vendorStaff.findUnique({
    where: {
      id: staffId
    }
  });
  try {
    const updatedStaff = await db_default.vendorStaff.update({
      where: {
        id: staffId
      },
      data: {
        isActive: !getStaff.isActive
      }
    });
    return { rdata: updatedStaff };
  } catch (error) {
    console.error("Error in updating staff status:", error);
    return { rerror: { status: 500, message: "Something went wrong" } };
  }
};
var deleteStaff = async (staffId) => {
  if (!staffId) {
    return { rerror: { status: 400, message: "Please provide all fields" } };
  }
  const deletedStaff = await db_default.vendorStaff.delete({
    where: {
      id: staffId
    }
  });
  return { rdata: deletedStaff };
};

// modules/vendorModule/VendorStaff/vendorStaffController.js
var getAllStaffByVendorIdController = async (req, res) => {
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
      return res.status(404).json(rdata, { message: "No staff found" });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
var assignPermissionController2 = async (req, res) => {
  try {
    const { vendorStaffId, permissions } = req.body;
    const { rdata, rerror } = await assignPermission2(
      vendorStaffId,
      permissions
    );
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json({ message: "Permission assigned" });
  } catch (error) {
    console.error("Error in assigning permission:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var toggleActiveController2 = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { rdata, rerror } = await toggleActive2(staffId);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json({ message: "Staff status updated" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteVendorStaffController = async (req, res) => {
  try {
    const { staffId } = req.params;
    const { rdata, rerror } = await deleteStaff(staffId);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json({ message: "Vendor staff deleted", staff: rdata });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vendor staff" });
  }
};

// routes/vendor/vendorStaffRoutes.js
var router32 = Router29();
var vendorStaffRoutes_default = router32.get("/getAllStaffByVendorId/:vendorId", getAllStaffByVendorIdController).put("/assignPermission", assignPermissionController2).patch("/toggleActive/:staffId", toggleActiveController2).delete("/delete/:staffId", deleteVendorStaffController);

// routes/vendor/index.js
var router33 = Router30();
var vendor_default = router33.use("/auth", vendorAuthRoutes_default).use("/staff", vendorStaffRoutes_default).use("/bankKyc", vendorKycRoutes_default).use("/verification", vendorVerificationRoutes_default).use("/profile", vendorRoutes_default2).use("/hotel", vendorHotelRoutes_default).use("/auth/hotel", vendorPaymentRoutes_default).use("/hotel/room", vendorHotelRoomRoutes_default).use("/hotel/hotelAmenities", vendorHotelAmenitiesRoutes_default).use("/hotel/roomAmenities", vendorHotelRoomAmenitiesRoutes_default).use("/hotelBooking", vendorHotelBookingsRoutes_default).use("/notification", vendorNotificationRoutes_default);

// modules/payment/customerPaymentService.js
import crypto5 from "crypto";
import Razorpay3 from "razorpay";

// modules/payment/generatePayment.js
import Razorpay2 from "razorpay";
var razorpay2 = new Razorpay2({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// modules/payment/customerPaymentService.js
var razorpay3 = new Razorpay3({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});
var createCustomerPayment = async ({
  customerId,
  roomSelections,
  startDate,
  endDate,
  payAmount,
  hotelId
}) => {
  console.log("Room Selections:", roomSelections);
  try {
    let roomDetailsArray = [];
    for (const selection of roomSelections) {
      const { roomCategoryId, roomCount, adultCount, categoryName } = selection;
      const roomCategory = await db_default.roomCategory.findUnique({
        where: { id: roomCategoryId },
        select: {
          price: true,
          discount: true,
          perGuestPrice: true,
          adultCount: true
        }
      });
      if (!roomCategory) {
        return {
          rdata: null,
          rerror: {
            status: 404,
            message: `Room category not found for ID ${roomCategoryId}`
          }
        };
      }
      const availableRooms = await db_default.room.findMany({
        where: {
          roomCategoryId,
          isAvailable: true
        },
        take: roomCount
      });
      if (availableRooms.length < roomCount) {
        return {
          rdata: null,
          rerror: {
            status: 400,
            message: `Not enough rooms available for room category ${roomCategoryId}`
          }
        };
      }
      roomDetailsArray.push({
        roomCategoryId,
        roomCount,
        adultCount,
        categoryName
      });
    }
    if (!payAmount) {
      return {
        rdata: null,
        rerror: { status: 400, message: "Invalid total amount" }
      };
    }
    const booking = await db_default.booking.create({
      data: {
        customerId,
        hotelId,
        checkIn: new Date(startDate),
        checkOut: new Date(endDate),
        roomDetails: roomDetailsArray,
        status: "PENDING",
        adultCount: roomSelections.reduce(
          (total, selection) => total + selection.adultCount,
          0
        ),
        roomCount: roomSelections.reduce(
          (total, selection) => total + selection.roomCount,
          0
        )
      }
    });
    const truncatedBookingId = booking.id.slice(0, 20);
    const receiptId = `receipt_${truncatedBookingId}`;
    const razorpayOrder = await razorpay3.orders.create({
      amount: parseInt(payAmount * 100),
      // converting to paise
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1
    });
    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      bookingId: booking.id
    };
    return {
      rdata: data,
      rerror: null
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var verifyPayment = async ({
  orderId,
  paymentId,
  signature,
  bookingId,
  amount,
  discountAmount,
  gstAmount
}) => {
  try {
    const hmac = crypto5.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== signature) {
      await db_default.booking.update({
        where: { id: bookingId },
        data: { status: "FAILED" }
      });
      await db_default.payment.create({
        data: {
          amount: parseFloat(amount) / 100,
          method: "Razorpay",
          bookingId,
          discountAmount,
          gstAmount,
          status: "FAILED"
        }
      });
      return {
        rdata: null,
        rerror: { status: 400, message: "Invalid payment signature" }
      };
    }
    const bookingDetails = await db_default.booking.findUnique({
      where: { id: bookingId }
    });
    if (!bookingDetails) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Booking not found" }
      };
    }
    for (const room of bookingDetails.roomDetails) {
      const availableRooms = await db_default.room.findMany({
        where: {
          roomCategoryId: room.roomCategoryId,
          isAvailable: true
        },
        take: room.roomCount
      });
      if (availableRooms.length < room.roomCount) {
        await db_default.booking.update({
          where: { id: bookingId },
          data: { status: "FAILED" }
        });
        return {
          rdata: null,
          rerror: {
            status: 400,
            message: "Not enough rooms available for room category " + room.roomCategoryId
          }
        };
      }
      const roomIds = availableRooms.map((room2) => room2.id);
      await db_default.room.updateMany({
        where: { id: { in: roomIds } },
        data: { isAvailable: false }
      });
    }
    const updatedBooking = await db_default.booking.update({
      where: { id: bookingId },
      data: {
        status: "CONFIRMED"
      }
    });
    const amountInRupees = parseFloat(amount) / 100;
    const payment = await db_default.payment.create({
      data: {
        amount: amountInRupees,
        method: "Razorpay",
        bookingId,
        discountAmount,
        gstAmount,
        paid_amount: amountInRupees,
        due_amount: 0,
        status: "PAID"
        // Payment successful
      }
    });
    if (payment) {
      await db_default.cartItem.deleteMany({
        where: {
          customerId: updatedBooking.customerId
        }
      });
    }
    const UpdatedBookingDetails = await db_default.booking.findUnique({
      where: { id: bookingId }
    });
    const roomSelections = UpdatedBookingDetails.roomDetails;
    const totalAdults = roomSelections.reduce(
      (sum, room) => sum + room.adultCount,
      0
    );
    const categoryNames = roomSelections.map((room) => room.categoryName).join(", ");
    const totalRooms = roomSelections.reduce(
      (sum, room) => sum + room.roomCount,
      0
    );
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", weekday: "short" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    };
    const checkInDate = formatDate(UpdatedBookingDetails.checkIn);
    const checkOutDate = formatDate(UpdatedBookingDetails.checkOut);
    const paymentDetails = await db_default.payment.findFirst({
      where: { bookingId }
    });
    const hotelDetails = await db_default.hotel.findUnique({
      where: { id: UpdatedBookingDetails.hotelId }
    });
    const customerDetails = await db_default.customer.findUnique({
      where: {
        id: UpdatedBookingDetails.customerId
      }
    });
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
      font-family: Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
    }
    .header {
      background-color: #f86800;
      color: white;
      padding: 10px;
      text-align: left;
    }
    .container {
      padding: 20px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      padding: 20px;
    }
    .text-center {
      text-align: center;
    }
    .button {
      background-color: #f86800;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 10px;
    }
    .button:hover {
      background-color: #f86800;
    }
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .image {
      width: 100%;
      border-radius: 8px;
      max-height: 200px;
      object-fit: cover;
    }
    .text-gray {
      color: #6b7280;
    }
    .text-green {
      color: #10b981;
    }
    .text-red {
      color: #ef4444;
    }
    .text-blue {
      color: #3b82f6;
    }
    .pricing-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      gap:2;
    }
    .pricing-total {
      font-weight: bold;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }
      </style>
    </head>
    <body>
  <div class="header">
    <span>Vaysta Hotels</span>
  </div>
  <div class="container">
    <!-- Confirmation Section -->
    <div class="card text-center">
      <img src="https://res.cloudinary.com/sangamjone/image/upload/v1731863578/Img/wirewings/AoneHotel/check_bdadgv.png" alt="Check Icon" width="64" />

      <p><strong>Congratulations ${customerDetails.name}</strong></p>
      <p>Your booking is confirmed</p>
      <div class="text-green">Booking ID:${bookingId}</div>
    </div>

    <!-- Hotel Details -->
    <div class="card">
      <div class="flex">
        <div>
          <h4>${hotelDetails.name}</h4>
          <p class="text-gray">${hotelDetails.location}</p>
        </div>
      </div>
      <img src=${hotelDetails.bannerImage} alt="Hotel Room" class="image" />
    </div>

    <!-- Booking Details -->
    <div class="card">
      <h3>Booking Details</h3>
      <div class="flex">
        <div>
          <p class="text-gray">CHECK IN</p>
          <p><strong>${checkInDate} | </strong></p>
        </div>
        <div>
          <p class="text-gray">CHECK OUT</p>
          <p> <strong> ${checkOutDate}</strong></p>
        </div>
      </div>
      <p class="text-gray">INCLUDES </p>
      <p>${totalRooms} , ${categoryNames}</p>
      <p>Total Guest ${totalAdults}</p>
    </div>

    <!-- Pricing Details -->
    <div class="card">
      <h3>Pricing Details</h3>
      <div class="pricing-row">
        <span>Booking Price : </span>
        <span> \u20B9 ${parseInt(paymentDetails.amount) + parseInt(paymentDetails.discountAmount) - parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row text-green">
        <span>Discount : </span>
        <span> - \u20B9 ${parseInt(paymentDetails.discountAmount)}</span>
      </div>
      <div class="pricing-row">
        <span>Discounted Price : </span>
        <span>  \u20B9 ${parseInt(paymentDetails.amount) - parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row">
        <span>GST : </span>
        <span>  \u20B9 ${parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row pricing-total">
        <span> AMOUNT  PAID  : </span>
        <span>  \u20B9 ${parseInt(paymentDetails.paid_amount)}</span>
      </div>
    </div>
  </div>
</body>
    </html>
  `;
    const emailOptions = {
      email: customerDetails.email,
      subject: `Booking Confirmation`,
      message: emailContent
    };
    await verifyEmail_default(emailOptions);
    return {
      rdata: { booking: updatedBooking, payment },
      rerror: null
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    await db_default.booking.update({
      where: { id: bookingId },
      data: { status: "FAILED" }
    });
    await db_default.payment.create({
      data: {
        amount: parseFloat(amount) / 100,
        method: "Razorpay",
        bookingId,
        discountAmount,
        gstAmount,
        status: "FAILED"
      }
    });
    return {
      rdata: null,
      rerror: { status: 500, message: "Error verifying payment" }
    };
  }
};
var retryPayment = async (bookingId) => {
  try {
    const booking = await db_default.booking.findUnique({
      where: { id: bookingId },
      include: {
        roomCategory: true
      }
    });
    if (!booking || booking.status !== "FAILED") {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Booking not found or cannot be retried"
        }
      };
    }
    const totalGuests = parseInt(booking.adultCount);
    let extraGuestCharges = 0;
    if (totalGuests > 1 && booking.roomCategory.perGuestPrice) {
      const extraGuests = totalGuests - 1;
      extraGuestCharges = parseFloat(booking.roomCategory.perGuestPrice) * extraGuests;
    }
    const finalAmount = parseFloat(booking.roomCategory.price) + extraGuestCharges;
    const truncatedBookingId = booking.id.slice(0, 20);
    const receiptId = `retry_receipt_${truncatedBookingId}`;
    const razorpayOrder = await razorpay3.orders.create({
      amount: parseFloat(finalAmount) * 100,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1
    });
    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      bookingId: booking.id
    };
    return {
      rdata: data,
      rerror: null
    };
  } catch (error) {
    console.error("Error retrying payment:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Error retrying payment" }
    };
  }
};
var checkIn = async (bookingId) => {
  try {
    const isBooking = await db_default.booking.findUnique({
      where: {
        id: bookingId
      }
    });
    if (!isBooking) {
      return { rdata: null, error: "Booking not found" };
    }
    const booking = await db_default.booking.update({
      where: { id: bookingId },
      data: {
        status: "CHECKED_IN",
        checkIn: /* @__PURE__ */ new Date()
      }
    });
    return { rdata: booking, error: null };
  } catch (error) {
    console.error("Error during check-in:", error);
    return { rdata: null, error: "Error during check-in" };
  }
};
var checkOut = async (bookingId) => {
  try {
    const isBooking = await db_default.booking.findUnique({
      where: {
        id: bookingId
      }
    });
    if (!isBooking) {
      return { rdata: null, error: "Booking not found" };
    }
    const booking = await db_default.booking.update({
      where: { id: bookingId },
      data: {
        status: "CHECKED_OUT",
        checkOut: /* @__PURE__ */ new Date()
      }
    });
    const roomCategoryIds = isBooking.roomDetails.map(
      (room) => room.roomCategoryId
    );
    await db_default.room.updateMany({
      where: {
        roomCategoryId: { in: roomCategoryIds },
        isAvailable: false
      },
      data: {
        isAvailable: true
      }
    });
    return { rdata: booking, error: null };
  } catch (error) {
    console.error("Error during check-out:", error);
    return { rdata: null, error: "Error during check-out" };
  }
};
var cancelBooking = async (bookingId, reason) => {
  try {
    const existBooking = await db_default.booking.findFirst({
      where: { id: bookingId }
    });
    console.log(existBooking);
    if (!existBooking) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Booking not found" }
      };
    }
    const booking = await db_default.booking.update({
      where: { id: bookingId },
      data: {
        status: "CANCELED",
        cancelReason: reason
      }
    });
    const roomCategoryIds = existBooking.roomDetails.map(
      (room) => room.roomCategoryId
    );
    await db_default.room.updateMany({
      where: {
        roomCategoryId: { in: roomCategoryIds },
        isAvailable: false
      },
      data: {
        isAvailable: true
      }
    });
    return { rdata: booking, error: null };
  } catch (error) {
    console.error("Error during booking cancellation:", error);
    return { rdata: null, error: "Error during booking cancellation" };
  }
};
var createCustomerBookingAtHotel = async ({
  customerId,
  roomSelections,
  startDate,
  endDate,
  totalAmount,
  payAmount,
  amountWithGst,
  totalDiscount,
  hotelId
}) => {
  try {
    if (!payAmount || !customerId || !hotelId) {
      return {
        rdata: null,
        rerror: { status: 400, message: "Invalid input parameters" }
      };
    }
    let roomDetailsArray = [];
    for (const selection of roomSelections) {
      const { roomCategoryId, roomCount, adultCount, categoryName } = selection;
      const roomCategory = await db_default.roomCategory.findUnique({
        where: { id: roomCategoryId },
        select: {
          price: true,
          discount: true,
          perGuestPrice: true,
          adultCount: true
        }
      });
      if (!roomCategory) {
        return {
          rdata: null,
          rerror: {
            status: 404,
            message: `Room category not found for ID ${roomCategoryId}`
          }
        };
      }
      const availableRooms = await db_default.room.findMany({
        where: { roomCategoryId, isAvailable: true },
        take: roomCount
      });
      if (availableRooms.length < roomCount) {
        return {
          rdata: null,
          rerror: {
            status: 400,
            message: `Not enough rooms available for room category ${roomCategoryId}`
          }
        };
      }
      roomDetailsArray.push({
        roomCategoryId,
        roomCount,
        adultCount,
        categoryName
      });
    }
    const booking = await db_default.booking.create({
      data: {
        customerId,
        hotelId,
        checkIn: new Date(startDate),
        checkOut: new Date(endDate),
        roomDetails: roomDetailsArray,
        status: "PENDING",
        adultCount: roomSelections.reduce(
          (total, selection) => total + selection.adultCount,
          0
        ),
        roomCount: roomSelections.reduce(
          (total, selection) => total + selection.roomCount,
          0
        )
      }
    });
    console.log("Booking:", booking);
    if (!booking) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Booking creation failed" }
      };
    }
    for (const room of booking.roomDetails) {
      const availableRooms = await db_default.room.findMany({
        where: { roomCategoryId: room.roomCategoryId, isAvailable: true },
        take: room.roomCount
      });
      if (availableRooms.length < room.roomCount) {
        await db_default.booking.update({
          where: { id: booking.id },
          data: { status: "FAILED" }
        });
        return {
          rdata: null,
          rerror: {
            status: 400,
            message: `Not enough rooms available for room category ${room.roomCategoryId}`
          }
        };
      }
      const roomIds = availableRooms.map((room2) => room2.id);
      await db_default.room.updateMany({
        where: { id: { in: roomIds } },
        data: { isAvailable: false }
      });
    }
    const updatedBooking = await db_default.booking.update({
      where: { id: booking.id },
      data: { status: "CONFIRMED" }
    });
    const payment = await db_default.payment.create({
      data: {
        amount: parseFloat(totalAmount),
        method: "Razorpay",
        paid_amount: 0,
        due_amount: parseFloat(payAmount),
        bookingId: updatedBooking.id,
        discountAmount: parseFloat(totalDiscount),
        gstAmount: parseFloat(amountWithGst),
        status: "PENDING"
      }
    });
    if (payment) {
      await db_default.cartItem.deleteMany({
        where: { customerId: updatedBooking.customerId }
      });
    }
    const UpdatedBookingDetails = await db_default.booking.findUnique({
      where: { id: updatedBooking.id }
    });
    const totalAdults = roomSelections.reduce(
      (sum, room) => sum + room.adultCount,
      0
    );
    const categoryNames = roomSelections.map((room) => room.categoryName).join(", ");
    const totalRooms = roomSelections.reduce(
      (sum, room) => sum + room.roomCount,
      0
    );
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const options = { day: "2-digit", month: "short", weekday: "short" };
      return new Intl.DateTimeFormat("en-US", options).format(date);
    };
    const checkInDate = formatDate(UpdatedBookingDetails.checkIn);
    const checkOutDate = formatDate(UpdatedBookingDetails.checkOut);
    const paymentDetails = await db_default.payment.findFirst({
      where: { bookingId: updatedBooking.id }
    });
    const hotelDetails = await db_default.hotel.findUnique({
      where: { id: UpdatedBookingDetails.hotelId }
    });
    const customerDetails = await db_default.customer.findUnique({
      where: {
        id: UpdatedBookingDetails.customerId
      }
    });
    const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Booking Confirmation</title>
      <style>
        body {
      font-family: Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      width:40%;
    }
    .header {
      background-color: #f86800;
      color: white;
      padding: 10px;
      text-align: left;
    }
    .container {
      padding: 20px;
    }
    .card {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
      padding: 20px;
    }
    .text-center {
      text-align: center;
    }
    .button {
      background-color: #f86800;
      color: white;
      padding: 10px 20px;
      text-decoration: none;
      border-radius: 5px;
      display: inline-block;
      margin-top: 10px;
    }
    .button:hover {
      background-color: #f86800;
    }
    .flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .image {
      width: 100%;
      border-radius: 8px;
      max-height: 200px;
      object-fit: cover;
    }
    .text-gray {
      color: #6b7280;
    }
    .text-green {
      color: #10b981;
    }
    .text-red {
      color: #ef4444;
    }
    .text-blue {
      color: #3b82f6;
    }
    .pricing-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      gap:2;
    }
    .pricing-total {
      font-weight: bold;
      border-top: 1px solid #e5e7eb;
      padding-top: 10px;
    }
      </style>
    </head>
<body>
  <div class="header">
    <span>Vaysta Hotels</span>
  </div>
  <div class="container">
    <!-- Confirmation Section -->
    <div class="card text-center">
      <img src="https://res.cloudinary.com/sangamjone/image/upload/v1731863578/Img/wirewings/AoneHotel/check_bdadgv.png" alt="Check Icon" width="64" />

      <p><strong>Congratulations ${customerDetails.name}</strong></p>
      <p>Your booking is confirmed</p>
      <div class="text-green">Booking ID:${updatedBooking.id}</div>
    </div>

    <!-- Hotel Details -->
    <div class="card">
      <div class="flex">
        <div>
          <h4>${hotelDetails.name}</h4>
          <p class="text-gray">${hotelDetails.location}</p>
        </div>
      </div>
      <img src=${hotelDetails.bannerImage} alt="Hotel Room" class="image" />
    </div>

    <!-- Booking Details -->
    <div class="card">
      <h3>Booking Details</h3>
      <div class="flex">
        <div>
          <p class="text-gray">CHECK IN</p>
          <p><strong>${checkInDate} | </strong></p>
        </div>
        <div>
          <p class="text-gray">CHECK OUT</p>
          <p> <strong> ${checkOutDate}</strong></p>
        </div>
      </div>
      <p class="text-gray">INCLUDES </p>
      <p>${totalRooms} , ${categoryNames}</p>
      <p>Total Guest ${totalAdults}</p>
    </div>

    <!-- Pricing Details -->
    <div class="card">
      <h3>Pricing Details</h3>
      <div class="pricing-row">
        <span>Booking Price : </span>
        <span> \u20B9 ${parseInt(paymentDetails.due_amount) + parseInt(paymentDetails.discountAmount) - parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row text-green">
        <span>Discount : </span>
        <span> - \u20B9 ${parseInt(paymentDetails.discountAmount)}</span>
      </div>
      <div class="pricing-row">
        <span>Discounted Price : </span>
        <span>  \u20B9 ${parseInt(paymentDetails.due_amount) - parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row">
        <span>GST : </span>
        <span>  \u20B9 ${parseInt(paymentDetails.gstAmount)}</span>
      </div>
      <div class="pricing-row pricing-total">
        <span> AMOUNT TO BE PAID  : </span>
        <span>  \u20B9 ${parseInt(paymentDetails.due_amount)}</span>
      </div>
    </div>
  </div>
</body>
    </html>
  `;
    const emailOptions = {
      email: customerDetails.email,
      subject: `Booking Confirmation`,
      message: emailContent
    };
    await verifyEmail_default(emailOptions);
    return {
      rdata: { booking: updatedBooking, payment },
      rerror: null
    };
  } catch (error) {
    console.error("Error creating booking:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var createPaymentAtHotel = async ({ bookingId, dueAmount }) => {
  try {
    if (!dueAmount || dueAmount <= 0) {
      throw new Error("Invalid due amount.");
    }
    const truncatedBookingId = bookingId.slice(0, 20);
    const receiptId = `receipt_${truncatedBookingId}`;
    const razorpayOrder = await razorpay3.orders.create({
      amount: dueAmount * 100,
      currency: "INR",
      receipt: receiptId,
      payment_capture: 1
    });
    const data = {
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      bookingId
    };
    return {
      rdata: data,
      rerror: null
    };
  } catch (error) {
    console.error("Error creating payment:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var verifyDuePayment = async ({
  orderId,
  paymentId,
  signature,
  bookingId,
  amount
}) => {
  try {
    const paymentRecord2 = await db_default.payment.findFirst({
      where: { bookingId }
    });
    if (!paymentRecord2) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Payment record not found" }
      };
    }
    const bookingDetails = await db_default.booking.findUnique({
      where: { id: bookingId }
    });
    if (!bookingDetails) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Booking not found" }
      };
    }
    const hmac = crypto5.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
    hmac.update(orderId + "|" + paymentId);
    const generatedSignature = hmac.digest("hex");
    if (generatedSignature !== signature) {
      await db_default.payment.update({
        where: { id: paymentRecord2.id },
        data: {
          status: "FAILED"
        }
      });
      return {
        rdata: null,
        rerror: { status: 400, message: "Invalid payment signature" }
      };
    }
    const amountInRupees = parseFloat(amount) / 100;
    const payment = await db_default.payment.update({
      where: { id: paymentRecord2.id },
      data: {
        paid_amount: amountInRupees,
        due_amount: 0,
        method: "Razorpay",
        status: "PAID"
      }
    });
    return {
      rdata: { payment },
      rerror: null
    };
  } catch (error) {
    console.error("Error verifying payment:", error);
    await db_default.payment.update({
      where: { id: paymentRecord.id },
      data: {
        status: "FAILED"
      }
    });
    return {
      rdata: null,
      rerror: { status: 500, message: "Error verifying payment" }
    };
  }
};

// modules/booking/bookingService.js
var createGuest = async ({
  name,
  email,
  phone,
  gstNumber,
  companyName,
  address,
  country,
  customerId
}) => {
  console.log("createGuest:", name, phone);
  try {
    if (!name || !phone) {
      return {
        rdata: null,
        rerror: { status: 400, message: "Name and phone are required" }
      };
    }
    const guestData = {
      name,
      email,
      phone,
      gstNumber,
      companyName,
      address,
      country
    };
    if (customerId) {
      const customerExists = await db_default.customer.findUnique({
        where: { id: customerId }
      });
      if (!customerExists) {
        return {
          rdata: null,
          rerror: { status: 404, message: "Customer not found" }
        };
      }
      guestData.customerId = customerId;
    }
    const guest = await db_default.guest.create({
      data: guestData
    });
    return { rdata: guest, rerror: null };
  } catch (error) {
    console.error("Error in createGuest:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getAllGuests = async () => {
  try {
    const guests = await db_default.guest.findMany({});
    return { rdata: guests, rerror: null };
  } catch (error) {
    console.error("Error in getAllGuests:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var getGuestById = async (id) => {
  try {
    const guest = await db_default.guest.findUnique({
      where: { id }
    });
    if (!guest) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Guest not found" }
      };
    }
    return { rdata: guest, rerror: null };
  } catch (error) {
    console.error("Error in getGuestById:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var updateGuest = async (id, { name, email, phone, gstNumber, companyName, address, country, customerId }) => {
  try {
    const guest = await db_default.guest.findUnique({ where: { id } });
    if (!guest) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Guest not found" }
      };
    }
    const updateData = {
      name,
      email,
      phone,
      gstNumber,
      companyName,
      address,
      country
    };
    if (customerId) {
      const customerExists = await db_default.customer.findUnique({
        where: { id: customerId }
      });
      if (!customerExists) {
        return {
          rdata: null,
          rerror: { status: 404, message: "Customer not found" }
        };
      }
      updateData.customerId = customerId;
    }
    const updatedGuest = await db_default.guest.update({
      where: { id },
      data: updateData
    });
    return { rdata: updatedGuest, rerror: null };
  } catch (error) {
    console.error("Error in updateGuest:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};
var deleteGuest = async (id) => {
  try {
    const guest = await db_default.guest.findUnique({ where: { id } });
    if (!guest) {
      return {
        rdata: null,
        rerror: { status: 404, message: "Guest not found" }
      };
    }
    await db_default.guest.delete({
      where: { id }
    });
    return { rdata: { message: "Guest deleted successfully" }, rerror: null };
  } catch (error) {
    console.error("Error in deleteGuest:", error);
    return {
      rdata: null,
      rerror: { status: 500, message: "Internal server error" }
    };
  }
};

// modules/customerModule/Booking/customerBookingService.js
import { BookingStatus as BookingStatus3 } from "@prisma/client";
var getCustomerBookings = async (customerId) => {
  try {
    const bookings = await db_default.booking.findMany({
      where: { customerId },
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            country: true,
            zipcode: true,
            landmark: true,
            location: true,
            description: true,
            avgPrice: true,
            bannerImage: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true
          }
        }
      }
    });
    if (bookings.length === 0) {
      return { rdata: null, error: "No bookings found for this customer." };
    }
    return { rdata: bookings, error: null };
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getBookingByBookingId3 = async (bookingId) => {
  try {
    const booking = await db_default.booking.findUnique({
      where: { id: bookingId },
      include: {
        payment: true,
        Hotel: {
          select: {
            id: true,
            name: true,
            location: true,
            city: true,
            state: true,
            country: true,
            zipcode: true,
            landmark: true,
            location: true,
            description: true,
            avgPrice: true,
            bannerImage: true,
            website: true,
            email: true,
            phone: true
          }
        },
        customer: {
          select: {
            name: true,
            email: true,
            dob: true,
            profileImage: true,
            gender: true,
            phone: true
          }
        }
      }
    });
    if (!booking) {
      return { rdata: null, error: "No booking found for this ID." };
    }
    return { rdata: booking, error: null };
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};
var getCustomerBookingsStatus = async (customerId, status) => {
  try {
    const currentDate = /* @__PURE__ */ new Date();
    console.log("currentDate", currentDate);
    console.log("status", status);
    let bookings;
    if (status === "ongoing") {
      bookings = await db_default.booking.findMany({
        where: {
          customerId,
          status: { in: [BookingStatus3.CONFIRMED, BookingStatus3.CHECKED_IN] }
          // Ongoing statuses
        },
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else if (status === "upcoming") {
      bookings = await db_default.booking.findMany({
        where: {
          customerId,
          checkIn: { gt: currentDate },
          status: { in: [BookingStatus3.CONFIRMED, BookingStatus3.PENDING] }
          // Upcoming statuses
        },
        orderBy: { checkIn: "asc" },
        // Sort by upcoming check-ins
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else if (status === "past") {
      bookings = await db_default.booking.findMany({
        where: {
          customerId,
          checkOut: { lt: currentDate },
          status: BookingStatus3.CHECKED_OUT
          // Past booking status
        },
        orderBy: { checkOut: "desc" },
        // Sort by recent check-outs
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else if (status === "canceled") {
      bookings = await db_default.booking.findMany({
        where: {
          customerId,
          status: BookingStatus3.CANCELED
          // Canceled booking status
        },
        orderBy: { updatedAt: "desc" },
        // Sort by most recent cancellations
        include: {
          payment: true,
          Hotel: {
            select: {
              id: true,
              name: true,
              location: true,
              city: true,
              state: true,
              country: true,
              zipcode: true,
              landmark: true,
              description: true,
              avgPrice: true,
              bannerImage: true
            }
          },
          customer: {
            select: {
              name: true,
              email: true,
              dob: true,
              profileImage: true,
              gender: true,
              phone: true
            }
          }
        }
      });
    } else {
      return { rdata: null, error: "Invalid status provided." };
    }
    return { rdata: bookings, error: null };
  } catch (error) {
    console.error("Error fetching customer bookings:", error);
    return { rdata: null, error: "Internal Server Error" };
  }
};

// modules/customerModule/Booking/customeBookingController.js
var customerPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "customerId",
      "startDate",
      "endDate",
      "payAmount",
      "hotelId"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createCustomerPayment(data);
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error during customer payment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var customerPaymentVerificationController = async (req, res) => {
  console.log(req.body);
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "orderId",
      "paymentId",
      "signature",
      "bookingId",
      "amount"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    console.log(data);
    const { rdata, rerror } = await verifyPayment(data);
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during customer payment verification:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var retryPaymentController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "bookingId",
      "amount"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await retryPayment(data);
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during payment retry:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var customerCheckInController = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { rdata, error } = await checkIn(bookingId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during check-in:", error);
    res.status(500).json({ message: "Something went wrong during check-in" });
  }
};
var customerCheckOutController = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { rdata, error } = await checkOut(bookingId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during check-out:", error);
    res.status(500).json({ message: "Something went wrong during check-out" });
  }
};
var customerCancelBookingController = async (req, res) => {
  try {
    const { bookingId, reason } = req.body;
    if (!bookingId || !reason) {
      return res.status(400).json({ message: "Booking ID and Reason is required" });
    }
    const { rdata, error } = await cancelBooking(bookingId, reason);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during booking cancellation:", error);
    res.status(500).json({ message: "Something went wrong during cancellation" });
  }
};
var getBookingByBookingIdController3 = async (req, res) => {
  try {
    const { bookingId } = req.params;
    if (!bookingId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { rdata, error } = await getBookingByBookingId3(bookingId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during getting booking :", error);
    res.status(500).json({ message: "Something went wrong during booking retrieval" });
  }
};
var getCustomerBookingsStatusController = async (req, res) => {
  try {
    const { customerId, status } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    const { rdata, error } = await getCustomerBookingsStatus(
      customerId,
      status
    );
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during fetching customer bookings:", error);
    res.status(500).json({ message: "Something went wrong during fetching bookings" });
  }
};
var getAllCustomerBookigsController = async (req, res) => {
  try {
    const { customerId } = req.body;
    if (!customerId) {
      return res.status(400).json({ message: "Booking ID is required" });
    }
    const { rdata, error } = await getCustomerBookings(customerId);
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error during getting booking :", error);
    res.status(500).json({ message: "Something went wrong during booking details" });
  }
};
var createAtHotelBookingController = async (req, res) => {
  try {
    const { data, error } = checkRequiredFields(req.body, [
      "customerId",
      "startDate",
      "endDate",
      "hotelId",
      "payAmount"
    ]);
    if (error) {
      return res.status(400).json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await createCustomerBookingAtHotel(data);
    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error during customer payment:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var createPaymentAtHotelController = async (req, res) => {
  const { dueAmount, bookingId } = req.body;
  const { rdata, rerror } = await createPaymentAtHotel({
    dueAmount,
    bookingId
  });
  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  res.status(200).json(rdata);
};
var verifyDuePaymentController = async (req, res) => {
  const { orderId, paymentId, signature, bookingId, amount } = req.body;
  const { rdata, rerror } = await verifyDuePayment({
    orderId,
    paymentId,
    signature,
    bookingId,
    amount
  });
  if (rerror) {
    return res.status(rerror.status).json({ message: rerror.message });
  }
  res.status(200).json(rdata);
};
var addNewGuestController = async (req, res) => {
  try {
    const guestData = { ...req.body };
    const { rdata, rerror } = await createGuest(guestData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(201).json(rdata);
  } catch (error) {
    console.error("Error in creating guest:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllGuestsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllGuests();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting all guests:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getGuestByIdController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getGuestById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting guest by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var updateGuestController = async (req, res) => {
  const { id } = req.params;
  const guestData = { ...req.body };
  try {
    const { rdata, rerror } = await updateGuest(id, guestData);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in updating guest:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var deleteGuestController = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await deleteGuest(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in deleting guest:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// modules/booking/BookingCartService.js
var addToCart = async ({
  customerId,
  hotelId,
  roomCategoryId,
  roomCount,
  adultCount,
  startDate,
  endDate
}) => {
  try {
    const calculateNights = (startDate2, endDate2) => {
      const start = new Date(startDate2);
      const end = new Date(endDate2);
      const diffTime = Math.abs(end - start);
      const nights2 = Math.ceil(diffTime / (1e3 * 60 * 60 * 24));
      return nights2;
    };
    let existingCart = await db_default.cartItem.findFirst({
      where: { customerId },
      include: { roomSelections: true }
    });
    if (existingCart && existingCart.hotelId !== hotelId) {
      await db_default.cartItem.deleteMany({
        where: { customerId }
      });
      existingCart = null;
    }
    const nights = calculateNights(startDate, endDate);
    let cart;
    if (!existingCart) {
      cart = await db_default.cartItem.create({
        data: {
          customerId,
          hotelId,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          nights,
          totalAmount: 0,
          totalDiscount: 0,
          payAmount: 0,
          amountWithGst: 0
        }
      });
    } else {
      cart = await db_default.cartItem.update({
        where: { id: existingCart.id },
        data: {
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          nights
        }
      });
    }
    const roomCategory = await db_default.roomCategory.findUnique({
      where: { id: roomCategoryId },
      include: { rooms: true }
    });
    if (!roomCategory) {
      return {
        rdata: null,
        rerror: { status: 401, message: "Invalid room category." }
      };
    }
    if (roomCategory.hotelId !== hotelId) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Room category does not belong to the selected hotel."
        }
      };
    }
    const availableRooms = roomCategory.rooms.filter(
      (room) => room.isAvailable
    ).length;
    if (roomCount > availableRooms) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Only ${availableRooms} rooms available in this category.`
        }
      };
    }
    if (adultCount < roomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `At least one adult is required per room. Please increase the number of adults.`
        }
      };
    }
    if (adultCount > parseInt(roomCategory.adultCount) * roomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Maximum ${roomCategory.adultCount} adults allowed per room.`
        }
      };
    }
    const existingRoomSelection = await db_default.roomSelection.findFirst({
      where: { cartItemId: cart.id, roomCategoryId }
    });
    if (existingRoomSelection) {
      await db_default.roomSelection.update({
        where: { id: existingRoomSelection.id },
        data: {
          roomCount,
          adultCount
        }
      });
    } else {
      await db_default.roomSelection.create({
        data: {
          cartItemId: cart.id,
          roomCategoryId,
          roomCount,
          adultCount,
          categoryName: roomCategory.category
        }
      });
    }
    const updatedCart = await calculateCartAmounts(cart.id);
    return { rdata: updatedCart, rerror: null };
  } catch (error) {
    console.error("Error adding to cart:", error);
    return { data: null, error: "Internal server error" };
  }
};
var decreaseRoomAndAdultCount = async ({
  customerId,
  hotelId,
  roomCategoryId,
  roomCountToRemove,
  adultCountToRemove
}) => {
  try {
    const cart = await db_default.cartItem.findFirst({
      where: { customerId, hotelId },
      include: { roomSelections: true }
    });
    if (!cart) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No cart found for this customer and hotel."
        }
      };
    }
    const existingRoomSelection = await db_default.roomSelection.findFirst({
      where: { cartItemId: cart.id, roomCategoryId }
    });
    if (!existingRoomSelection) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No room selection found for this category in the cart."
        }
      };
    }
    const roomCategory = await db_default.roomCategory.findUnique({
      where: { id: roomCategoryId }
    });
    if (!roomCategory) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Room category not found."
        }
      };
    }
    const newRoomCount = existingRoomSelection.roomCount - roomCountToRemove;
    const newAdultCount = existingRoomSelection.adultCount - adultCountToRemove;
    const maxAdultsInNewRoomCount = roomCategory.adultCount * newRoomCount;
    if (newAdultCount < newRoomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Each room requires at least one adult."
        }
      };
    }
    if (newAdultCount > maxAdultsInNewRoomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Cannot decrease the room count. The current number of adults (${existingRoomSelection.adultCount}) will not fit in ${newRoomCount} rooms.`
        }
      };
    }
    if (newAdultCount < 1) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "At least one adult is required. You cannot have zero adults."
        }
      };
    }
    if (newRoomCount <= 0) {
      await db_default.roomSelection.delete({
        where: { id: existingRoomSelection.id }
      });
    } else {
      await db_default.roomSelection.update({
        where: { id: existingRoomSelection.id },
        data: {
          roomCount: newRoomCount,
          adultCount: newAdultCount
        }
      });
    }
    const remainingRoomSelections = await db_default.roomSelection.findMany({
      where: { cartItemId: cart.id }
    });
    if (remainingRoomSelections.length === 0) {
      await db_default.cartItem.delete({
        where: { id: cart.id }
      });
      return {
        rdata: remainingRoomSelections,
        rerror: null,
        message: "Cart is empty and has been deleted."
      };
    }
    const updatedCart = await calculateCartAmounts(cart.id);
    return { rdata: updatedCart, rerror: null };
  } catch (error) {
    console.error("Error decreasing room and adult count:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error."
      }
    };
  }
};
var IncreaseRoomAndAdultCount = async ({
  customerId,
  hotelId,
  roomCategoryId,
  roomCountToAdd,
  adultCountToAdd
}) => {
  try {
    const roomCategory = await db_default.roomCategory.findUnique({
      where: { id: roomCategoryId },
      include: { rooms: true }
    });
    if (!roomCategory) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Room category not found."
        }
      };
    }
    const availableRooms = roomCategory.rooms.filter(
      (room) => room.isAvailable
    ).length;
    console.log("Available rooms:", availableRooms);
    const cart = await db_default.cartItem.findFirst({
      where: { customerId, hotelId },
      include: { roomSelections: true }
    });
    if (!cart) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No cart found for this customer and hotel."
        }
      };
    }
    const existingRoomSelection = await db_default.roomSelection.findFirst({
      where: { cartItemId: cart.id, roomCategoryId }
    });
    if (!existingRoomSelection) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No room selection found for this category in the cart."
        }
      };
    }
    const newRoomCount = existingRoomSelection.roomCount + roomCountToAdd;
    const newAdultCount = existingRoomSelection.adultCount + adultCountToAdd;
    if (newRoomCount > availableRooms) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Cannot add more than ${availableRooms} available rooms for this category.`
        }
      };
    }
    if (newAdultCount < newRoomCount) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: "Each room requires at least one adult."
        }
      };
    }
    const maxAllowedAdults = roomCategory.adultCount * newRoomCount;
    if (newAdultCount > maxAllowedAdults) {
      return {
        rdata: null,
        rerror: {
          status: 400,
          message: `Cannot have more than ${roomCategory.adultCount} adults per room. Maximum allowed for ${newRoomCount} rooms is ${maxAllowedAdults} adults.`
        }
      };
    }
    await db_default.roomSelection.update({
      where: { id: existingRoomSelection.id },
      data: {
        roomCount: newRoomCount,
        adultCount: newAdultCount
      }
    });
    const updatedCart = await calculateCartAmounts(cart.id);
    return { rdata: updatedCart, rerror: null };
  } catch (error) {
    console.error("Error increasing room and adult count:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error."
      }
    };
  }
};
var removeFromCart = async ({
  customerId,
  hotelId,
  roomCategoryId
}) => {
  try {
    const cart = await db_default.cartItem.findFirst({
      where: { customerId, hotelId },
      include: { roomSelections: true }
    });
    if (!cart) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "No cart found for this customer and hotel."
        }
      };
    }
    const roomSelection = cart.roomSelections.find(
      (room) => room.roomCategoryId === roomCategoryId
    );
    if (!roomSelection) {
      return {
        rdata: null,
        rerror: {
          status: 404,
          message: "Room category not found in the cart."
        }
      };
    }
    await db_default.roomSelection.delete({
      where: { id: roomSelection.id }
    });
    const remainingSelections = await db_default.roomSelection.findMany({
      where: { cartItemId: cart.id }
    });
    if (remainingSelections.length === 0) {
      await db_default.cartItem.delete({
        where: { id: cart.id }
      });
      return {
        rdata: null,
        rerror: null,
        message: "Cart removed successfully."
      };
    }
    const updatedCart = await calculateCartAmounts(cart.id);
    return {
      rdata: updatedCart,
      rerror: null,
      message: "Room category removed successfully."
    };
  } catch (error) {
    console.error("Error removing from cart:", error);
    return {
      rdata: null,
      rerror: {
        status: 500,
        message: "Internal server error."
      }
    };
  }
};
var calculateCartAmounts = async (cartItemId) => {
  const cart = await db_default.cartItem.findUnique({
    where: { id: cartItemId },
    include: { roomSelections: true }
  });
  let totalAmount = 0;
  let totalDiscount = 0;
  for (const selection of cart.roomSelections) {
    const roomCategory = await db_default.roomCategory.findUnique({
      where: { id: selection.roomCategoryId }
    });
    const totalRoomCost = roomCategory.price * selection.roomCount * cart.nights;
    let guestCost = 0;
    const extraGuests = selection.adultCount - selection.roomCount * 2;
    if (extraGuests > 0) {
      guestCost = extraGuests * roomCategory.perGuestPrice * cart.nights;
    }
    console.log("guestCost:", guestCost);
    console.log("totalRoomCost:", totalRoomCost);
    totalAmount += totalRoomCost + guestCost;
    totalDiscount += (totalRoomCost + guestCost) * roomCategory.discount / 100;
    console.log("Total amount:", totalAmount);
    console.log("Total discount:", totalDiscount);
    console.log("roomCategory.discount:", roomCategory.discount);
  }
  const amountWithGst = (totalAmount - totalDiscount) * process.env.GST_PCT / 100;
  const payAmount = totalAmount - totalDiscount + amountWithGst;
  const updatedCart = await db_default.cartItem.update({
    where: { id: cartItemId },
    data: {
      totalAmount,
      totalDiscount,
      payAmount,
      amountWithGst
    },
    include: { roomSelections: true }
  });
  return updatedCart;
};
var viewCart = async ({ customerId }) => {
  try {
    const cart = await db_default.cartItem.findFirst({
      where: { customerId },
      include: { roomSelections: true }
    });
    if (!cart) {
      return { data: null, rerror: { status: 404, message: "Cart not found" } };
    }
    return { data: cart, error: null };
  } catch (error) {
    console.error("Error viewing cart:", error);
    return { data: null, error: "Internal server error" };
  }
};

// modules/customerModule/Booking/BookingCartConroller.js
var addToCartController = async (req, res) => {
  const {
    customerId,
    hotelId,
    startDate,
    endDate,
    roomCategoryId,
    roomCount,
    adultCount
  } = req.body;
  if (!customerId || !hotelId || !startDate || !endDate || !roomCategoryId || !roomCount || !adultCount) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const { rdata, rerror } = await addToCart({
      customerId,
      hotelId,
      startDate,
      endDate,
      roomCategoryId,
      roomCount,
      adultCount
    });
    if (rerror) {
      return res.status(500).json({ error: rerror });
    }
    res.status(201).json({ message: "Cart updated successfully", data: rdata });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
var decreaseCartController = async (req, res) => {
  const { customerId, hotelId, roomCategoryId, roomCount, adultCount } = req.body;
  if (!customerId || !hotelId || !roomCategoryId) {
    return res.status(400).json({ rerror: { status: 400, message: "Missing required fields" } });
  }
  try {
    const result = await decreaseRoomAndAdultCount({
      customerId,
      hotelId,
      roomCategoryId,
      roomCountToRemove: roomCount || 0,
      adultCountToRemove: adultCount || 0
    });
    if (result.rerror) {
      return res.status(result.rerror.status).json({ rerror: result.rerror });
    }
    res.status(200).json({ message: "Cart updated successfully", data: result.rdata });
  } catch (error) {
    console.error("Error in decreaseCartController:", error);
    res.status(500).json({ rerror: { status: 500, message: "Internal server error" } });
  }
};
var increaseCartController = async (req, res) => {
  const { customerId, hotelId, roomCategoryId, roomCount, adultCount } = req.body;
  console.log(req.body);
  if (!customerId || !hotelId || !roomCategoryId) {
    return res.status(400).json({ rerror: { status: 400, message: "Missing required fields" } });
  }
  try {
    const result = await IncreaseRoomAndAdultCount({
      customerId,
      hotelId,
      roomCategoryId,
      roomCountToAdd: roomCount || 0,
      adultCountToAdd: adultCount || 0
    });
    if (result.rerror) {
      return res.status(result.rerror.status).json({ rerror: result.rerror });
    }
    res.status(200).json({ message: "Cart updated successfully", data: result.rdata });
  } catch (error) {
    console.error("Error in increaseCartController:", error);
    res.status(500).json({ rerror: { status: 500, message: "Internal server error" } });
  }
};
var removeFromCartController = async (req, res) => {
  const { customerId, hotelId, roomCategoryId } = req.body;
  if (!customerId || !hotelId || !roomCategoryId) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const { rdata, rerror } = await removeFromCart({
      customerId,
      hotelId,
      roomCategoryId
    });
    if (rerror) {
      return res.status(500).json({ rerror });
    }
    res.status(200).json({
      message: "Room removed from cart successfully",
      data: rdata
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};
var viewCartController = async (req, res) => {
  const { customerId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: "Missing required query parameters" });
  }
  try {
    const result = await viewCart({ customerId });
    if (result.error) {
      return res.status(404).json({ error: result.error });
    }
    res.status(200).json({ data: result.data });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// routes/booking/bookingRoutes.js
import { Router as Router31 } from "express";
var router34 = Router31();
var bookingRoutes_default2 = router34.post("/customer/payment", customerPaymentController).post("/customer/payment/verification", customerPaymentVerificationController).post("/customer/bookingAtHotel", createAtHotelBookingController).post("/customer/payment/atHotel", createPaymentAtHotelController).post("/customer/payment/verification/atHotel", verifyDuePaymentController).post("/customer/payment/retry", retryPaymentController).post("/customer/payment/cancel", customerCancelBookingController).post("/customer/payment/checkIn", customerCheckInController).post("/customer/payment/checkOut", customerCheckOutController).post("/customer/bookings", getAllCustomerBookigsController).get("/customer/booking/:bookingId", getBookingByBookingIdController3).get(
  "/customer/bookings/:customerId/:status",
  getCustomerBookingsStatusController
).post("/addNewGuest", addNewGuestController).get("/getAllGuest", getAllGuestsController).get("/getGuestById/:id", getGuestByIdController).patch("/updateGuest/:id", updateGuestController).delete("/dleteGuest/:id", deleteGuestController).post("/addtoCart", addToCartController).patch("/decreaseCartRoom", decreaseCartController).patch("/increaseCartRoom", increaseCartController).post("/removeCartRoom", removeFromCartController).post("/getRoomCart", viewCartController);

// modules/publicModule/hotel/publicHotelController.js
var getAllHotelController2 = async (req, res) => {
  try {
    const {
      search,
      city,
      state,
      landmark,
      latitude,
      longitude,
      checkIn: checkIn2,
      checkOut: checkOut2,
      guestCount,
      price,
      rating,
      amenity,
      sortBy,
      sortOrder,
      page,
      pageSize,
      orders,
      orderby
    } = req.query;
    const filters = {
      search,
      city,
      state,
      landmark,
      latitude,
      longitude,
      guestCount: guestCount ? parseInt(guestCount, 10) : void 0,
      price: price ? parseFloat(price) : void 0,
      rating: rating ? parseInt(rating, 10) : void 0,
      amenities: amenity ? Array.isArray(amenity) ? amenity : amenity.split(",") : void 0,
      page,
      pageSize,
      orders,
      orderby
    };
    const sorting = {
      sortBy: sortBy || "avgPrice",
      sortOrder: sortOrder === "asc" || sortOrder === "desc" ? sortOrder : "asc"
    };
    const { rdata, rerror } = await getAllHotels(
      filters,
      sorting,
      checkIn2,
      checkOut2
    );
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotels:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getLatestHotelsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getLatestHotels();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting latest hotels:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getTopRatedHotelsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getTopRatedHotels();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting top-rated hotels:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var getTrendingHotelsController = async (req, res) => {
  try {
    const { rdata, rerror } = await getTrendingHotels();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting trending hotels:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
var fetchHotelsByCityController = async (req, res) => {
  const { city } = req.params;
  const { page = 1, pageSize = 10 } = req.query;
  if (!city) {
    return res.status(400).json({ error: "City parameter is required" });
  }
  const { rdata, error } = await getHotelsByCity(city, page, pageSize);
  if (error) {
    return res.status(error.status).json({ error: error.message });
  }
  return res.status(200).json(rdata);
};
var getHotelByIdController3 = async (req, res) => {
  const { id } = req.params;
  try {
    const { rdata, rerror } = await getHotelById(id);
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting hotel by ID:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllCitiesController2 = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllCities();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getting cities:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
var getAllHotelAmenitiesController3 = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllHotelAmenities2();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getAllHotelAmenitiesController:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// modules/publicModule/hotel/publicRoomController.js
var handleGetAllRoomCategoryController2 = async (req, res) => {
  const { rdata, rerror } = await getAllRoomCategories();
  if (rerror)
    return res.status(rerror.status).json({ message: rerror.message });
  return res.status(200).json(rdata);
};
var getAllRoomAmenitiesController2 = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllRoomAmenities();
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in getAllRoomAmenitiesController:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/public/publicRoutes.js
import { Router as Router32 } from "express";
var router35 = Router32();
var publicRoutes_default = router35.get("/getAllHotels", getAllHotelController2).get("/getHotelsByCity/:city", fetchHotelsByCityController).get("/getHotelById/:id", getHotelByIdController3).get("/getAllRoomCategory", handleGetAllRoomCategoryController2).get("/latestHotels", getLatestHotelsController).get("/topratedHotels", getTopRatedHotelsController).get("/trendingHotels", getTrendingHotelsController).get("/getAllCities", getAllCitiesController2).get("/getAllHotelAmenities", getAllHotelAmenitiesController3).get("/getAllRoomAmenities", getAllRoomAmenitiesController2);

// routes/public/publicInquiryRoutes.js
import { Router as Router33 } from "express";

// modules/publicModule/inquiry/inquiryService.js
var createInquiry = async ({
  name,
  lastName,
  email,
  phone,
  message
}) => {
  try {
    const inquiry = await db_default.inquiry.create({
      data: {
        name,
        lastName,
        email,
        phone,
        message
      }
    });
    return { rdata: inquiry };
  } catch (error) {
    console.error("Error in createInquiry:", error);
    return { rerror: { status: 500, message: error.message } };
  }
};

// modules/publicModule/inquiry/publicInquiryController.js
var createInquiryController = async (req, res) => {
  const { name, lastName, email, phone, message } = req.body;
  try {
    const { rdata, rerror } = await createInquiry({
      name,
      lastName,
      email,
      phone,
      message
    });
    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }
    return res.status(200).json(rdata);
  } catch (error) {
    console.error("Error in creating inquiry:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// routes/public/publicInquiryRoutes.js
var router36 = Router33();
var publicInquiryRoutes_default = router36.post("/createInquiry", createInquiryController);

// routes/public/index.js
import { Router as Router34 } from "express";
var router37 = Router34();
var public_default = router37.use("/hotel", publicRoutes_default).use("/inquiry", publicInquiryRoutes_default);

// routes/index.js
var router38 = Router35();
router38.use("/admin", admin_default);
router38.use("/customer", customer_default);
router38.use("/vendor", vendor_default);
router38.use("/booking", bookingRoutes_default2);
router38.use("/public", public_default);
var routes_default = router38;

// config/allowedOrigins.js
var allowedOrigins = [
  "http://localhost:5173/",
  "http://localhost:3500",
  "http://localhost:3500/",
  "http://localhost:5173",
  "https://vaystahotels.com",
  "https://vaystahotels.com/"
];

// config/corsOptions.js
var corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200
};

// server.js
import { configDotenv } from "dotenv";
import dotenv5 from "dotenv";

// middleware/uploadFiles.js
import fs from "fs";
import path from "path";
import multer2 from "multer";
var storage2 = multer2.diskStorage({
  destination: (req, file, cb) => {
    const uploadFileDir2 = process.env.UPLOAD_FILE_DIR;
    if (!fs.existsSync(uploadFileDir2)) {
      fs.mkdirSync(uploadFileDir2, { recursive: true });
    }
    cb(null, uploadFileDir2);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
var upload2 = multer2({ storage: storage2 });
var uploadFiles2 = (req, res, next) => {
  try {
    upload2.fields([
      { name: "cityImage", maxCount: 1 },
      { name: "iconImage", maxCount: 1 },
      { name: "profileImg", maxCount: 1 },
      { name: "bannerImage", maxCount: 1 },
      { name: "hotelImage" },
      { name: "roomImage" },
      { name: "roomCatImage" },
      { name: "categoryImage" },
      { name: "propertyImage", maxCount: 5 },
      { name: "ownershipDocument", maxCount: 5 },
      { name: "pancardDocument" },
      { name: "aadharDocuments" },
      { name: "gstDocument" },
      { name: "signature" }
    ])(req, res, (err) => {
      if (err) {
        return res.status(400).send({ error: err });
      }
      const baseUrl = process.env.BASE_URL;
      const filePaths = [];
      if (req.files) {
        for (const field in req.files) {
          req.files[field].forEach((file) => {
            filePaths.push({
              fieldname: field,
              originalname: file.originalname,
              location: `${baseUrl}/uploads/${encodeURIComponent(
                file.originalname
              )}`
            });
          });
        }
      }
      req.body.fileUrls = filePaths;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};
var deleteFile = (filename) => {
  const uploadFileDir2 = process.env.UPLOAD_FILE_DIR;
  const filePath = path.resolve(uploadFileDir2, filename);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error("Error deleting file:", err);
      return err;
    }
  });
};

// server.js
dotenv5.config();
configDotenv();
var app = express5();
var Port = process.env.PORT || 3e3;
app.use(morgan("dev"));
app.use(express5.json());
app.use(bodyParser.json());
app.use(cookieParser());
var allowedOrigins2 = {
  origin: corsOptions,
  credentials: true
};
app.use(cors(allowedOrigins2));
var uploadFileDir = process.env.UPLOAD_FILE_DIR;
app.use("/uploads", express5.static(uploadFileDir));
app.post("/upload", uploadFiles2, (req, res) => {
  const fileUrls = req.body.fileUrls;
  res.status(200).json({ files: fileUrls });
});
app.delete("/deleteFile", (req, res) => {
  const { filename } = req.body;
  deleteFile(filename);
  res.status(200).send("File deleted successfully");
});
app.get("/", (req, res) => {
  res.status(200).json({ message: "HELLO" });
});
app.use("/api/v1", routes_default);
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
