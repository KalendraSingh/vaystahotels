import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { getBookingsChartData } from '../../../../api/Vendor/BookingApi';
import { useAuth } from '../../../Hooks/useAuth';

const BookingRevenueChart = () => {
  const { vendorAuth } = useAuth();
  let vendorId = null;
  if (vendorAuth?.data.role === 'vendorStaff') {
    vendorId = vendorAuth && vendorAuth.data?.vendorId;
  } else {
    vendorId = vendorAuth && vendorAuth.data.id;
  }
  const [chartData, setChartData] = useState(null);

  console.log('chartData', chartData);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const res = await getBookingsChartData(vendorId);
    setChartData(res.data);
  };

  const [isWeekly, setIsWeekly] = useState(true);

  return (
    <div className='chart-container'>
      <div className='bg-white'>
        <div className='flex gap-4 items-center p-2'>
          <h2 className=' text-[12px] md:text-[18px] font-semibold text-start mb-4'>
            Bookings & Revenue
          </h2>
          <div className='flex gap-2 justify-start mb-6'>
            <button
              onClick={() => setIsWeekly(true)}
              className={`px-4  ${
                isWeekly ? 'bg-color text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Last Week
            </button>
            <button
              onClick={() => setIsWeekly(false)}
              className={`px-4  ${
                !isWeekly ? 'bg-color text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Last Month
            </button>
          </div>
        </div>
        <ResponsiveContainer width='100%' height={330}>
          <LineChart
            data={
              isWeekly
                ? chartData && chartData.weeklyData
                : chartData && chartData.monthlyData
            }
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
            <XAxis
              dataKey={isWeekly ? 'day' : 'week'}
              tick={{ fontSize: 12 }}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Line
              type='monotone'
              dataKey='bookings'
              stroke='#4285F4'
              strokeWidth={2}
              activeDot={{ r: 8 }}
              name='Bookings'
            />
            <Line
              type='monotone'
              dataKey='revenue'
              stroke='#34A853'
              strokeWidth={2}
              name='Revenue'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BookingRevenueChart;
