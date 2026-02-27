import React, { useEffect, useState } from 'react';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoMdArrowForward } from 'react-icons/io';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { getAllCities } from '../../../api/Public/HotelApi';
import { useNavigate } from 'react-router-dom';
import 'swiper/css';
import 'swiper/css/navigation';


const CitySlider = () => {
  const [cities, setCities] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllCities();
  }, []);

  const fetchAllCities = async () => {
    try {
      const res = await getAllCities();
      if (res.status === 200) {
        setCities(res.data || []);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleCityClick = (city) => {
    navigate('/hotels', { state: { cityName: city.city } });
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold text-[#D4AF37] mb-2">
            Discover Your Next Adventure
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] mx-auto rounded-full mb-4"></div>
          <p className="text-gray-600 max-w-xl mx-auto">
            Handpicked properties and unforgettable experiences await you.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Navigation buttons */}
          <button
            className="city-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full shadow-lg hover:brightness-110 transition"
            aria-label="Previous"
          >
            <IoArrowBackOutline className="w-6 h-6 text-white" />
          </button>
          <button
            className="city-next absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-full shadow-lg hover:brightness-110 transition"
            aria-label="Next"
          >
            <IoMdArrowForward className="w-6 h-6 text-white" />
          </button>

          <Swiper
            modules={[Navigation, Autoplay]}
            slidesPerView={4}
            spaceBetween={24}
            navigation={{
              prevEl: '.city-prev',
              nextEl: '.city-next',
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 24 },
            }}
          >
            {cities.map((place, index) => (
              <SwiperSlide key={index}>
                <div
                  onClick={() => handleCityClick(place)}
                  className="cursor-pointer bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-3xl border border-[#E5C100] shadow-[4px_4px_10px_rgba(212,175,55,0.3),-4px_-4px_15px_rgba(255,215,0,0.2)] overflow-hidden transition-transform duration-500 hover:scale-[1.05] my-4"
                >
                  <div className="overflow-hidden rounded-3xl">
                    <img
                      src={place.cityImage}
                      alt={place.city}
                      className="w-full h-52 object-cover transform transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-[#B68F00] mb-1">
                      {place.city}
                    </h3>
                    <p className="text-sm text-[#7a6c00] mb-3">
                      Avg. Price: ₹{place.cityAvgPrice}
                    </p>
                    {/* Rating removed as you requested */}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CitySlider;
