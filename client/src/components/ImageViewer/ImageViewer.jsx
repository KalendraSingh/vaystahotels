import React, { useState, useEffect, useCallback } from 'react';
import {
  FiChevronLeft,
  FiChevronRight,
  FiZoomIn,
  FiZoomOut,
  FiRotateCw,
} from 'react-icons/fi';

const ImageViewer = ({ images, selectedImageIndex, onClose }) => {
  console.log('images', images);
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const resetImageState = useCallback(() => {
    setZoomLevel(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  useEffect(() => {
    setCurrentIndex(selectedImageIndex);
    resetImageState();
  }, [selectedImageIndex, resetImageState]);

  const handlePrevious = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
    resetImageState();
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    resetImageState();
  };

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 4));
  const handleZoomOut = () =>
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5));
  const handleRotate = () => setRotation((prev) => prev + 90);

  const handleMouseDown = (e) => e.button === 0 && setIsDragging(true);
  const handleMouseMove = (e) =>
    isDragging &&
    setPosition((prev) => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  const handleMouseUp = () => setIsDragging(false);
  const handleWheel = (e) => {
    e.preventDefault();
    setZoomLevel((prev) => Math.max(0.5, Math.min(4, prev + e.deltaY * -0.01)));
  };

  if (!images[currentIndex]) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50'>
      <button
        onClick={onClose}
        className='absolute top-4 right-4 text-white text-2xl'
      >
        ✕
      </button>
      <button
        onClick={handlePrevious}
        className='absolute left-4 text-white text-2xl p-4'
      >
        <FiChevronLeft />
      </button>

      <div
        className='relative'
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <img
          src={images[currentIndex]}
          alt={images[currentIndex]}
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
            maxWidth: '90%',
            maxHeight: '80vh',
          }}
          className='transition-transform duration-300'
          draggable='false'
        />
      </div>

      <button
        onClick={handleNext}
        className='absolute right-4 text-white text-2xl p-4'
      >
        <FiChevronRight />
      </button>

      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4'>
        <button onClick={handleZoomOut} className='text-white text-xl p-2'>
          <FiZoomOut />
        </button>
        <button onClick={handleZoomIn} className='text-white text-xl p-2'>
          <FiZoomIn />
        </button>
        <button onClick={handleRotate} className='text-white text-xl p-2'>
          <FiRotateCw />
        </button>
      </div>
    </div>
  );
};

export default ImageViewer;
