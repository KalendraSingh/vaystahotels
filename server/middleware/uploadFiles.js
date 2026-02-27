import fs from 'fs';
import path from 'path';
import multer from 'multer';

// Configure multer storage

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadFileDir = process.env.UPLOAD_FILE_DIR;
    if (!fs.existsSync(uploadFileDir)) {
      fs.mkdirSync(uploadFileDir, { recursive: true });
    }
    cb(null, uploadFileDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

export const uploadFiles = (req, res, next) => {
  try {
    upload.fields([
      { name: 'cityImage', maxCount: 1 },
      { name: 'iconImage', maxCount: 1 },
      { name: 'profileImg', maxCount: 1 },
      { name: 'bannerImage', maxCount: 1 },
      { name: 'hotelImage' },
      { name: 'roomImage' },
      { name: 'roomCatImage' },
      { name: 'categoryImage' },
      { name: 'propertyImage', maxCount: 5 },
      { name: 'ownershipDocument', maxCount: 5 },
      { name: 'pancardDocument' },
      { name: 'aadharDocuments' },
      { name: 'gstDocument' },
      { name: 'signature' },
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
              )}`,
            });
          });
        }
      }
      req.body.fileUrls = filePaths;
      next();
    });
  } catch (error) {
    console.log(error);
    res.status(500).send('Something went wrong');
  }
};

// Middleware to delete a file from the server
export const deleteFile = (filename) => {
  const uploadFileDir = process.env.UPLOAD_FILE_DIR;
  const filePath = path.resolve(uploadFileDir, filename);

  fs.unlink(filePath, (err) => {
    if (err) {
      console.error('Error deleting file:', err);
      return err;
    }
  });
};
