import React, { useState, useEffect, useCallback } from 'react';
import { FaSort, FaExternalLinkAlt } from 'react-icons/fa';

import { Modal } from 'antd';
import {
  getAllHotels,
  toggleHotelStatus,
} from '../../../../api/Admin/HotelApi';
import { notification, Switch } from 'antd';
import HotelPolicyForm from './HotelPolicy';
import { Link } from 'react-router-dom';
import { Pagination } from 'antd';
import DataLoading from '../../../components/DataLoading/DataLoading';

const AllHotel = () => {
  const [hotelsData, setHotelsData] = useState(null);
  const [selectedHotelPolicy, setHotelPolicy] = useState(null);
  const [hotelName, setHotelName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [priceOrder, setPriceOrder] = useState('');
  const [rating, setRating] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [policyStatus, setPolicyStatus] = useState('');
  const [hotelStatus, setHotelStatus] = useState('');

  console.log(paymentStatus, rating);

  const showModal = (policy, hotelName) => {
    setIsModalOpen(true);
    setHotelPolicy(policy);
    setHotelName(hotelName);
  };

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const debounce = (func, delay) => {
    let debounceTimer;
    return (...args) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = debounce((text) => {
    setSearchText(text);
  }, 500);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  console.log('hotelsData', hotelsData);

  const fetchAllHotelsData = async () => {
    const filterData = {
      page,
      pageSize,
      search: searchText,
      sortBy: priceOrder === '' ? 'name' : 'avgPrice',
      sortOrder: priceOrder || 'asc',
      rating,
      paymentStatus,
      policyStatus,
      hotelStatus:
        hotelStatus === 'true'
          ? true
          : hotelStatus === 'false'
          ? false
          : undefined,
    };
    try {
      setIsLoading(true);
      const res = await getAllHotels(filterData);
      if (res.status === 200) {
        setIsLoading(false);
        setHotelsData(res.data.data);
        setTotalItems(res.data.pagination.total);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHotelsData();
  }, [
    page,
    pageSize,
    searchText,
    priceOrder,
    rating,
    paymentStatus,
    policyStatus,
    hotelStatus,
  ]);

  const toggleHotelActivation = async (id, checked) => {
    console.log(id, checked);
    try {
      const res = await toggleHotelStatus(id, checked);
      if (res.status === 200) {
        fetchAllHotelsData();
        notification.success({
          message: res.data.message || 'Hotel  status changed!',
        });
      }
    } catch (error) {
      notification.error({
        message: error.response?.data?.message || 'An error occurred',
      });
    }
  };

  return (
    <>
      <div className=''>
        <h1 className='text-3xl font-bold mb-6'>Hotel Management</h1>

        <div className='flex items-center justify-start gap-4 mb-6'>
          <div className='flex flex-wrap gap-5 text-sm rounded-none text-neutral-800'>
            <div>
              <input
                type='text'
                placeholder='Search hotel...'
                className='px-4 py-2'
                onChange={(e) => handleSearchChange(e.target.value)}
              />
            </div>
            <div>
              <select
                value={priceOrder}
                className='px-4 py-2'
                onChange={(e) => setPriceOrder(e.target.value)}
              >
                <option value=''>Price</option>
                <option value='desc'>High to Low</option>
                <option value='asc'>Low to High</option>
              </select>
            </div>
            <div>
              <select
                value={rating}
                className='px-4 py-2'
                onChange={(e) => setRating(e.target.value)}
              >
                <option value=''>Rating</option>
                <option value='5'>5 Stars</option>
                <option value='4'>4 Stars</option>
                <option value='3'>3 Stars</option>
                <option value='2'>2 Stars</option>
                <option value='1'>1 Star</option>
              </select>
            </div>
            <div>
              <select
                className='px-4 py-2'
                value={paymentStatus}
                onChange={(e) => setPaymentStatus(e.target.value)}
              >
                <option value=''>Payment</option>
                <option value={false}>Pending</option>
                <option value={true}>Paid</option>
              </select>
            </div>
            <div>
              <select
                className='px-4 py-2'
                value={policyStatus}
                onChange={(e) => setPolicyStatus(e.target.value)}
              >
                <option value=''>Policy</option>
                <option value='PENDING'>Pending</option>
                <option value='APPROVED'>Approved</option>
                <option value='REJECTED'>Rejected</option>
              </select>
            </div>
            <div>
              <select
                value={hotelStatus}
                className='px-4 py-2'
                onChange={(e) => setHotelStatus(e.target.value)}
              >
                <option value=''>Hotel Status</option>
                <option value={true}>Active</option>
                <option value={false}>Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <button
              className='gap-1 self-stretch px-4 py-2 font-medium text-white bg-orange-600 rounded cta'
              onClick={() => {
                setSearchText('');
                setPriceOrder('');
                setRating('');
                setPaymentStatus('');
                setPolicyStatus('');
                setHotelStatus('');
              }}
            >
              Clear Filter
            </button>
          </div>
        </div>

        <div className='bg-white p-4'>
          <table className='min-w-full bg-white shadow-md rounded-lg overflow-hidden'>
            <thead className='bg-gray-100'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  Property Information
                </th>

                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  HOTEl STATUS
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  Payment
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Avg Price
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Avg Rating
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Policy Status
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Hotel Policy
                </th>

                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Activate/Deactivate
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {isLoading ? (
                <div className='ml-[550px]'>
                  <DataLoading />
                </div>
              ) : hotelsData && hotelsData.length > 0 ? (
                hotelsData.map((hotel) => (
                  <tr key={hotel.id}>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <div className='flex items-center'>
                        <img
                          className='h-10 w-10 rounded-full object-cover mr-3'
                          src={hotel.bannerImage}
                          alt={hotel.name}
                        />
                        <div>
                          <div className='text-sm font-medium text-gray-900'>
                            <Link
                              to={`/hotelDetailed/${hotel.id}`}
                              className='text-sm font-medium flex items-center hover:text-blue-600 cursor-pointer text-gray-900'
                            >
                              {hotel.name}
                              <FaExternalLinkAlt className='inline ml-2' />
                            </Link>
                          </div>

                          <div className='text-sm text-gray-500'>
                            {hotel.city}, {hotel.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {hotel.location}
                  </td> */}
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.isActive === true
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {hotel.isActive ? 'ACTIVE' : 'NOT ACTIVE'}
                      </span>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.isPaid === true
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {hotel.isPaid ? 'PAID' : 'PENDING'}
                      </span>
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      ₹{hotel.avgPrice}
                      <span className='text-xs'>/night</span>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      ⭐{hotel.avgRating?.toFixed(1)}
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.hotelPolicy?.[0]?.policyStatus === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : hotel.hotelPolicy?.[0]?.policyStatus ===
                              'REJECTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800' // Default styling for PENDING
                        }`}
                      >
                        {hotel.hotelPolicy?.[0]?.policyStatus || 'N/A'}
                      </span>
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      {hotel.hotelPolicy[0] ? (
                        <button
                          className='cta  px-4 py-1 rounded-md'
                          onClick={() =>
                            showModal(hotel.hotelPolicy[0], hotel.name)
                          }
                        >
                          View Policy
                        </button>
                      ) : (
                        <button className='bg-orange-300 text-white px-4 py-1 rounded-md'>
                          No Policy
                        </button>
                      )}
                    </td>
                    {/* <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                      <button
                        onClick={() => handleEdit(hotel.id)}
                        className='text-blue-600 hover:text-blue-900 mr-3'
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(hotel.id)}
                        className='text-red-600 hover:text-red-900'
                      >
                        <FaTrash size={18} />
                      </button>
                    </td> */}
                    <td className='px-4 py-4 text-center whitespace-nowrap text-sm font-medium'>
                      <Switch
                        checked={hotel.isActive}
                        onChange={(checked) =>
                          toggleHotelActivation(hotel.id, checked)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <p>Data not found</p>
              )}
            </tbody>
          </table>
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
      <Modal
        width={1000}
        footer={null}
        open={isModalOpen}
        onCancel={handleCancel}
      >
        <HotelPolicyForm
          hotelName={hotelName}
          selectedHotelPolicy={selectedHotelPolicy}
        />
      </Modal>
    </>
  );
};

export default AllHotel;
