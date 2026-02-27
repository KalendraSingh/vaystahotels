import React, { useState } from 'react';
import { MdNavigateNext } from 'react-icons/md';
import { GrFormPrevious } from 'react-icons/gr';
import { IoLocationOutline } from 'react-icons/io5';

const LoginImgSlider = () => {
  const images = [
  {
    src: 'https://plus.unsplash.com/premium_photo-1661753044889-0310ee1ed74e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDF8fHxlbnwwfHx8fHw%3D',
    alt: 'List Your Property Easily',
    description:
      'Join India’s fastest-growing platform and list your property in just minutes. Simple steps, big exposure.',
    location: 'Pan India Visibility with Vaysta',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1733306696471-807493ff845b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8',
    alt: 'Grow Bookings & Revenue',
    description:
      'Reach thousands of travelers and grow your occupancy with dedicated partner support and marketing tools.',
    location: 'Grow with Zero Listing Fees',
  },
  {
    src: 'https://plus.unsplash.com/premium_photo-1663089872140-e793198be0c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU4fHx8ZW58MHx8fHx8',
    alt: 'Start Earning More',
    description:
      'Whether it’s a homestay or a hotel — turn your property into a revenue-generating business with Vaysta.',
    location: 'Earn More with Every Booking',
  },
];



  const [currentIndex, setCurrentIndex] = useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const goToPrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const currentImage = images[currentIndex];
  return (
    <aside className='flex hidden lg:block flex-col ml-5  max-md:ml-0 max-md:w-full'>
      <div className='flex relative  flex-col overflow-hidden grow pt-40 rounded-md md:pt-30 md:mt-10 md:w-full'>
        <img
          loading='lazy'
          src={currentImage.src}
          alt={currentImage.alt}
          className='object-cover rounded-lg h-full  absolute inset-0 size-full transition-opacity duration-500'
        />
        <div className='flex relative flex-col px-4 pt-64 pb-4 w-full rounded-xl max-md:pt-24 max-md:pr-5 max-md:max-w-full bg-gradient-to-t from-black to-transparent'>
          <p className='mr-7 text-sm leading-6 text-white max-md:mr-2.5 max-md:max-w-full'>
            {currentImage.description.slice(0, 100)}...
          </p>
          <div className='flex gap-5 justify-between mt-3.5 w-full max-md:max-w-full'>
            <div className='flex gap-2 text-xs leading-6 text-white'>
              <IoLocationOutline className='text-white w-6 h-6' />
              <div className='basis-auto'>{currentImage.location}</div>
            </div>
            <div className='flex gap-3.5 my-auto'>
              <button
                onClick={goToPrevious}
                aria-label='Previous image'
                className='p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors'
              >
                <GrFormPrevious className='text-white w-5 h-5' />
              </button>
              <button
                onClick={goToNext}
                aria-label='Next image'
                className='p-2 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors'
              >
                <MdNavigateNext className='text-white w-5 h-5' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default LoginImgSlider;
