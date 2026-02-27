import { corsOptions } from '../config/corsOptions';

export const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.includes(origin)) {
    res.header('Access-Control-Allow-Credentials', true);
  }
  next();
};
