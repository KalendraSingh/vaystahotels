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

const RevenueOverviewChart = ({ revenueData }) => {
  console.log('revenueData', revenueData);

  // State to track which data view to show (day, week, or month)
  const [view, setView] = useState('day');

  return (
    <div className='chart-container'>
      <div className='flex justify-between'>
        <h2 className='text-xl  font-semibold text-center mb-4'>
          Revenue Overview
        </h2>
        <div className='flex justify-center mb-6'>
          <button
            onClick={() => setView('day')}
            className={`px-2 py-1 mr-2   rounded-md ${
              view === 'day'
                ? 'bg-color text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-2 py-1  mr-2 rounded-md ${
              view === 'week'
                ? 'bg-color text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setView('month')}
            className={`px-2 py-1   rounded-md ${
              view === 'month'
                ? 'bg-color text-white'
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>
      <ResponsiveContainer width='100%' height={400}>
        <LineChart
          data={
            view === 'day'
              ? revenueData && revenueData.dailyData
              : view === 'week'
              ? revenueData && revenueData.weeklyData
              : revenueData && revenueData.monthlyData
          }
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray='3 3' stroke='#e0e0e0' />
          <XAxis
            dataKey={
              view === 'day' ? 'day' : view === 'week' ? 'week' : 'month'
            }
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
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
  );
};

export default RevenueOverviewChart;
