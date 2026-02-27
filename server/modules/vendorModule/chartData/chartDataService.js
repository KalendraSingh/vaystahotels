import prisma from '../../../config/db.js';
import {
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  format,
} from 'date-fns';

export const getDashboardMetrics = async () => {
  try {
    // Fetch total active customers
    const totalActiveCustomers = await prisma.customer.count({
      where: {
        isActive: true,
      },
    });

    // Fetch total active vendors
    const totalActiveVendors = await prisma.vendor.count({
      where: {
        isActive: true,
      },
    });

    // Fetch total active hotels
    const totalActiveHotels = await prisma.hotel.count({
      where: {
        isActive: true,
      },
    });

    // Fetch total amount paid by vendors with status 'PAID'
    const totalPaidAmount = await prisma.vendorPayment.aggregate({
      _sum: {
        amount: true,
      },
      where: {
        isPaid: true,
      },
    });

    return {
      totalCustomer: totalActiveCustomers,
      totalVendor: totalActiveVendors,
      totalHotel: totalActiveHotels,
      totalAmountPaid: totalPaidAmount._sum.amount || 0, // Default to 0 if no data
    };
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    throw new Error('Internal Server Error');
  }
};

const getWeekNumber = (date) => {
  const startDate = new Date(date.getFullYear(), 0, 1);
  const diff = date - startDate;
  const oneDay = 1000 * 60 * 60 * 24;
  const days = Math.floor(diff / oneDay);
  return Math.ceil(days / 7);
};

export const getRevenueData = async () => {
  try {
    const today = new Date();

    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() - i);
      const dayOfWeek = format(day, 'E');
      const dailyRevenue = await prisma.vendorPayment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: {
            gte: new Date(day.setHours(0, 0, 0, 0)),
            lt: new Date(day.setHours(23, 59, 59, 999)),
          },
        },
      });
      dailyData.push({
        day: dayOfWeek,
        revenue: dailyRevenue._sum.amount || 0,
      });
    }

    const weeklyData = [];
    for (let i = 0; i < 4; i++) {
      const startOfWeekDate = startOfWeek(
        today.setDate(today.getDate() - i * 7)
      );
      const endOfWeekDate = endOfWeek(startOfWeekDate);

      const weeklyRevenue = await prisma.vendorPayment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: {
            gte: startOfWeekDate,
            lt: endOfWeekDate,
          },
        },
      });

      weeklyData.push({
        week: `Week ${getWeekNumber(startOfWeekDate)}`,
        revenue: weeklyRevenue._sum.amount || 0,
      });
    }

    const currentMonth = today.getMonth();
    const monthlyData = [];

    for (let i = 0; i <= currentMonth; i++) {
      const month = new Date();
      month.setMonth(i);
      const startOfMonthDate = startOfMonth(month);
      const endOfMonthDate = endOfMonth(month);

      const monthlyRevenue = await prisma.vendorPayment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: {
            gte: startOfMonthDate,
            lt: endOfMonthDate,
          },
        },
      });

      monthlyData.push({
        month: format(startOfMonthDate, 'MMMM'),
        revenue: monthlyRevenue._sum.amount || 0,
      });
    }

    return {
      dailyData,
      weeklyData,
      monthlyData,
    };
  } catch (error) {
    console.error('Error fetching revenue data:', error);
    throw new Error('Internal Server Error');
  }
};

export const getHotelsData = async () => {
  try {
    const hotels = await prisma.hotel.findMany({
      select: {
        name: true,
        city: true,
        latitude: true,
        longitude: true,
      },
    });
    return hotels;
  } catch (error) {
    console.error('Error fetching hotels data:', error);
    throw new Error('Internal Server Error');
  }
};
