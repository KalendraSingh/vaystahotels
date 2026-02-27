import { MapPin, Star } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoMdArrowForward } from 'react-icons/io';
import 'swiper/css';
import 'swiper/css/navigation';
import { getAllTopRated } from '../../../api/Public/HotelApi';
import { Link } from 'react-router-dom';

function TopRated() {
  const [topRatedHotels, setTopRatedHotels] = useState([]);
  useEffect(() => {
    fetchTopRatedHotels();
  }, []);

  const fetchTopRatedHotels = async () => {
    try {
      const res = await getAllTopRated();
      if (res.status === 200) {
        setTopRatedHotels(res.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {/* Featured Properties */}
      <section className='py-20 bg-white'>
        <div className='max-w-7xl mx-auto px-6'>
         <div className="text-center mb-14">
  <h2 className="text-4xl md:text-5xl font-extrabold text-[#D4AF37] mb-3">
    The <span className="text-">Gold Standard</span>
  </h2>
  <div className="h-1 w-32 mx-auto bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded-full mb-4" />
  <p className="text-gray-600 text-lg font-medium">
    Exceptional hotels trusted by thousands
  </p>
</div>

          {/* Swiper Section */}
          <div className='relative px-4'>
            {/* Custom Navigation Buttons */}
            <button
              className='absolute hidden sm:block custom-prev p-2 left-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg rounded-full transition-colors hover:opacity-90'
              aria-label='Previous'
            >
              <IoArrowBackOutline className='w-6 h-6 p-1 text-white' />
            </button>
            <button
              className='absolute hidden sm:block custom-next p-2 right-0 top-1/2 -translate-y-1/2 z-10 bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg rounded-full transition-colors hover:opacity-90'
              aria-label='Next'
            >
              <IoMdArrowForward className='w-6 h-6 p-1 text-white' />
            </button>

            <Swiper
              modules={[Navigation]}
              slidesPerView={4}
              spaceBetween={20}
              navigation={{
                prevEl: '.custom-prev',
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
              {topRatedHotels?.map((property, index) => (
                <SwiperSlide>
                  <Link to={`/hotelDetailed/${property.id}`}>
                    <div
                      key={index}
                      className='relative group overflow-hidden rounded-xl border border-[#E5C100] bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]'
                    >
                      <img
                        loading='lazy'
                        src={property.bannerImage}
                        alt={property.name}
                        className='w-full rounded-xl shadow-xl transform transition-all duration-300 h-[250px] object-cover'
                      />

                      {/* Overlay */}
                      <div className='absolute inset-0 bg-black/30 rounded-xl translate-y-[100%] group-hover:translate-y-0 transition-all duration-500 ease-in-out'>
                        <h3 className='text-xl font-bold pt-4 px-2 text-left text-white mb-2'>
                          {property.name}
                        </h3>
                        <div className='px-2 pb-4 flex flex-col justify-end h-[205px] text-white'>
                          <p className='mb-4 flex items-center justify-start text-white'>
                            <MapPin className='w-4 h-4 mr-1 text-white' />{' '}
                            {property.location}
                          </p>
                          <div className='flex justify-between items-center'>
                            <span className='text-2xl font-bold text-[#ead42c]'>
                              {property.avgPrice}
                              <span className='text-sm text-white'>/night</span>
                            </span>
                            <div className='flex items-center'>
                              <Star className='w-5 h-5 text-yellow-400 fill-current' />
                              <span className='ml-1'>{property.avgRating}</span>
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
}

export default TopRated;
