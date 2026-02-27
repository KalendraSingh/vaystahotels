import { checkRequiredFields } from '../../../utils/checkRequiredFields.js';
import {
  newRole,
  deleteRole,
  updateRole,
  getRoleById,
  getAllRoles,
} from './staffRoleService.js';

// Controller for creating a new role
export const newRoleContoller = async (req, res) => {
  try {
    if (req.body.name === '') {
      return res.status(400).json({ message: 'Role name is required' });
    } else if (req.body.rank === null) {
      return res.status(400).json({ message: 'Role rank is required' });
    }

    const { data, error } = checkRequiredFields(req.body, ['name', 'rank']);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }
    const { rdata, rerror } = await newRole({ ...data, res });

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in newRole:', error);
    res.status(500).send('Something went wrong');
  }
};

// Controller for getting all roles
export const getAllRolesController = async (req, res) => {
  try {
    const { rdata, rerror } = await getAllRoles();

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in getAllRolesController:', error);
    res.status(500).send('Something went wrong');
  }
};

// Controller for deleting a role
export const deleteRoleController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await deleteRole(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in deleteRoleController:', error);
    res.status(500).send('Something went wrong');
  }
};

// Controller for updating a role
export const updateRoleController = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = checkRequiredFields(req.body, ['name', 'rank']);

    if (error) {
      return res
        .status(400)
        .json({ message: error.message, fields: error.fields });
    }

    const { rdata, rerror } = await updateRole(id, data);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in updateRoleController:', error);
    res.status(500).send('Something went wrong');
  }
};

// Controller for getting a role by ID (edit)
export const getRoleByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const { rdata, rerror } = await getRoleById(id);

    if (rerror) {
      return res.status(rerror.status).json(rerror);
    }

    res.status(rdata.status).json(rdata);
  } catch (error) {
    console.error('Error in getRoleByIdController:', error);
    res.status(500).send('Something went wrong');
  }
};
