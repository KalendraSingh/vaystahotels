import React, { useEffect, useState } from 'react';
import {
  Wifi,
  Car,
  Coffee,
  School as Pool,
  Dumbbell,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  Mail,
  Plus,
  Minus,
  Users,
} from 'lucide-react';

import { getHotelById } from '../../../api/Public/HotelApi';
import { addRoomToCart, getRoomToCart } from '../../../api/Customer/cartApi';

import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Hooks/useAuth';
import RoomDetails from './RoomDetails';

function HotelDetailed() {
  const [hotel, setHotel] = useState();
  const [hotelImages, setHotelImages] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('select-room');
  const [cartData, setCartData] = useState(null);
  const { auth } = useAuth();
  const { hotelId } = useParams();

  const customerId = auth?.data && auth?.data.id;

  console.log('hotel details==>', hotel);
  console.log('hotel hotelId==>', hotelId);
  console.log('hotel auth==>', auth);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    fetchHotel();
  }, []);

  const fetchHotel = async () => {
    try {
      const res = await getHotelById(hotelId);
      if (res.status === 200) {
        const hotelData = res.data;
        setHotel(hotelData);
        setHotelImages(
          hotelData?.hotelImages?.flatMap((imageObj) => imageObj.imageUrls),
        );
      }
    } catch (error) {
      console.log('Failed to fetch hotel:', error);
    }
  };

  const {
    amountWithGst,
    createdAt,
    nights,
    payAmount,
    roomSelections,
    totalAmount,
    totalDiscount,
    endDate,
    startDate,
  } = cartData || {};

  useEffect(() => {
    if (!cartData) {
      setCartData({
        startDate: '22-06-2025',
        endDate: '25-06-2025',
      });
    }
  }, [cartData]);

  const totalGuestCount =
    roomSelections &&
    roomSelections.reduce((total, room) => total + room.adultCount, 0);

  useEffect(() => {
    fetchHotel();
    fetchCartDetailes();
  }, []);

  const fetchCartDetailes = async () => {
    if (!customerId) return;
    const cartData = {
      hotelId: hotelId,
      customerId: customerId,
    };

    try {
      const res = await getRoomToCart(cartData);
      if (res.status === 200) {
        setCartData(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % hotelImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(
      (prev) => (prev - 1 + hotelImages.length) % hotelImages.length,
    );
  };

  const updateRoomSelection = (index, field, value) => {
    setRoomSelections((prev) => {
      const newSelections = [...prev];
      newSelections[index] = {
        ...newSelections[index],
        [field]: Math.max(0, newSelections[index][field] + value),
      };
      return newSelections;
    });
  };

  const getTotalRooms = () => {
    return roomSelections?.reduce(
      (total, selection) => total + selection.rooms,
      0,
    );
  };

  const getTotalGuests = () => {
    return roomSelections.reduce(
      (total, selection) => total + selection.adults,
      0,
    );
  };

  const getTotalAmount = () => {
    return roomSelections.reduce((total, selection, index) => {
      return total + selection.rooms * rooms[index].price;
    }, 0);
  };

  const hasSelections = getTotalRooms() > 0;

  const roomDetailsCard = () => {
    return (
      <>
        <div className='fixed bottom-[70px] left-0 w-full z-50 flex justify-center text-white px-4 md:px-8 py-6 bg-slate-900 font-Manrope shadow-lg md:static md:bottom-auto md:z-auto'>
          <div className='w-[1150px] flex items-center justify-between'>
            <div>
              <p className='text-[12px] md:text-sm mb-2'>Your Stay Details</p>
              <div className='flex gap-2 flex-wrap'>
                {roomSelections &&
                  roomSelections.map((category, index) => (
                    <p key={index} className='text-[10px] md:text-sm'>
                      {category.roomCount} {category.categoryName} room,
                    </p>
                  ))}
                <p className='text-[10px] md:text-sm'>
                  . {totalGuestCount} Guests . {nights} Night
                </p>
              </div>
            </div>
            <div>
              <Link to={`/checkout`}>
                <button className='bg-white text-black font-medium px-4 py-3 rounded-md text-[12px] md:text-sm'>
                  Book Now | Rs. {totalAmount - totalDiscount} (Ex. GST)
                </button>
              </Link>
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className='min-h-screen bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] pb-24'>
      <div className='relative h-[250px] md:h-[450px] bg-black overflow-hidden'>
        <div
          className='flex transition-transform duration-500 ease-out h-full'
          style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
        >
          {hotelImages &&
            hotelImages?.map((image, index) => (
              <div
                key={index}
                className=' relative h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[600px] bg-black overflow-hidden min-w-full  flex-shrink-0'
              >
                <img
                  src={image}
                  alt={`Hotel view ${index + 1}`}
                  className='w-full h-full object-cover'
                />
              </div>
            ))}
        </div>

        <button
          onClick={prevImage}
          className='absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] p-2 rounded-full hover:opacity-90 transition'
        >
          <ChevronLeft className='w-6 h-6 text-white' />
        </button>
        <button
          onClick={nextImage}
          className='absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] p-2 rounded-full hover:opacity-90 transition'
        >
          <ChevronRight className='w-6 h-6 text-white' />
        </button>

        <div className='absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2'>
          {hotelImages?.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentImageIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <h1 className='text-3xl font-bold text-[#D4AF37]'>{hotel?.name}</h1>
            <p className='text-gray-600 flex items-center gap-2 mt-2'>
              <MapPin className='w-4 h-4' />
              {hotel?.location}
            </p>
          </div>
          <div className='flex items-center gap-2 bg-green-100 px-3 py-1 border border-[#E5C100] rounded-lg shadow'>
            <Star className='w-5 h-5 text-green-600 fill-current' />
            <span className='font-semibold text-green-700'>
              {hotel?.avgRating}/5
            </span>
          </div>
        </div>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6 text-[#D4AF37]'>
            Select Your Room
          </h2>
          <div className='space-y-6'>
            {hotel?.RoomCategories?.map((room, index) => (
              <RoomDetails
                key={index}
                RoomDetails={room}
                fetchCartDetailes={fetchCartDetailes}
              />
            ))}
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-4 text-[#D4AF37]'>
            About Hotel
          </h2>
          <p className='text-gray-500  p-2 leading-relaxed'>
            {hotel?.description}
          </p>
        </section>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6 text-[#D4AF37]'>
            Hotel Amenities
          </h2>
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 text-gray-600 gap-6 '>
            {hotel?.amenities?.map((amenity, index) => (
              <div
                key={index}
                className='flex border border-[#E5C100]  items-center gap-3 bg-white p-4 rounded-lg shadow-sm'
              >
                <img
                  src={amenity.icon}
                  alt={amenity.name}
                  className='w-4 h-4'
                />
                <span>{amenity.name}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6 text-[#D4AF37]'>
            Ratings & Reviews
          </h2>
          <div className='bg-white border border-[#E5C100] rounded-lg shadow   p-6'>
            <div className='flex items-center gap-4 mb-6'>
              <div className='text-4xl font-bold text-[#D4AF37]'>4.8</div>
              <div>
                <div className='flex gap-1'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className='w-5 h-5 text-yellow-400 fill-current'
                    />
                  ))}
                </div>
                <p className='text-gray-600 mt-1'>Based on 245 reviews</p>
              </div>
            </div>
            <div className='border-t  border-[#E5C100] rounded-lg   pt-4'>
              <div className='flex items-center gap-2 mb-2'>
                <div className='w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center'>
                  <span className='font-semibold text-yellow-600'>JD</span>
                </div>
                <div>
                  <p className='font-semibold text-gray-600'>John Doe</p>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className='w-4 h-4 text-yellow-400 fill-current'
                      />
                    ))}
                  </div>
                </div>
              </div>
              <p className='text-gray-600'>
                "Excellent stay! The staff was very friendly and the rooms were
                immaculate. Will definitely return."
              </p>
            </div>
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6 text-[#D4AF37]'>
            Hotel Location
          </h2>
          <div className='bg-white border border-[#E5C100] rounded-lg shadow   p-6'>
            <div className='aspect-video border border-[#E5C100] shadow bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-lg mb-4 overflow-hidden'>
              <iframe
                title='Map'
                width='100%'
                height='100%'
                loading='lazy'
                referrerPolicy='no-referrer-when-downgrade'
                src={`https://www.google.com/maps?q=${hotel?.latitude},${hotel?.longitude}&z=15&output=embed`}
                className='w-full h-full'
              />
            </div>

            <div className='flex flex-col gap-2'>
              <div className='flex items-center gap-2 text-gray-600'>
                <Phone className='w-4 h-4' />
                <span>{hotel?.phone}</span>
              </div>
              <div className='flex items-center gap-2 text-gray-600'>
                <Mail className='w-4 h-4' />
                <span>{hotel?.email}</span>
              </div>
            </div>
          </div>
        </section>

        <section className='mb-12'>
          <h2 className='text-2xl font-semibold mb-6 text-[#D4AF37]'>
            Hotel Policies
          </h2>
          <div className=' bg-white border border-[#E5C100] rounded-lg shadow p-6'>
            <div className='grid md:grid-cols-2 gap-6'>
              <div>
                <h3 className='font-semibold text-[#D4AF37] mb-2'>
                  Check-in/Check-out
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li>Check-in: 2:00 PM</li>
                  <li>Check-out: 12:00 PM</li>
                  <li>Early check-in subject to availability</li>
                </ul>
              </div>
              <div>
                <h3 className='font-semibold text-[#D4AF37] mb-2'>
                  House Rules
                </h3>
                <ul className='text-gray-600 space-y-2'>
                  <li>No smoking in rooms</li>
                  <li>Pets not allowed</li>
                  <li>Children welcome</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      {cartData &&
        cartData.hotelId === hotelId &&
        cartData?.roomSelections?.length > 0 && (
          <div className='sticky bottom-0 z-20'>{roomDetailsCard()}</div>
        )}
    </div>
  );
}

export default HotelDetailed;
