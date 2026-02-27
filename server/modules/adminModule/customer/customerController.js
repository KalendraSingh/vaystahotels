import {
  deleteCustomer,
  getAllCustomers,
  getCustomerById,
  toggleCustomerStatus,
} from './customerService.js';

export const getAllCustomersController = async (req, res) => {
  try {
    const filters = req.query;
    const customers = await getAllCustomers(filters);
    res.status(200).json(customers);
  } catch (error) {
    console.error('Error in getAllCustomersController:', error);
    res
      .status(500)
      .json({ message: 'Failed to fetch customers', error: error.message });
  }
};

// Controller to get a single customer by ID
export const getCustomerByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const customer = await getCustomerById(id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(200).json(customer);
  } catch (error) {
    res.status(500).json({
      message: 'Failed to fetch customer details',
      error: error.message,
    });
  }
};

// Controller to toggle customer's active status
export const toggleCustomerStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCustomer = await toggleCustomerStatus(id);
    res.status(200).json({
      message: `Customer status updated`,
      customer: updatedCustomer,
    });
  } catch (error) {
    console.error('Error in toggleCustomerStatusController:', error);
    res.status(500).json({
      message: 'Failed to update customer status',
      error: error.message,
    });
  }
};

// Delete customer
export const deleteCustomerController = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteCustomer(id);
    res.status(200).json({ message: 'Customer deleted successfully' });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Failed to delete customer', error: error.message });
  }
};
