import React, { useEffect, useState } from 'react';
import { notification, Switch } from 'antd';
import {
  getAllCustomer,
  toggleCustomerActive,
} from '../../../../api/Admin/CustomerApi';
import { Pagination } from 'antd';

function CustomerRow({ customer, toggleActive }) {
  const userIcon =
    'https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png';
  return (
    <div className='flex flex-col sm:flex-row items-center py-4 px-6 border-b border-gray-200 hover:bg-gray-50 transition'>
      <div className='flex-shrink-0 mb-4 sm:mb-0 sm:mr-4'>
        <img
          src={customer.profileImage || userIcon}
          alt={customer.name}
          className='w-12 h-12 rounded-full object-cover'
        />
      </div>
      <div className='flex-grow grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-center sm:text-left'>
        <div>
          <p className='text-xs font-medium text-gray-500'>Full Name</p>
          <p className='text-sm font-semibold text-gray-900'>{customer.name}</p>
        </div>
        <div>
          <p className='text-xs font-medium text-gray-500'>Email Address</p>
          <p className='text-sm text-gray-700'>{customer.email}</p>
        </div>
        <div>
          <p className='text-xs font-medium text-gray-500'>Phone Number</p>
          <p className='text-sm text-gray-700'>{customer.phone}</p>
        </div>
        <div>
          <p className='text-xs font-medium text-gray-500'>Address</p>
          <p className='text-sm text-gray-700'>{customer.address || 'Na'}</p>
        </div>
      </div>
      <div className='flex-shrink-0 mt-4 sm:mt-0'>
        <button className='text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium'>
          <Switch
            checked={customer.isActive}
            onChange={() => toggleActive(customer.id)}
          />
        </button>
      </div>
    </div>
  );
}

export default function CustomerManagement() {
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [customerData, setCustomerData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(null);
  const fetchAllCustomers = async () => {
    try {
      const filters = {
        page,
        pageSize,
        nameFilter,
        emailFilter,
        phoneFilter,
        statusFilter,
      };
      const res = await getAllCustomer(filters);
      if (res.status === 200) {
        console.log(res.data);
        setCustomerData(res.data.data);
        setTotalItems(res.data.pagination.total);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleActive = async (id) => {
    try {
      const res = await toggleCustomerActive(id);
      if (res.status === 200) {
        fetchAllCustomers();
        notification.success({
          message: 'Customer status changed!',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Customer status failed!',
      });
    }
  };

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchAllCustomers();
  }, [nameFilter, emailFilter, phoneFilter, statusFilter, page, pageSize]);

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-6 lg:p-10'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-800 mb-3'>
            Customer Management
          </h1>

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
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
              className='p-2 border border-gray-300 rounded-md'
            />
            <input
              type='text'
              placeholder='Filter by Email'
              value={phoneFilter}
              onChange={(e) => setPhoneFilter(e.target.value)}
              className='p-2 border border-gray-300 rounded-md'
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-8 p-2 border border-gray-300 rounded-md'
            >
              <option value=''>Status</option>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            <button
              onClick={() => {
                setPhoneFilter('');
                setEmailFilter('');
                setStatusFilter('');
                setNameFilter('');
              }}
              className='px-8 cta p-2 border border-gray-300 rounded-md'
            >
              Clear
            </button>
          </div>

          <div className='bg-white shadow rounded-lg'>
            {customerData &&
              customerData.map((customer) => (
                <CustomerRow
                  toggleActive={toggleActive}
                  key={customer.id}
                  customer={customer}
                />
              ))}
          </div>
        </div>
      </div>
      <div className='py-4 flex justify-center'>
        <Pagination
          current={page}
          pageSize={pageSize}
          total={totalItems}
          onChange={onPageChange}
          showTotal={(total) => `Total ${total} items`}
        />
      </div>
    </>
  );
}
