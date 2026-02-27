import { Modal, notification, Switch } from 'antd';
import { Trash2, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { adminGetAllStaff } from '../../../../api/Admin/AuthApi';
import { toggleStaffActive } from '../../../../api/Admin/staffAPI';
import {
  deleteVendorStaffAPI,
  toggleVendorStaffActiveAPI,
  vendorGetAllStaff,
} from '../../../../api/Vendor/StaffAPI';
import { useAuth } from '../../../Hooks/useAuth';

function CustomerRow({ staff, fetchAllStaff }) {
  const userIcon =
    'https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png';

  const toggleActive = async (id) => {
    try {
      const res = await toggleVendorStaffActiveAPI(id);
      if (res.status === 200) {
        console.log(res.data);
        fetchAllStaff();
        notification.success({
          message: 'Success',
          description: 'Staff status updated successfully',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: 'Failed to update staff status',
      });
    }
  };

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);

  const openDeleteModal = () => {
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
  };

  const deleteStaff = async () => {
    try {
      const res = await deleteVendorStaffAPI(staff.id);
      if (res.status === 200) {
        console.log(res.data);
        fetchAllStaff();
        notification.success({
          message: 'Success',
          description: 'Staff deleted successfully',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error',
        description: 'Failed to delete staff',
      });
    }
  };

  return (
    <>
      {isDeleteModalVisible && (
        <Modal
          open={isDeleteModalVisible}
          onClose={closeDeleteModal}
          title='Delete Staff'
          onOk={deleteStaff}
          onCancel={closeDeleteModal}>
          <p>Are you sure you want to delete this staff?</p>
        </Modal>
      )}
      <div className='flex flex-col sm:flex-row items-center py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition'>
        <div className='flex-shrink-0 mb-4 sm:mb-0 sm:mr-4'>
          <img
            src={staff.profileImage || userIcon}
            alt={staff.name}
            className='w-12 h-12 rounded-full object-cover'
          />
        </div>
        <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left'>
          <div>
            <p className='text-xs font-medium text-gray-500'>Full Name</p>
            <p className='text-sm font-semibold text-gray-900'>{staff.name}</p>
          </div>
          <div>
            <p className='text-xs font-medium text-gray-500'>Email Address</p>
            <p className='text-sm text-gray-700'>{staff.email}</p>
          </div>
          <div>
            <p className='text-xs font-medium text-gray-500'>Phone Number</p>
            <p className='text-sm text-gray-700'>{staff.phone}</p>
          </div>
          <div>
            <p className='text-xs font-medium text-gray-500'>Address</p>
            <p className='text-sm text-gray-700'>{staff.address || 'Na'}</p>
          </div>
        </div>
        <div className='flex gap-2 flex-shrink-0 mt-4 sm:mt-0'>
          <button className='text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium'>
            <Switch
              checked={staff.isActive}
              onChange={() => toggleActive(staff.id)}
            />
          </button>
          <button
            onClick={openDeleteModal}
            className='text-red-600 hover:text-red-700 flex items-center text-sm font-medium'>
            <Trash2 className='h-6 w-6' />
          </button>
        </div>
      </div>
    </>
  );
}

function SummaryCard({ title, value, Icon }) {
  return (
    <div className='bg-white rounded-lg shadow p-6'>
      <div className='flex items-center'>
        <div className='flex-shrink-0 bg-blue-100 rounded-full p-3 mr-4'>
          <Icon className='h-6 w-6 text-blue-600' />
        </div>
        <div>
          <p className='text-sm font-medium text-gray-500'>{title}</p>
          <p className='text-2xl font-semibold text-gray-900'>{value}</p>
        </div>
      </div>
    </div>
  );
}

export default function ManageStaff() {
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [activeStatus, setActiveStatus] = useState(true);

  const [staff, setStaff] = useState([]);

  const { vendorAuth } = useAuth();
  const vendorId = vendorAuth && vendorAuth.data.id;

  const fetchAllStaff = async () => {
    const data = {
      vendorId,
      name: nameFilter,
      phone: phoneFilter,
      email: emailFilter,
      isActive: activeStatus,
    };
    try {
      const res = await vendorGetAllStaff(data);
      if (res.status === 200) {
        console.log(res);
        setStaff(res.data);
      } else {
        setStaff(res.response.data.data);
      }
    } catch (error) {
      setStaff([]);
      console.log(error);
    }
  };

  const [debounce, setDebounce] = useState(null);

  useEffect(() => {
    clearTimeout(debounce);
    const timeout = setTimeout(() => {
      fetchAllStaff();
    }, 300);
    setDebounce(timeout);
  }, [nameFilter, emailFilter, phoneFilter, activeStatus]);

  return (
    <div className='min-h-screen bg-gray-50 p-6 lg:p-10'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-3xl font-bold text-gray-800 mb-3'>
          Staff Management
        </h1>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8'>
          <SummaryCard
            title='Total Staff'
            value={(staff && staff.length > 0 && staff.length) || 0}
            Icon={Users}
          />
          {/* <SummaryCard
            title='New Customers (This Month)'
            value='56'
            Icon={UserPlus}
          /> */}
        </div>

        {/* Filters */}
        <div className='flex flex-col sm:flex-row gap-4 mb-6'>
          <input
            type='text'
            placeholder='Filter by Name'
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
            className='p-2 border border-gray-300 rounded-md'
          />
          <input
            type='text'
            placeholder='Filter by Phone'
            value={phoneFilter}
            onChange={(e) => setPhoneFilter(e.target.value)}
            className='p-2 border border-gray-300 rounded-md'
          />
          <input
            type='text'
            placeholder='Filter by Email'
            value={emailFilter}
            onChange={(e) => setEmailFilter(e.target.value)}
            className='p-2 border border-gray-300 rounded-md'
          />
          <select
            onChange={(e) => setActiveStatus(e.target.value)}
            className='px-8 p-2 border border-gray-300 rounded-md'>
            <option value={true}>Active</option>
            <option value={false}>InActive</option>
          </select>
        </div>

        <div className='bg-white shadow rounded-lg'>
          {staff && staff.length > 0 ? (
            staff
              .filter(
                (staff) => staff.name !== 'admin' && staff.name !== 'Admin'
              )
              .map((staff) => (
                <CustomerRow
                  fetchAllStaff={fetchAllStaff}
                  key={staff.id}
                  staff={staff}
                />
              ))
          ) : (
            <div className='p-6 text-center'>
              <p className='text-gray-500'>No staff found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
