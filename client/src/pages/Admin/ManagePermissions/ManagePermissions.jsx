import { useEffect, useState } from 'react';
import { notification } from 'antd';
import { permissionList } from './adminPermissions';
import {
  adminGetAllStaff,
  assignPermission,
} from '../../../../api/Admin/AuthApi';

const ManagePermissions = () => {
  const [staff, setStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState('');
  const [permissions, setPermissions] = useState([]);

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

  const getAllStaff = async () => {
    try {
      const res = await adminGetAllStaff();
      console.log('getAllStaff:', res);
      setStaff(res.data.data);
    } catch (error) {
      console.error('Error in getAllStaff:', error);
      notification.error({ message: 'Something went wrong' });
    }
  };

  const handleAssignPermission = async () => {
    if (!selectedStaff) {
      return notification.error({ message: 'Please select a staff' });
    }
    if (permissions.length === 0) {
      return notification.error({ message: 'Please select a permission' });
    }

    try {
      await assignPermission(selectedStaff, permissions);
      setPermissions([]);
      setSelectedStaff('');
      notification.success({ message: 'Permission assigned Successfully' });
    } catch (error) {
      console.error('Error in handleAssignPermission:', error);
      notification.error({ message: 'Something went wrong' });
    }
  };

  useEffect(() => {
    getAllStaff();
  }, []);

  useEffect(() => {
    console.log('permissions:', permissions);
  }, [permissions]);

  return (
    <div className='w-full px-10'>
      <div className='flex justify-between px-5'>
        <div>
          <h1>Manage Permission</h1>
        </div>
        <select
          onChange={(e) => setSelectedStaff(e.target.value)}
          className='w-56 px-4 py-2 focus:outline-none border border-gray-600 rounded-lg'
        >
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
        <div className='grid grid-cols-4 grid-flow-row px-10 gap-5 mt-10'>
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
            className='border-orange-500 border px-4 py-2 hover:bg-orange-500 hover:text-white rounded-lg'
          >
            Assign Permission
          </button>
        </div>
      </div>
    </div>
  );
};
export default ManagePermissions;
