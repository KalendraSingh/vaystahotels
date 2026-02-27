import { Modal, notification } from 'antd';
import { useEffect, useState } from 'react';
import { FaEdit, FaExternalLinkAlt, FaSort, FaTrash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import {
  deleteHotelAPI,
  getAllHotelsByVendor,
} from '../../../../api/Vendor/HotelApi';
import {
  initiatePayment,
  verifyPayment,
} from '../../../../api/Vendor/PaymentApi';
import { useAuth } from '../../../Hooks/useAuth';
import { getVendorProfile } from '../../../../api/Vendor/profileApi';
import HotelImages from './HotelImages';
import HotelDetailsInfo from './HotelDetails';
import Categories from './Categories';
import CategoryDetails from './CategoryDetails';

const AllHotel = () => {
  const navigate = useNavigate();
  // payment starts here
  const handlePayNowClick = async (hotelId) => {
    handlePayment(hotelId);
    // console.log('Pay Now clicked for hotel:', hotelId);
  };
  const [hotelId, setHotelId] = useState('');
  const [paymentAmount] = useState(15000);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [hotelDetails, setHotelDetails] = useState(false);
  const [hotelImages, setHotelImages] = useState(false);
  const [hotelCategory, setHotelCategory] = useState(false);

  const handlePayment = async (hotelId) => {
    try {
      const paymentData = await initiatePayment(
        vendorId,
        hotelId,
        paymentAmount
      );

      if (paymentData?.order) {
        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: paymentData.order.amount,
          currency: 'INR',
          name: 'Hotel Booking',
          description: 'Hotel payment for activation',
          order_id: paymentData.order.id,
          handler: async function (response) {
            const paymentVerification = await verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              vendorId,
              hotelId,
            });

            if (paymentVerification?.message) {
              notification.success({ message: paymentVerification.message });
              fetchAllHotelsData();
            } else {
              notification.error({ message: 'Payment verification failed' });
              fetchAllHotelsData();
            }
          },
          prefill: {
            name: vendorDetails && vendorDetails.name,
            email: vendorDetails && vendorDetails.email,
            contact: vendorDetails && vendorDetails.phone,
          },
          theme: {
            color: '#F86800',
          },
        };

        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        notification.error({ message: 'Payment verification failed' });
        fetchAllHotelsData();
      }
    } catch (error) {
      console.error('Payment Error:', error);
      fetchAllHotelsData();
      notification.error({ message: 'Payment verification failed' });
    }
  };

  //payment ends here

  const [openDropdown, setOpenDropdown] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [hotelsData, setHotelsData] = useState(null);

  const { vendorAuth } = useAuth();

  // const vendorDetails = vendorAuth && vendorAuth.data;

  const [vendorDetails, setVendorDetails] = useState(null);

  const [vendorId, setVendorId] = useState(null);

  useEffect(() => {
    if (vendorAuth.data.role === 'vendorStaff') {
      setVendorId(vendorAuth.data.vendorId);
      const getVendorById = async () => {
        try {
          const res = await getVendorProfile(vendorId);
          if (res.status === 200) {
            setVendorDetails(res.data);
          }
        } catch (error) {
          console.log(error);
        }
      };
      getVendorById();
    } else {
      setVendorId(vendorAuth && vendorAuth.data.id);
      setVendorDetails(vendorAuth && vendorAuth.data);
    }
  }, [vendorAuth]);
  // console.log('hotelsData', hotelsData);
  // console.log('vendorId', vendorId);

  const fetchAllHotelsData = async () => {
    // const filterData = {
    //   searchTerm,
    //   startDate,
    //   endDate,
    //   guests,
    //   latitude,
    //   longitude,
    //   filterData: {
    //     price: filters.priceRange[1],
    //     rating: filters.selectedRating,
    //     amenities: filters.amenities,
    //   },
    // };
    try {
      const res = await getAllHotelsByVendor(vendorId);
      if (res.status === 200) {
        setHotelsData(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllHotelsData();
  }, [vendorId]);

  const toggleDropdown = (label) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const handleOptionSelect = (label, option) => {
    setSelectedOptions({ ...selectedOptions, [label]: option });
    setOpenDropdown(null);
  };

  const [hotels, setHotels] = useState([]);

  const [selectedHotel, setSelectedHotel] = useState(null);
  const [selectedModal, setSelectedModal] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedHotelImages, setSelectedHotelImages] = useState(null);
  const [selectedHotelCategories, setSelectedHotelCategories] = useState(null);

  const [filteredHotels, setFilteredHotels] = useState(hotels);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending',
  });

  const [filters, setFilters] = useState({
    name: '',
    minRating: 0,
    maxPrice: '',
  });

  useEffect(() => {
    let result = hotels;

    if (filters.name) {
      result = result.filter((hotel) =>
        hotel.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.minRating > 0) {
      result = result.filter((hotel) => hotel.rating >= filters.minRating);
    }

    if (filters.maxPrice) {
      result = result.filter((hotel) => hotel.price <= filters.maxPrice);
    }

    setFilteredHotels(result);
  }, [filters, hotels]);

  const handleEdit = (id) => {
    console.log('Edit hotel with id:', id);
  };

  const [deleteHotelModal, setDeleteHotelModal] = useState(false);

  const handleDelete = async () => {
    try {
      const res = await deleteHotelAPI(selectedHotel.id);
      console.log(res);
      setDeleteHotelModal(false);
    } catch (error) {
      setDeleteHotelModal(false);
      console.log(error);
    }
    setSelectedHotel(null);
    fetchAllHotelsData();
  };

  const handleCancel = () => {
    setSelectedModal(false);
  };

  const handleHotelDetails = (hotelId) => {
    setSelectedModal(true);
    setHotelDetails(true);
    setHotelCategory(false);
    setHotelImages(false);
    setSelectedHotelId(hotelId);
  };
  const handleHotelImages = (Images, hotelId) => {
    setSelectedModal(true);
    setHotelDetails(false);
    setHotelCategory(false);
    setHotelImages(true);
    setSelectedHotelImages(Images);
    setSelectedHotelId(hotelId);
  };

  const handleHotelCategories = (categories) => {
    setSelectedModal(true);
    setHotelDetails(false);
    setHotelCategory(true);
    setHotelImages(false);
    setSelectedHotelCategories(categories);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });

    setFilteredHotels((prevHotels) =>
      [...prevHotels].sort((a, b) => {
        if (a[key] < b[key]) return direction === 'ascending' ? -1 : 1;
        if (a[key] > b[key]) return direction === 'ascending' ? 1 : -1;
        return 0;
      })
    );
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({ ...prevFilters, [name]: value }));
  };

  return (
    <>
      <div className=''>
        <h1 className='text-3xl font-bold mb-6'>Hotel Management</h1>

        <div className='flex w-max items-center justify-end gap-4 mb-6'>
          <div>
            <button
              onClick={() => {
                navigate('/vendor-dashboard/addHotel');
              }}
              className='gap-1 self-stretch px-4 py-2 font-medium text-white cta rounded min-h-[36px]'
            >
              + Add new Property
            </button>
          </div>
        </div>
        <div className='bg-white p-4 '>
          <table className=' shadow-md rounded-lg relative'>
            <thead className='bg-gray-100 sticky top-0'>
              <tr className='relative '>
                <th
                  className='px-4 sticky bg-gray-100 left-0 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => handleSort('name')}
                >
                  Property Information{' '}
                  {sortConfig.key === 'name' && <FaSort className='inline' />}
                </th>
                {/* <th
                  className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => handleSort('category')}>
                  Address{' '}
                  {sortConfig.key === 'category' && (
                    <FaSort className='inline' />
                  )}
                </th> */}
                <th className='px-4 py-3 text-left text-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'>
                  Property Type{' '}
                </th>
                <th
                  className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => handleSort('status')}
                >
                  ISActive{' '}
                  {sortConfig.key === 'status' && <FaSort className='inline' />}
                </th>

                <th
                  className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer'
                  onClick={() => handleSort('price')}
                >
                  Payment{' '}
                  {sortConfig.key === 'price' && <FaSort className='inline' />}
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-nowrap tracking-wider'>
                  Avg Price
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-nowrap tracking-wider'>
                  Avg Rating
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-nowrap tracking-wider'>
                  Hotel Details
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-nowrap tracking-wider'>
                  Hotel Images
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-nowrap tracking-wider'>
                  Categories
                </th>

                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase text-nowrap tracking-wider'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody className='divide-y  divide-gray-200 overflow-auto'>
              {hotelsData &&
                hotelsData.map((hotel) => (
                  <tr key={hotel.id} className='relative'>
                    <td className='px-4 py-4 bg-white w-max sticky left-0 whitespace-nowrap'>
                      <div className='flex items-center w-max'>
                        <img
                          className='h-10 w-10 rounded-full object-cover mr-3'
                          src={hotel.bannerImage}
                          alt={hotel.name}
                        />
                        <div>
                          <Link
                            to={`/hotelDetailed/${hotel.id}`}
                            className='text-sm font-medium flex items-center hover:text-blue-600 cursor-pointer text-gray-900'
                          >
                            {hotel.name}
                            <FaExternalLinkAlt className='inline ml-2' />
                          </Link>
                          <div className='text-sm text-gray-500'>
                            {hotel.city}, {hotel.state}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className='px-4 py-4 capitalize whitespace-nowrap text-sm text-gray-500'>
                      {hotel.type}
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap'>
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.isActive === true
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {hotel.isActive ? 'ACTIVE' : 'NOT ACTIVE'}
                      </span>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap space-y-2'>
                      {/* Payment Status */}
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          hotel.isPaid
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {hotel.isPaid ? 'PAID' : 'PENDING'}
                      </span>

                      {/* Pay Now Button */}
                      {hotel.hotelPolicy[0]?.policyStatus === 'APPROVED' &&
                        !hotel.isPaid && (
                          <button
                            onClick={() => handlePayNowClick(hotel.id)}
                            className='text-white hover:text-green-600 hover:bg-white bg-green-700 border border-green-600 rounded-full px-2 block'
                          >
                            Pay Now
                          </button>
                        )}
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      ₹{hotel.avgPrice}
                      <span className='text-xs'>/night</span>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      ⭐{hotel.avgRating && hotel.avgRating?.toFixed(1)}
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <button
                        onClick={() => handleHotelDetails(hotel.id)}
                        className='cta text-white px-2 py-1 flex items-center gap-2 rounded-xl'
                      >
                        View Details <FaEdit size={14} />
                      </button>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <button
                        onClick={() =>
                          handleHotelImages(hotel.hotelImages, hotel.id)
                        }
                        className='cta text-white px-2 py-1 flex items-center gap-2 rounded-xl'
                      >
                        View Hotel Images <FaEdit size={14} />
                      </button>
                    </td>
                    <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                      <button
                        onClick={() =>
                          handleHotelCategories(hotel.RoomCategories)
                        }
                        className='cta text-white px-2 py-1 flex items-center gap-2 rounded-xl'
                      >
                        View Categories <FaEdit size={14} />{' '}
                      </button>
                    </td>

                    <td className='px-4 py-4 whitespace-nowrap text-sm font-medium'>
                      {/* <button
                        onClick={() => handleEdit(hotel.id)}
                        className='text-blue-600 hover:text-blue-900 mr-3'
                      >
                        <FaEdit size={18} />
                      </button> */}
                      <button
                        onClick={() => {
                          setDeleteHotelModal(true);
                          setSelectedHotel(hotel);
                        }}
                        className='text-red-600 hover:text-red-900'
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {deleteHotelModal && (
        <Modal
          title='Delete Hotel'
          open={deleteHotelModal}
          onOk={handleDelete}
          onCancel={() => {
            setDeleteHotelModal(false);
            setSelectedHotel(null);
          }}
          okText='Delete'
          cancelText='Cancel'
          okButtonProps={{
            style: {
              backgroundColor: 'red',
              borderColor: 'red',
              color: 'white',
            },
          }}
          cancelButtonProps={{
            style: {
              backgroundColor: 'gray',
              borderColor: 'gray',
              color: 'white',
            },
          }}
        >
          <p>Are you sure you want to delete this hotel?</p>
        </Modal>
      )}

      <Modal
        width={1000}
        open={selectedModal}
        onCancel={handleCancel}
        footer={null}
      >
        {hotelDetails && <HotelDetailsInfo hotelId={selectedHotelId} />}

        {hotelImages && (
          <HotelImages
            hotelImageData={selectedHotelImages}
            hotelId={selectedHotelId}
          />
        )}
        {hotelCategory && (
          <Categories selectedHotelCategories={selectedHotelCategories} />
        )}
        {/* 
        <CategoryDetails /> */}
      </Modal>
    </>
  );
};

export default AllHotel;
