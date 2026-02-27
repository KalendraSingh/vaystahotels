import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const COLORS = ['#4CAF50', '#FF5733'];

const CheckInCheckOutCard = ({ checkInsToday, checkOutsToday }) => {
  const chartData = [
    { name: 'Checked In', value: checkInsToday },
    { name: 'Checked Out', value: checkOutsToday },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <h2 className='text-sm font-medium mb-4'>Today Check-In / Check-Out</h2>
      <div className='flex  gap-6 mt-6'>
        <div className='text-center'>
          <h3 className='text-sm text-gray-400'>Checked In</h3>
          <div className='text-2xl font-semibold text-green-500'>
            {checkInsToday}
          </div>
        </div>
        <div className='text-center'>
          <h3 className='text-sm text-gray-400'>Checked Out</h3>
          <div className='text-2xl font-semibold text-rose-500'>
            {checkOutsToday}
          </div>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={80}
            fill='#8884d8'
            dataKey='value'
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CheckInCheckOutCard;
