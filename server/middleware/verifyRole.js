import jwt from 'jsonwebtoken';
import prisma from '../config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const verfiyRoute = ({ route }) => {
  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization || req.headers.Authorization;

      if (!authHeader?.startsWith('Bearer ')) {
        return res.sendStatus(401);
      }
      const token = authHeader.split(' ')[1];
      jwt.verify(token, process.env.ACCESS_TOKEN, async (err, decoded) => {
        if (err) {
          return res.sendStatus(403);
        }
        const staff = decoded.staff;

        const staffGet = await prisma.staff.findUnique({
          where: {
            id: staff.id,
          },
          select: { role: true },
        });

        if (staffGet.role === 'Admin') {
          return next();
        }
        if (route !== undefined) {
          const permitedRoutes = await prisma.permitedRoutes.findMany({
            where: {
              staffId: staff.id,
              routeName: route,
            },
          });

          if (permitedRoutes.length === 0) {
            return res.sendStatus(401);
          }
        }
        next();
      });
    } catch (error) {
      res.status(401);
    }
  };
};

export default verfiyRoute;
