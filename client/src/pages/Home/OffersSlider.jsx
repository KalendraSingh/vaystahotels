import { MapPin } from 'lucide-react';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { IoArrowBackOutline } from 'react-icons/io5';
import { IoMdArrowForward } from 'react-icons/io';
import 'swiper/css';
import 'swiper/css/navigation';

const hotels = [
  {
    image:
      'https://res.cloudinary.com/dlutbfejn/image/upload/v1738690697/woman-traveler-talking-receptionist-about-room-reservation_xs6qco.jpg',
    name: 'Flat 50% off',
    location: 'Maldives',
    price: '₹299',
  },
  {
    image:
      'https://res.cloudinary.com/dlutbfejn/image/upload/v1738690692/modern-young-couple-checking-photos-camera_pz6qyh.jpg',
    name: 'Reverse for ₹0',
    location: 'New York',
    price: '₹249',
  },
  {
    image:
      'https://res.cloudinary.com/dlutbfejn/image/upload/v1738690687/receptionist-providing-luxury-service_sanisr.jpg',
    name: 'Get 50% off',
    location: 'New York',
    price: '₹249',
  },
  {
    image:
      'https://res.cloudinary.com/dlutbfejn/image/upload/v1738690688/hotel-receptionist-assists-woman_siljtr.jpg',
    name: 'Special offers',
    location: 'New York',
    price: '₹249',
  },
  {
    image:
      'https://res.cloudinary.com/dlutbfejn/image/upload/v1738690703/medium-shot-photographer-groom_h5cogd.jpg',
    name: 'Flat 50% off',
    location: 'New York',
    price: '₹249',
  },
];

function OffersSlider() {
  return (
    <div>
      {/* Overall Section Background */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header Title with gold color */}
          <h2 className="text-4xl font-semibold text-center text-[#D4AF37] mb-3">
            Discover Your Next Adventure
          </h2>
          {/* Gradient Underline Below Header */}
          <div className="w-28 h-1 mx-auto mb-12 rounded bg-gradient-to-r from-[#D4AF37] to-[#FFD700]" />

          {/* Swiper Section */}
          <div className="relative px-4">
            {/* Custom Navigation Buttons with gradient bg */}
            <button
              className="absolute sm:block offer-prev p-3 left-0 top-1/2 -translate-y-1/2 z-10 rounded-full transition-all hover:opacity-90 bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
              aria-label="Previous"
            >
              <IoArrowBackOutline className="w-6 h-6 text-white" />
            </button>
            <button
              className="absolute sm:block offer-next p-3 right-0 top-1/2 -translate-y-1/2 z-10 rounded-full transition-all hover:opacity-90 bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
              aria-label="Next"
            >
              <IoMdArrowForward className="w-6 h-6 text-white" />
            </button>

            <Swiper
              modules={[Navigation]}
              slidesPerView={3}
              spaceBetween={20}
              navigation={{
                prevEl: '.offer-prev',
                nextEl: '.offer-next',
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
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
            >
              {hotels.map((property, index) => (
                <SwiperSlide key={index}>
                  <div className="relative overflow-hidden rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 bg-gradient-to-tr  from-[#fff9e6] to-[#fff3cc] border-2 border-[#E5C100]">
                    {/* Image Section */}
                    <img
                      loading="lazy"
                      src={property.image}
                      alt={property.name}
                      className="w-full h-[200px] object-cover rounded-lg transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent rounded-lg"></div>

                    {/* Title and Location */}
                    <div className="absolute top-4 left-4">
                      <h3 className="text-xl font-semibold   text-white">{property.name}</h3>
                      <div className="flex items-center space-x-2 mt-2">
                        <MapPin className="w-4 h-4 text-[#B68F00]" />
                        <span className="text-white text-sm">{property.location}</span>
                      </div>
                    </div>

                    {/* Bottom Section with Price & Button */}
                    <div className="absolute bottom-4 left-4 w-full flex justify-between items-center">
                      <span className="text-[#7a6c00] text-lg font-bold">
                        {property.price}/night
                      </span>
                      <button className="px-6 py-1 bg-[#ffea94] text-[#6c757d] text-sm rounded-full font-semibold transition-all hover:bg-[#ffea94] transform hover:scale-105">
                        Get Offer
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OffersSlider;
