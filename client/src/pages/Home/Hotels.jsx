import React, { useEffect, useState } from 'react';
import { FaHeart } from 'react-icons/fa6';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoMdArrowForward } from 'react-icons/io';
import 'swiper/css';
import 'swiper/css/navigation';

// ⬇️⬇️⬇️ API IMPORT STARTS HERE ⬇️⬇️⬇️
import { getLatestHotels } from '../../../api/Public/HotelApi';
// ⬆️⬆️⬆️ API IMPORT ENDS HERE ⬆️⬆️⬆️

import { Link } from 'react-router-dom';

const fallbackImage = 'https://via.placeholder.com/400x250?text=No+Image';

const Hotels = () => {
  // ⬇️⬇️⬇️ STATE FOR API DATA ⬇️⬇️⬇️
  const [latestHotels, setLatestHotels] = useState([]);
  // ⬆️⬆️⬆️ STATE FOR API DATA ⬆️⬆️⬆️

  useEffect(() => {
    // ⬇️⬇️⬇️ API CALL TRIGGER ON COMPONENT MOUNT ⬇️⬇️⬇️
    fetchLatestHotels();
    // ⬆️⬆️⬆️ API CALL TRIGGER ON COMPONENT MOUNT ⬆️⬆️⬆️
  }, []);

  // ⬇️⬇️⬇️ API FUNCTION STARTS HERE ⬇️⬇️⬇️
  const fetchLatestHotels = async () => {
    try {
      const res = await getLatestHotels(); // <--- calling the API
      if (res.status === 200) {
        setLatestHotels(res.data); // <--- setting API response in state
      }
    } catch (error) {
      console.log(error);
    }
  };
  // ⬆️⬆️⬆️ API FUNCTION ENDS HERE ⬆️⬆️⬆️

  return (
    <section className="bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] py-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-3">
            Explore the <span className="text-white">Latest Stays</span>
          </h2>
          <p className="text-[#7a6c00] text-lg font-medium">
            Curated luxury hotels tailored just for you
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          <button className="absolute hidden sm:flex trending-prev left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg rounded-full p-2 hover:brightness-110 transition">
            <IoArrowBackOutline className="w-5 h-5 text-white" />
          </button>
          <button className="absolute hidden sm:flex trending-next right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg rounded-full p-2 hover:brightness-110 transition">
            <IoMdArrowForward className="w-5 h-5 text-white" />
          </button>

          <Swiper
            modules={[Navigation]}
            loop
            slidesPerView={4}
            spaceBetween={30}
            navigation={{ prevEl: '.trending-prev', nextEl: '.trending-next' }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 24 },
              1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="w-full"
          >
            {latestHotels?.map((hotel, index) => (
              <SwiperSlide key={index}>
                <Link to={`/hotelDetailed/${hotel.id}`}>
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 group relative border border-[#E5C100]">
                    {/* Image Section */}
                    <div className="relative h-64 w-full overflow-hidden">
                      <img
                        src={hotel?.bannerImage || fallbackImage}
                        alt={hotel.name}
                        onError={(e) => { e.target.src = fallbackImage }}
                        className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                      />
                      {hotel?.hotelImages?.[0]?.imageUrls?.[0] && (
                        <img
                          src={hotel.hotelImages[0].imageUrls[0]}
                          alt={hotel.name}
                          onError={(e) => { e.target.src = fallbackImage }}
                          className="absolute inset-0 w-full h-full object-cover transform transition-transform duration-500 translate-x-full group-hover:translate-x-0 group-hover:scale-110"
                        />
                      )}

                      {/* Favorite Icon */}
                      <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-md rounded-full p-2 shadow-md hover:scale-105 transition-transform">
                        <FaHeart className="text-[#DAA520] text-sm" />
                      </div>

                      {/* Title overlay */}
                      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/50 to-transparent p-4">
                        <h3 className="text-[#B68F00] font-bold text-lg truncate tracking-wide">
                          {hotel.name}
                        </h3>
                      </div>
                    </div>

                    {/* Hotel Details */}
                    <div className="p-4 space-y-1">
                      <p className="text-[#7a6c00] text-sm font-medium">
                        {hotel?.location || 'Prime Location'}
                      </p>
                      <p className="text-[#7a6c00] text-base font-semibold">
                        From ₹{hotel?.price || '999'}/night
                      </p>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Hotels;
