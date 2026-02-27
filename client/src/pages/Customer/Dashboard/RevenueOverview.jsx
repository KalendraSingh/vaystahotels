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

const data = [
  { name: 'Jan', bookings: 400, revenue: 2400, expense: 2000, profit: 400 },
  { name: 'Feb', bookings: 300, revenue: 1398, expense: 1000, profit: 398 },
  { name: 'Mar', bookings: 200, revenue: 9800, expense: 8000, profit: 1800 },
  { name: 'Apr', bookings: 278, revenue: 3908, expense: 3000, profit: 908 },
  { name: 'May', bookings: 189, revenue: 4800, expense: 4000, profit: 800 },
  { name: 'Jun', bookings: 239, revenue: 3800, expense: 3000, profit: 800 },
  { name: 'Jul', bookings: 349, revenue: 4300, expense: 3500, profit: 800 },
];

const StatItem = ({ label, value, percentage, isPositive }) => (
  <div className='flex flex-col'>
    <div className='self-start text-sm text-gray-400'>{label}</div>
    <div className='flex gap-1 items-center mt-3'>
      <div className='grow self-stretch my-auto text-sm font-medium text-neutral-800'>
        {value}
      </div>
      <svg
        className={`w-2 h-2 ${
          isPositive ? 'text-emerald-500' : 'text-rose-500'
        }`}
        viewBox='0 0 8 8'
        fill='none'
        xmlns='http://www.w3.org/2000/svg'
      >
        <path
          d={isPositive ? 'M4 0L8 8H0L4 0Z' : 'M4 8L0 0H8L4 8Z'}
          fill='currentColor'
        />
      </svg>
      <div
        className={`self-stretch text-xs font-bold leading-none ${
          isPositive ? 'text-emerald-500' : 'text-rose-500'
        }`}
      >
        {percentage}%
      </div>
    </div>
  </div>
);

function RevenueOverview() {
  const [timeFrame, setTimeFrame] = useState('Month');

  return (
    <div className='flex flex-col'>
      <div className='flex flex-col px-5 pt-3.5 pb-1.5 w-full bg-white rounded-lg fill-white max-md:pl-5 max-md:max-w-full'>
        <div className='flex flex-wrap gap-10 w-full max-md:mr-1 max-md:max-w-full'>
          <div className='text-xl font-medium text-zinc-700'>
            Revenue Overview
          </div>
        </div>
        <div className='flex flex-wrap gap-10 self-start mt-7 text-center whitespace-nowrap max-md:max-w-full'>
          <StatItem
            label='Bookings'
            value='825'
            percentage='24'
            isPositive={true}
          />
          <div className='shrink-0 my-auto w-px border border-solid border-slate-200 h-[31px]' />
          <StatItem
            label='Revenue'
            value='$82k'
            percentage='24'
            isPositive={true}
          />
          <div className='shrink-0 my-auto w-px border border-solid border-slate-200 h-[31px]' />
          <StatItem
            label='Expense'
            value='$82k'
            percentage='8'
            isPositive={false}
          />
          <div className='shrink-0 my-auto w-px border border-solid border-slate-200 h-[31px]' />
          <StatItem
            label='Profit'
            value='$82k'
            percentage='24'
            isPositive={true}
          />
        </div>
        <div className='mt-12 w-full h-64 max-md:mt-10 max-md:max-w-full'>
          <ResponsiveContainer width='100%' height='100%'>
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Line
                type='monotone'
                dataKey='bookings'
                stroke='#8884d8'
                activeDot={{ r: 8 }}
              />
              <Line type='monotone' dataKey='revenue' stroke='#82ca9d' />
              <Line type='monotone' dataKey='expense' stroke='#ffc658' />
              <Line type='monotone' dataKey='profit' stroke='#ff7300' />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export default RevenueOverview;
