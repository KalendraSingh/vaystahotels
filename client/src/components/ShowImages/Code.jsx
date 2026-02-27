import React, { useState, useEffect } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiX,
  FiMaximize2,
  FiMinimize2,
} from 'react-icons/fi';

const ImageViewer = ({ imageData, bannerImage }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsFullScreen(false);
        setIsGalleryOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const nextImage = () => {
    if (imageData && imageData.length > 0) {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imageData.length);
    }
  };

  const prevImage = () => {
    if (imageData && imageData.length > 0) {
      setCurrentIndex(
        (prevIndex) => (prevIndex - 1 + imageData.length) % imageData.length
      );
    }
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  const openGallery = () => {
    if (imageData && imageData.length > 0) {
      setIsGalleryOpen(true);
    }
  };

  const closeGallery = () => {
    setIsGalleryOpen(false);
  };

  const MainImage = () => (
    <div
      className='relative overflow-hidden rounded-lg shadow-lg cursor-pointer'
      onClick={openGallery}>
      {imageData && imageData.length > 0 && (
        <img
          loading='lazy'
          src={bannerImage}
          alt={'images'}
          className='w-full h-[350px] object-cover transition-transform duration-300 ease-in-out hover:scale-105'
        />
      )}
      <div className='absolute bottom-4 right-4 bg-white px-2 py-1 rounded text-sm font-semibold'>
        View all photos
      </div>
    </div>
  );

  const ThumbnailGrid = () => (
    <div className='grid grid-cols-4 gap-4 mt-4'>
      {imageData &&
        imageData.slice(1, 5).map((image, index) => (
          <div
            key={index}
            className='relative overflow-hidden rounded-lg shadow-md cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105'
            onClick={openGallery}>
            <img
              src={image}
              alt={'image'}
              className='w-full h-32 object-cover'
            />
            {index === 3 && (
              <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
                <span className='text-white font-semibold'>
                  +{imageData.length - 4} photos
                </span>
              </div>
            )}
          </div>
        ))}
    </div>
  );

  const GalleryView = () => (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 z-50 ${
        isGalleryOpen ? '' : 'hidden'
      }`}>
      <div className='relative h-full flex flex-col'>
        <div className='absolute top-4 right-4 z-10 flex space-x-4'>
          <button
            onClick={toggleFullScreen}
            className='p-2 text-white hover:text-gray-300 transition-colors duration-300'
            aria-label='Toggle fullscreen'>
            {isFullScreen ? (
              <FiMinimize2 size={24} />
            ) : (
              <FiMaximize2 size={24} />
            )}
          </button>
          <button
            onClick={closeGallery}
            className='p-2 text-white hover:text-gray-300 transition-colors duration-300'
            aria-label='Close gallery'>
            <FiX size={24} />
          </button>
        </div>
        <div className='flex-grow flex items-center justify-center'>
          {imageData && imageData.length > 0 && (
            <img
              src={imageData[currentIndex]}
              alt={'images'}
              className={`max-h-full max-w-full object-contain transition-transform duration-300 ease-in-out ${
                isFullScreen ? 'scale-100' : 'scale-90'
              }`}
            />
          )}
        </div>
        <div className='absolute inset-y-0 left-0 flex items-center'>
          <button
            onClick={prevImage}
            className='p-2 m-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-opacity duration-300'
            aria-label='Previous image'>
            <FiChevronLeft size={24} />
          </button>
        </div>
        <div className='absolute inset-y-0 right-0 flex items-center'>
          <button
            onClick={nextImage}
            className='p-2 m-2 text-white bg-black bg-opacity-50 rounded-full hover:bg-opacity-75 transition-opacity duration-300'
            aria-label='Next image'>
            <FiChevronRight size={24} />
          </button>
        </div>
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2'>
          <div className='flex space-x-2'>
            {imageData &&
              imageData.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-12 h-12 rounded-md overflow-hidden ${
                    index === currentIndex ? 'ring-2 ring-white' : ''
                  }`}
                  aria-label={`View image ${index + 1}`}>
                  <img
                    src={image}
                    alt={'images'}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Render the component conditionally based on imageData availability
  if (!imageData || imageData.length === 0) {
    return (
      <div className='text-center text-gray-500'>No images available.</div>
    );
  }

  return (
    <div className='max-w-4xl mx-auto p-4 hidden md:block'>
      <MainImage />
      <ThumbnailGrid />
      <GalleryView />
    </div>
  );
};

export default ImageViewer;
