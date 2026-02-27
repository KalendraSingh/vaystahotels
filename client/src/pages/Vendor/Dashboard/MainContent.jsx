import React, { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import Charts from './Charts';
import CalendarRatingCard from './CalendarRatingCard';
import {
  getAllAvailableRooms,
  getBookingSummary,
} from '../../../../api/Vendor/BookingApi';
import { useAuth } from '../../../Hooks/useAuth';

const MainContent = () => {
  const { vendorAuth } = useAuth();
  let vendorId = null;
  if (vendorAuth?.data.role === 'vendorStaff') {
    vendorId = vendorAuth && vendorAuth.data?.vendorId;
  } else {
    vendorId = vendorAuth && vendorAuth.data.id;
  }

  const [allRooms, setAllRooms] = useState(null);
  const [bookingSummary, setBookingSummary] = useState(null);

  console.log('allRooms', allRooms);
  console.log('bookingSummary', bookingSummary);

  useEffect(() => {
    fetchAllAvailableRooms();
    fetchAllBookingsSummary();
  }, []);

  const fetchAllAvailableRooms = async () => {
    try {
      const res = await getAllAvailableRooms(vendorId);
      if (res.status === 200) {
        console.log(res);
        setAllRooms(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchAllBookingsSummary = async () => {
    try {
      const res = await getBookingSummary(vendorId);
      if (res.status === 200) {
        console.log(res);
        setBookingSummary(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className='flex-1'>
      <div className='px-4 py-4'>
        <DashboardStats bookingSummary={bookingSummary} />
        <Charts bookingSummary={bookingSummary} />
        {/* <CalendarRatingCard /> */}
      </div>
    </main>
  );
};

export default MainContent;
