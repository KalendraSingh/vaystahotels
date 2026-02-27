import React, { useState } from 'react';
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
import HotelCard from './HotelCard';

function RevenueOverview() {
  const [chartData, setChartData] = useState([
    { name: 'Jan', revenue: 4000 },
    { name: 'Feb', revenue: 3000 },
    { name: 'Mar', revenue: 5000 },
    { name: 'Apr', revenue: 4500 },
    { name: 'May', revenue: 6000 },
    { name: 'Jun', revenue: 5500 },
    { name: 'Jul', revenue: 7000 },
  ]);
  const [filterPeriod, setFilterPeriod] = useState('month');
  const [showDetails, setShowDetails] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleFilter = () => {
    const filteredData = chartData.map((item) => ({
      ...item,
      revenue: Math.floor(Math.random() * 10000),
    }));
    setChartData(filteredData);
  };

  const handlePeriodChange = (period) => {
    setFilterPeriod(period);
    const newData = chartData.map((item) => ({
      ...item,
      revenue: Math.floor(Math.random() * 10000),
    }));
    setChartData(newData);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  const details = [
    { title: 'Booking Rooms', amount: 12500 },
    { title: 'Foods & Parties', amount: 8750 },
    { title: 'Other Activities', amount: 3200 },
    { title: 'Total Revenue', amount: 24450 },
  ];

  const hotel = {
    name: 'The Peninsula London',
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/f318bcd1deb51dec8a8376cb7c51f75470a14c70a0791fa4a325b261d212aed7?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    address: '1 Grosvenor Pl, London SW1X 7HJ, United Kingdom',
    bookings: 825,
    bookingsPercentage: 24,
    revenue: '$82k',
    revenuePercentage: 24,
    expense: '$82k',
    expensePercentage: 8,
    profit: '$82k',
    profitPercentage: 24,
  };
  return (
    <>
      <section>
        <HotelCard hotel={hotel} />
        <HotelCard hotel={hotel} />
      </section>
      <section className='flex flex-col text-xl font-medium rounded-none text-zinc-700'>
        <div className='flex flex-col px-5 pt-4 pb-11 w-full bg-white rounded-lg fill-white max-md:pl-5 max-md:max-w-full'>
          <h2 className='self-start'>Revenue Overview - Peninsula London</h2>
          <div className='flex items-center space-x-4 mt-4'>
            <input
              type='date'
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className='border rounded px-2 py-1'
              aria-label='Start Date'
            />
            <input
              type='date'
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className='border rounded px-2 py-1'
              aria-label='End Date'
            />
            <button
              onClick={handleFilter}
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50'
            >
              Filter
            </button>
            <div className='flex space-x-2'>
              {['day', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => handlePeriodChange(period)}
                  className={`px-3 py-1 rounded focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 ${
                    filterPeriod === period
                      ? 'bg-gray-300'
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <div className='mt-4 w-full h-64'>
            <ResponsiveContainer width='100%' height='100%'>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type='monotone'
                  dataKey='revenue'
                  stroke='#8884d8'
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          {showDetails && (
            <div className='mt-8'>
              <h3 className='text-lg font-semibold mb-4'>
                Revenue Details for {filterPeriod}
              </h3>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                {details.map((detail) => (
                  <div key={detail.title} className='bg-gray-100 p-4 rounded'>
                    <h4 className='font-medium mb-2'>{detail.title}</h4>
                    <p className='text-2xl font-bold'>
                      ${detail.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <button
            className='mt-4 text-blue-600 hover:text-blue-800 focus:outline-none focus:underline'
            onClick={toggleDetails}
          >
            {showDetails ? 'View Fewer Details' : 'View More Details'}
          </button>
        </div>
      </section>
    </>
  );
}

export default RevenueOverview;
