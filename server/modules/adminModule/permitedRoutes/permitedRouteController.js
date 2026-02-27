import {
  createPermitedRoutes,
  deletePermitedRoutes,
  getPermittedRouteByStaffId,
} from './permitedRouteService.js';

export const createPermitedRoutesController = async (req, res) => {
  try {
    const { staffId, routeNames } = req.body;

    const { rdata, rerror } = await createPermitedRoutes({
      staffId,
      routeNames,
    });

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(201).json(rdata);
  } catch (error) {
    console.error('Error in createPermitedRoutesController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const deletePermitedRoutesController = async (req, res) => {
  try {
    const { staffId, permitedRouteId } = req.params;

    const { rdata, rerror } = await deletePermitedRoutes({
      staffId,
      permitedRouteId,
    });

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in deletePermitedRoutesController:', error);
    res.status(500).send('Something went wrong');
  }
};

export const getPermittedRouteByStaffIdController = async (req, res) => {
  try {
    const { staffId } = req.params;

    const { rdata, rerror } = await getPermittedRouteByStaffId({ staffId });

    if (rerror) {
      return res.status(rerror.status).json({ message: rerror.message });
    }

    res.status(200).json(rdata);
  } catch (error) {
    console.error('Error in getPermittedRouteByStaffIdController:', error);
    res.status(500).send('Something went wrong');
  }
};
