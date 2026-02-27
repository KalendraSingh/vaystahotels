import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Progress } from 'antd';
const COLORS = ['#4CAF50', '#FF5733'];

const CheckInCheckOutCard = () => {
  const [checkedInRooms, setCheckedInRooms] = useState(120);
  const [checkedOutRooms, setCheckedOutRooms] = useState(90);
  const [pendingCheckIns, setPendingCheckIns] = useState(30);
  const [pendingCheckOuts, setPendingCheckOuts] = useState(40);

  useEffect(() => {
    const fetchCheckInCheckOutData = async () => {
      try {
        const response = await fetch('/api/check-in-out-data');
        const data = await response.json();
        setCheckedInRooms(data.checkedInRooms);
        setCheckedOutRooms(data.checkedOutRooms);
        setPendingCheckIns(data.pendingCheckIns);
        setPendingCheckOuts(data.pendingCheckOuts);
      } catch (error) {
        console.error('Error fetching check-in/check-out data:', error);
      }
    };

    fetchCheckInCheckOutData();
  }, []);

  const totalRooms = checkedInRooms + checkedOutRooms;
  const checkInPercentage = (checkedInRooms / totalRooms) * 100;
  const checkOutPercentage = (checkedOutRooms / totalRooms) * 100;
  const chartData = [
    { name: 'Checked In', value: checkedInRooms },
    { name: 'Checked Out', value: checkedOutRooms },
  ];

  return (
    <div className='bg-white rounded-lg shadow-md p-4'>
      <h2 className='text-sm font-medium mb-4'>Today Check-In / Check-Out</h2>
      <div className='flex  gap-6 mt-6'>
        <div className='text-center'>
          <h3 className='text-sm text-gray-400'>Checked In</h3>
          <div className='text-2xl font-semibold text-sky-500'>
            {checkedInRooms}
          </div>
        </div>
        <div className='text-center'>
          <h3 className='text-sm text-gray-400'>Checked Out</h3>
          <div className='text-2xl font-semibold text-rose-500'>
            {checkedOutRooms}
          </div>
        </div>
      </div>

      <ResponsiveContainer width='100%' height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx='50%'
            cy='50%'
            labelLine={false}
            outerRadius={100}
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
