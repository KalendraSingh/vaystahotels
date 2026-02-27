import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import bodyParser from 'body-parser';
import routes from './routes/index.js';
import { corsOptions } from './config/corsOptions.js';
import { configDotenv } from 'dotenv';
import dotenv from 'dotenv';
import { uploadFiles, deleteFile } from './middleware/uploadFiles.js';

dotenv.config();
configDotenv();

// Initializing Express app
const app = express();
const Port = process.env.PORT || 3000;

// Middleware
app.use(morgan('dev')); // Logger
app.use(express.json()); // JSON body parser
app.use(bodyParser.json()); // JSON body parser
app.use(cookieParser()); // Cookie parser

// Custom middleware

const allowedOrigins = {
  origin: corsOptions,
  credentials: true,
};

app.use(cors(allowedOrigins));

// Middleware to serve uploaded files
const uploadFileDir = process.env.UPLOAD_FILE_DIR;
app.use('/uploads', express.static(uploadFileDir));

// Endpoint to handle file uploads
app.post('/upload', uploadFiles, (req, res) => {
  const fileUrls = req.body.fileUrls;
  res.status(200).json({ files: fileUrls });
});

// // Example endpoint to delete a file

app.delete('/deleteFile', (req, res) => {
  const { filename } = req.body;
  deleteFile(filename);
  res.status(200).send('File deleted successfully');
});

// Routes
app.get('/', (req, res) => {
  res.status(200).json({ message: 'HELLO' });
});

app.use('/api/v1', routes);

// Start server
app.listen(Port, () => {
  console.log(`Server running on port ${Port}`);
});
