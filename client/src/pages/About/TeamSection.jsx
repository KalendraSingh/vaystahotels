import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';

// Team member data for the carousel
const slides = [
  {
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/8d0631a1d722c58972d9d21733b55a37cae647f95cc5748cde053e7971d910ae?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    title: 'Jason M. Carey',
    description:
      'Founder & CEO - Visionary leader with a proven track record in video production and digital marketing, leading the team to success.',
  },
  {
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/6f2f0b1d51e074f61a4e88d79bca142253de6acf4241a6c5a92e9d35a251ea4a?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    title: 'Ana F. Cole',
    description:
      'Relation Manager - Expert in building lasting relationships with clients and managing partnerships for the company’s growth.',
  },
  {
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/5a1938642ad4fb691456c4a9a695b543df489d51ff55ae150411f393147d9f8b?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    title: 'Vera S. Gross',
    description:
      'Manager - Oversees the team with a focus on delivering high-quality projects on time and within budget.',
  },
  {
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/18268514f9af11ce514d08e43574332105f7d3dd4519ea5716857b1a41edbb6d?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    title: 'Jeffrey E. Willard',
    description:
      'Team Leader - Ensures team cohesion and directs efforts toward achieving project goals with innovative solutions.',
  },
  {
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/6f2f0b1d51e074f61a4e88d79bca142253de6acf4241a6c5a92e9d35a251ea4a?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    title: 'Evan M. Stone',
    description:
      'Senior Developer - Passionate about coding and leading the development team in delivering cutting-edge software solutions.',
  },
];

const TeamSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const numberOfItems = 3.5; // Number of visible items
  const swiperRef = React.useRef(null);

  const changeItemId = (index) => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideTo(index);
      setCurrentIndex(index);
    }
  };

  return (
    <div className='w-full lg:w-[1200px] mx-auto px-4'>
      <div style={{ marginTop: '5em' }}>
        <h2 className='text-2xl text-center font-medium'>
          Our Strong Team Members
        </h2>
        <div className='relative mt-8'>
          {currentIndex > 0 ? (
            <button
              style={{ transform: 'translate3d(0, 0, 0)' }}
              onClick={() => changeItemId(currentIndex - 1)}
              className='swiper-button-prev bg-white shadow-lg p-3 rounded-full absolute top-1/2 left-[-20px] transform -translate-y-1/2 z-10 hover:bg-gray-100 transition-transform hover:scale-105'
            ></button>
          ) : null}

          {slides.length > currentIndex + numberOfItems ? (
            <button
              style={{ transform: 'translate3d(0, 0, 0)' }}
              onClick={() => changeItemId(currentIndex + 1)}
              className='swiper-button-next bg-white shadow-lg p-3 rounded-full absolute top-1/2 right-[-20px] transform -translate-y-1/2 z-10 hover:bg-gray-100 transition-transform hover:scale-105'
            ></button>
          ) : null}

          <Swiper
            ref={swiperRef}
            modules={[Navigation]}
            slidesPerView={3.5}
            spaceBetween={20}
            loop={true}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)} // Update current index on slide change
            breakpoints={{
              270: {
                slidesPerView: 1,
                spaceBetween: 10,
              },
              400: {
                slidesPerView: 1.5,
                spaceBetween: 10,
              },
              500: {
                slidesPerView: 2,
                spaceBetween: 10,
              },
              640: {
                slidesPerView: 2.5,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3.5,
                spaceBetween: 20,
              },
            }}
          >
            {slides &&
              slides.map((member, index) => (
                <SwiperSlide key={index}>
                  <div
                    key={index}
                    className='p-4 m-2 border border-gray-200 rounded-lg flex flex-col items-center'
                  >
                    <img
                      src={member.image}
                      alt={member.title}
                      className='object-cover w-full h-[250px] bg-cover  rounded-md'
                    />
                    <h3 className='text-xl mt-4'>{member.title}</h3>
                    <p className='text-gray-600 text-sm mt-2'>
                      {member.description}
                    </p>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default TeamSection;
