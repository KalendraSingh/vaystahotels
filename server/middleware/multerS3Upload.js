import multer from 'multer';
import { Upload } from '@aws-sdk/lib-storage';
import { PassThrough } from 'stream';
import { s3 } from '../config/awsConfig.js';
import { convertS3ToCloudFrontUrl } from '../utils/urlUtils.js';
import { v4 as uuid } from 'uuid';

const storage = multer.memoryStorage();
export const upload = multer({ storage });
export const uploadFiles = async (req, res, next) => {
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
    ])(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: err.message });
      } else if (err) {
        return res.status(500).json({ error: 'An unknown error occurred.' });
      }

      if (!req.files) {
        return res.status(400).json({ error: 'No files uploaded.' });
      }

      const uploadedFiles = [];
      for (const field in req.files) {
        for (const file of req.files[field]) {
          const pass = new PassThrough();

          // Remove spaces from the original file name
          const sanitizedFileName = `${uuid()}_${file.originalname.replace(/\s+/g, '')}`;

          const upload = new Upload({
            client: s3,
            params: {
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: `images/${sanitizedFileName}`,
              Body: pass,
              ContentType: file.mimetype,
              ContentDisposition: 'inline',
            },
          });

          pass.end(file.buffer);
          await upload.done();

          const s3Url = `${process.env.AWS_S3_BUCKET_URL}/images/${sanitizedFileName}`;
          const cloudFrontUrl = convertS3ToCloudFrontUrl(s3Url);

          uploadedFiles.push({
            fieldname: file.fieldname,
            originalname: sanitizedFileName,
            location: cloudFrontUrl,
          });
        }
      }

      req.body.fileUrls = uploadedFiles;
      next();
    });
  } catch (error) {
    console.error('Error uploading files to S3:', error);
    res.status(500).json({
      message: 'Internal server error',
      error: error.message,
    });
  }
};

export const deleteFile = async (filename) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `images/${filename}`,
    };
    await s3.send(new DeleteObjectCommand(params));
    console.log('File successfully deleted:', filename);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    return error;
  }
};
