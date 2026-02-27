import { Heart, MapPin } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoMdArrowForward } from 'react-icons/io';
import 'swiper/css';
import 'swiper/css/navigation';
import { getTrendingHotels } from '../../../api/Public/HotelApi';
import { Link } from 'react-router-dom';

const Trending = () => {
  const [trendingHotels, setTrendingHotels] = useState([]);

  useEffect(() => {
    fetchTrendingHotels();
  }, []);

  const fetchTrendingHotels = async () => {
    try {
      const res = await getTrendingHotels();
      if (res.status === 200) {
        setTrendingHotels(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {/* Overall Section Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-extrabold text-[#E5C100] mb-3">
              What’s <span className="text-">Hot This Season</span>
            </h2>
            <p className="text-gray-600 text-lg font-medium">
              Luxury picks making waves right now
            </p>
          </div>

          {/* Swiper Section */}
          <div className="relative px-4">
            {/* Custom Navigation Buttons with gradient gold bg */}
            <button
              className="absolute hidden sm:block custom-prev p-2 left-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg transition-colors hover:opacity-90"
              aria-label="Previous"
            >
              <IoArrowBackOutline className="w-6 h-6 p-1 text-white text-sm" />
            </button>
            <button
              className="absolute hidden sm:block custom-next p-2 right-0 top-1/2 -translate-y-1/2 z-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg transition-colors hover:opacity-90"
              aria-label="Next"
            >
              <IoMdArrowForward className="w-6 h-6 p-1 text-white text-sm" />
            </button>

            <Swiper
              modules={[Navigation]}
              slidesPerView={4}
              spaceBetween={20}
              navigation={{
                prevEl: '.custom-prev' ,
                nextEl: '.custom-next',
              }}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                640: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 4,
                  spaceBetween: 24,
                },
              }}
            >
              {trendingHotels?.map((hotel, index) => (
                <SwiperSlide key={index}>
                  <Link to={`/hotelDetailed/${hotel.id}`}>
                    <div className="bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] border-2 border-[#E5C100] rounded-xl overflow-hidden shadow-lg transform transition-all my-4  duration-500 hover:scale-105">
                      <div className="relative group">
                        <img
                          src={hotel.bannerImage}
                          alt={hotel.name}
                          className="w-full h-[300px] object-cover rounded-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3"
                        />
                        <div className="absolute top-4 right-4 bg-[#6c757d] text-white px-3 py-1 rounded-full text-sm">
                          Trending
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#ffffff]/70 to-[#f0f0f0]/90 rounded-xl translate-y-[-100%] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-transform duration-500 ease-in-out">
                          <div className="flex flex-col px-4 pb-4 justify-end h-full text-[#7a6c00] ">
                            <h3 className="text-lg font-bold mb-2">{hotel.name}</h3>
                            <p className="text-sm mb-2 flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-[#B68F00]" />
                              {hotel.location}
                            </p>
                            <div className="flex justify-between items-center">
                              <span className="text-xl font-bold text-[#7a6c00]">
                                {hotel.avgPrice}
                                <span className="text-sm text-gray-600">/night</span>
                              </span>
                              <Heart className="w-5 h-5 text-[#7a6c00] hover:text-[#FFD700] cursor-pointer" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Trending;
