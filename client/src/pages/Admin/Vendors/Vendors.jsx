import React, { useState, useEffect } from 'react';
import { getAllVendors } from '../../../../api/Admin/VendorApi';
import { Switch, Modal, notification } from 'antd';
import VendorKyc from './VendorKyc';
import { toggleVendorStatus } from '../../../../api/Admin/VendorApi';
import { Pagination } from 'antd';
import DataLoading from '../../../components/DataLoading/DataLoading';

const userIcon =
  'https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png';

function CustomerRow({ vendor, fetchAllVendors }) {
  const [selectedVendorKyc, setVendorKyc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = (KYC) => {
    setIsModalOpen(true);
    setVendorKyc(KYC);
  };

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'VERIFIED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const toggleActive = async (id) => {
    try {
      const res = await toggleVendorStatus(id);
      if (res.status === 200) {
        notification.success({
          message: 'Vendor status updated!',
        });
        fetchAllVendors();
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <>
      <tr className='border-b border-gray-200 hover:bg-gray-50'>
        <td className='py-4 px-6'>
          <img
            src={vendor.profileImage || userIcon}
            alt={vendor.name}
            className='w-12 h-12 rounded-full object-cover mx-auto'
          />
        </td>
        <td className='py-4 px-6'>
          <p className='text-sm font-semibold text-gray-900'>
            {vendor.name} {vendor.lastName}
          </p>
        </td>
        <td className='py-4 px-6'>
          <p className='text-sm text-gray-700'>{vendor.email}</p>
        </td>
        <td className='py-4 px-6'>
          <p className='text-sm text-gray-700'>{vendor.phone}</p>
        </td>
        <td className='py-4 px-6'>
          <p
            className={`text-sm font-semibold px-2 py-1 rounded ${
              vendor.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {vendor.isActive ? 'ACTIVE' : 'INACTIVE'}
          </p>
        </td>
        <td className='py-4 px-6'>
          <td className='py-4 px-6'>
            <p
              className={`text-sm font-semibold px-2 py-1 rounded ${getStatusStyles(
                vendor.bankKYC?.kycStatus
              )}`}
            >
              {vendor.bankKYC?.kycStatus ? vendor.bankKYC.kycStatus : 'N/A'}
            </p>
          </td>
        </td>

        <td className='py-4 px-6'>
          {vendor.bankKYC ? (
            <button
              onClick={() => showModal(vendor.bankKYC)}
              className='cta px-2 py-1 text-[12px] text-nowrap rounded-md'
            >
              View KYC
            </button>
          ) : (
            <button className='bg-orange-300 px-2 py-1 text-[12px] rounded-md'>
              No KYC
            </button>
          )}
        </td>
        <td className='py-4 px-6 text-center'>
          <Switch
            checked={vendor.isActive}
            onChange={() => toggleActive(vendor.id)}
          />
        </td>
      </tr>
      <Modal
        width={1000}
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <VendorKyc selectedVendorKyc={selectedVendorKyc} />
      </Modal>
    </>
  );
}

export default function CustomerManagement() {
  const [nameFilter, setNameFilter] = useState('');
  const [emailFilter, setEmailFilter] = useState('');
  const [phoneFilter, setPhoneFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [vendorData, setVendorData] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  console.log('vendorData', vendorData);

  const fetchAllVendors = async () => {
    try {
      setIsLoading(true);
      const filters = {
        page,
        pageSize,
        nameFilter,
        emailFilter,
        phoneFilter,
        statusFilter,
      };

      const res = await getAllVendors(filters);
      if (res.status === 200) {
        setIsLoading(false);
        setVendorData(res.data.data);
        setTotalItems(res.data.pagination.total);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  useEffect(() => {
    fetchAllVendors();
  }, [nameFilter, emailFilter, phoneFilter, statusFilter, page, pageSize]);

  return (
    <>
      <div className='min-h-screen bg-gray-50 p-6 lg:p-10'>
        <div className='max-w-6xl mx-auto'>
          <h1 className='text-3xl font-bold text-gray-800 mb-3'>
            Vendor Management
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
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className='px-8 p-2 border border-gray-300 rounded-md'
            >
              <option>Status</option>
              <option value={true}>Active</option>
              <option value={false}>Inactive</option>
            </select>
            <button
              onClick={() => {
                setNameFilter('');
                setEmailFilter('');
                setPhoneFilter('');
                setStatusFilter('');
              }}
              className='px-8 cta p-2 border border-gray-300 rounded-md'
            >
              Clear
            </button>
          </div>

          {/* Vendor Table */}
          <div className='overflow-x-auto'>
            <table className='min-w-full bg-white shadow rounded-lg'>
              <thead>
                <tr className='uppercase text-[14px] bg-gray-100'>
                  <th className='py-2 px-4'>Profile</th>
                  <th className='py-2 px-4 text-left text-nowrap'>Full Name</th>
                  <th className='py-2 px-4 text-left text-nowrap'>
                    Email Address
                  </th>
                  <th className='py-2 px-4 text-left text-nowrap'>
                    Phone Number
                  </th>
                  <th className='py-2 px-4text-left text-nowrap '>
                    Vendor Status
                  </th>
                  <th className='py-2 px-4 text-left text-nowrap'>
                    KYC Status
                  </th>
                  <th className='py-2 px-4 text-left text-nowrap'>
                    Vendor KYC
                  </th>
                  <th className='py-2 px-4 text-left text-nowrap'>Active</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <div className='md:ml-[450px]'>
                    <DataLoading />
                  </div>
                ) : vendorData && vendorData.length > 0 ? (
                  vendorData.map((vendor) => (
                    <CustomerRow
                      key={vendor.id}
                      vendor={vendor}
                      fetchAllVendors={fetchAllVendors}
                    />
                  ))
                ) : (
                  <p className='mt-12 ml-20'>Customer not found</p>
                )}
              </tbody>
            </table>
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
