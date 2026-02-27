import { useEffect, useState } from 'react';
import {
  getAllHotelsByVendor,
  getAllTransactionsAPI,
} from '../../../../api/Vendor/HotelApi';
import { useAuth } from '../../../Hooks/useAuth';

const VendorTransactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const { vendorAuth } = useAuth();
  const vendorDetail = vendorAuth && vendorAuth.data;
  const [hotelsData, setHotelsData] = useState([]);

  const getAllTransactions = async () => {
    try {
      const response = await getAllTransactionsAPI(
        vendorDetail && vendorDetail.id
      );
      console.log(response.data);
      setAllTransactions(response.data);
    } catch (error) {
      console.error('Error in VendorTransactions:', error);
    }
  };

  const fetchAllHotel = async () => {
    try {
      const res = await getAllHotelsByVendor(vendorDetail.id);
      if (res.status === 200) {
        console.log(res.data);
        setHotelsData(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTransactions();
    fetchAllHotel();
  }, []);

  return (
    <div className='overflow-x-auto bg-gray-100 p-8 rounded-lg shadow-lg'>
      {allTransactions.length === 0 ? (
        <div className='flex justify-center items-center h-96'>
          <h1 className='text-2xl font-semibold text-gray-500'>
            No Transactions Found
          </h1>
        </div>
      ) : (
        <table className='min-w-full bg-white border border-gray-200 rounded-lg'>
          <thead className='bg-gray-400 text-white'>
            <tr>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                ID
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Hotel Name
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Amount
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Status
              </th>
              <th className='px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider'>
                Initiated At
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {allTransactions.map((data) => (
              <tr key={data.id} className='hover:bg-gray-100 transition-colors'>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium'>
                  {data.id.slice(0, 7).toUpperCase()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {hotelsData.find((hotel) => hotel.id === data.hotelId)
                    ?.name || 'Unknown'}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  &#8377;{data.amount.toLocaleString()}
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm'>
                  <span
                    className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${
                      data.status === 'PAID'
                        ? 'bg-green-100 text-green-800'
                        : data.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {data.status}
                  </span>
                </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                  {new Date(data.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default VendorTransactions;
