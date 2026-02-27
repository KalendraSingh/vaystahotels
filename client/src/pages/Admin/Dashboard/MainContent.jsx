import React, { useEffect, useState } from 'react';

import { FaUsers } from 'react-icons/fa';
import { RiHotelLine } from 'react-icons/ri';
import { LuIndianRupee } from 'react-icons/lu';
import { FaBuildingUser } from 'react-icons/fa6';
import { getAllMetrics, getRevenueData } from '../../../../api/Admin/chartData';
import RevenueOverviewChart from './RevenueOverview';

const StatCard = ({ title, value, icon, color }) => (
  <div className='bg-white p-6 flex justify-between  rounded-lg shadow'>
    <div>
      <h3 className='text-sm text-gray-500'>{title}</h3>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
    <div className={`mr-6 ${color}`}>{icon}</div>
  </div>
);

export default function MainContent() {
  const [metrices, setMetrices] = useState(null);
  const [revenueData, setRevenueData] = useState(null);

  useEffect(() => {
    fetchAllMetrices();
    fetchAllRevenueData();
  }, []);

  const fetchAllMetrices = async () => {
    const res = await getAllMetrics();
    setMetrices(res.data);
  };
  const fetchAllRevenueData = async () => {
    const res = await getRevenueData();
    setRevenueData(res.data);
  };

  return (
    <div className='bg-gray-100 min-h-screen p-8'>
      <h1 className='text-2xl font-bold mb-6'>Statistics</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8'>
        <StatCard
          title='Active Users'
          value={metrices && metrices.totalCustomer}
          subtitle='Subtitle'
          color='text-blue-500'
          icon={<FaUsers className='w-8 h-8' />}
        />
        <StatCard
          title='Total Vendors'
          value={metrices && metrices.totalVendor}
          subtitle='Subtitle'
          color='text-gray-700'
          icon={<FaBuildingUser className='w-8 h-8' />}
        />
        <StatCard
          title='Total Hotels'
          value={metrices && metrices.totalHotel}
          subtitle='Subtitle'
          color='text-orange-500'
          icon={<RiHotelLine className='w-8 h-8' />}
        />
        <StatCard
          title='Revenue'
          value={metrices && metrices.totalAmountPaid}
          subtitle='Subtitle'
          color='text-green-500'
          icon={<LuIndianRupee className='w-8 h-8' />}
        />
      </div>

      <div className='grid grid-cols-1  gap-6 mb-8'>
        <div className='lg:col-span-2 bg-white p-4 rounded-lg shadow'>
          <RevenueOverviewChart revenueData={revenueData} />
        </div>
      </div>
    </div>
  );
}
