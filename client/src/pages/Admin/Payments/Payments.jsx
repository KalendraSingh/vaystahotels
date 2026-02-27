import React, { useEffect, useState } from 'react';
import { CreditCard, Download, Edit2, RefreshCcw } from 'lucide-react';
import { adminGetAllPayments } from '../../../../api/Admin/paymentAPI';
import { Pagination } from 'antd';
import DataLoading from '../../../components/DataLoading/DataLoading';

const Card = ({ children, className }) => (
  <div className={`bg-white shadow-md rounded-lg ${className}`}>{children}</div>
);

const Select = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className='border border-gray-300 rounded-md p-2 w-full'
  >
    <option value=''>{placeholder}</option>
    {options.map((option) => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    ))}
  </select>
);

const Input = ({ value, onChange, placeholder, type = 'text' }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className='border border-gray-300 rounded-md p-2 w-full'
  />
);

const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const baseStyle = 'font-semibold rounded-md transition-colors duration-200';
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
    ghost: 'text-gray-700 hover:bg-gray-100',
  };
  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  return (
    <button
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};

const Badge = ({ children, className }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${className}`}>
    {children}
  </span>
);

const PaymentManagement = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [amountFilter, setAmountFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [payments, setPayments] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(null);
  const [debouncedValue, setDebouncedValue] = useState(nameFilter);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(nameFilter), 300);
    return () => clearTimeout(handler);
  }, [nameFilter, 300]);

  useEffect(() => {
    getAllPayments();
  }, [debouncedValue, page, pageSize]);

  const onPageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };

  const getAllPayments = async () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
      vendorName: nameFilter,
      status: statusFilter,
      page,
      pageSize,
    };

    try {
      setIsLoading(true);
      const res = await adminGetAllPayments(data);
      console.log(res.data);
      setIsLoading(false);
      setPayments(res.data.data);
      setTotalAmount(res.data.totalAmount);
      setTotalItems(res.data.pagination.total);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const currentDate = new Date().toLocaleDateString();

  useEffect(() => {
    getAllPayments();
  }, [amountFilter, statusFilter, startDate, endDate]);

  return (
    <>
      <div className='container mx-auto p-4 max-w-6xl'>
        <h1 className='text-2xl font-bold mb-6'>Payment Management</h1>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <Card>
            <div className='p-4'>
              <h2 className='text-sm text-gray-500 mb-2'>Total Earnings</h2>
              <p className='text-2xl font-bold text-green-500'>
                ₹{totalAmount}
              </p>
              <p className='text-xs text-gray-500'>as of {currentDate}</p>
            </div>
          </Card>
        </div>

        <div className='flex flex-wrap justify-between items-center mb-4 gap-4'>
          <p className='text-sm font-semibold'>
            Results: {payments && payments.length}
          </p>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full'>
            <Input
              value={nameFilter}
              onChange={setNameFilter}
              placeholder='Filter by name'
            />
            <div className='flex items-center gap-2'>
              <Input
                value={startDate}
                onChange={setStartDate}
                placeholder='Start Date'
                type='date'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='endDate'>To:</label>
              <Input
                value={endDate}
                onChange={setEndDate}
                placeholder='End Date'
                type='date'
              />
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: '', label: 'All' },
                { value: 'PAID', label: 'Success' },
                { value: 'FAILED', label: 'Failed' },
                { value: 'PENDING', label: 'Pending' },
              ]}
              placeholder={'Filter by status'}
            />
            <div className='flex items-center gap-2 '>
              <button className='cta px-4 py-2 rounded-md' onClick={()=>{setAmountFilter(''),setEndDate(''), setNameFilter(''),setStartDate(''), setStatusFilter('')}}>Clear</button>
            </div>
          </div>
        </div>

        <Card>
          <div className='overflow-x-auto'>
            <table className='w-full'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Username
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Amount
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Payment Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Payment Status
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Payment Method
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {isLoading ? (
                  <div className='md:ml-[450px]'>
                    <DataLoading />
                  </div>
                ) : payments && payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id}>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {payment.vendor.name + ' ' + payment.vendor.lastName}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        ₹{payment.amount.toFixed(2)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        {payment.createdAt.split('T')[0]}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <Badge className={getStatusColor(payment.status)}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center gap-2'>
                          <CreditCard className='h-4 w-4' />
                          {payment.method || 'N/A'}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan='6' className='text-center py-4'>
                      No Payments Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
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
};

export default PaymentManagement;
