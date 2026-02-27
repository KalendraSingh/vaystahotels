import { useEffect, useState } from 'react';
import { permissionList } from './allPermissions.js';
import { useAuth } from '../../../Hooks/useAuth.jsx';
import {
  allStaffByVendorId,
  assignPermissionAPI,
} from '../../../../api/Vendor/StaffAPI.js';
import { notification } from 'antd';

const ManagePermission = () => {
  const [permissions, setPermissions] = useState([]);
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const { vendorAuth } = useAuth();
  const vendorId = vendorAuth.data && vendorAuth.data.id;
  console.log(vendorAuth);

  const getAllStaff = async () => {
    try {
      const res = await allStaffByVendorId(vendorId);
      console.log(res);
      if (res.status === 200) {
        console.log(res.data);
        setStaff(res.data);
      } else notification.error({ message: res.message });
    } catch (error) {
      console.log('Error in getting all staff:', error);
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  const handleCheck = (e, permission) => {
    if (e.target.checked) {
      setPermissions([...permissions, permission]);
    } else {
      setPermissions(permissions.filter((perm) => perm !== permission));
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setPermissions(permissionList.map((permission) => permission));
    } else {
      setPermissions([]);
    }
  };

  useEffect(() => {
    console.log(permissions);
  }, [permissions]);

  const handleAssignPermission = async () => {
    try {
      const res = await assignPermissionAPI(selectedStaff, permissions);

      if (res.status === 200) notification.success({ message: res.message });

      console.log(res);
    } catch (error) {
      notification.error({ message: error.response.data.message });
      console.log('Error in assigning permission:', error);
    }
  };

  return (
    <div className='w-full'>
      <div className='flex justify-between px-5'>
        <div>
          <h1>Manage Permission</h1>
        </div>
        <select
          onChange={(e) => setSelectedStaff(e.target.value)}
          className='w-56 px-4 py-2 focus:outline-none border border-gray-600 rounded-lg'>
          <option value=''>Select Staff</option>
          {staff.map((staff, index) => (
            <option key={index} value={staff.id}>
              {staff.name}
            </option>
          ))}
        </select>
      </div>
      <div className='flex items-center gap-2'>
        <input
          type='checkbox'
          name='selectAll'
          id='selectAll'
          className='w-4 h-4'
          onChange={handleSelectAll}
          checked={permissions.length === permissionList.length}
        />
        <label htmlFor='selectAll'>Select All</label>
      </div>
      <div>
        <div className='grid grid-cols-4 grid-flow-row gap-5 mt-10'>
          {permissionList &&
            permissionList.map((permission, index) => (
              <div key={index} className='flex items-center gap-2'>
                <input
                  className='w-4 h-4'
                  type='checkbox'
                  name={permission.name}
                  id={permission.name}
                  onChange={(e) => handleCheck(e, permission)}
                  checked={permissions.includes(permission)}
                />
                <label htmlFor={permission.name}>{permission.name}</label>
              </div>
            ))}
        </div>
        <div className='flex justify-center items-center mt-10'>
          <button
            onClick={handleAssignPermission}
            className='border-orange-500 border px-4 py-2 hover:bg-orange-500 hover:text-white rounded-lg'>
            Assign Permission
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManagePermission;
