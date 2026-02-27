import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';

import {
  getAllHotels,
  getAllHotelRoomCategory,
} from '../../../../api/Public/HotelApi';
import {
  addHotelRoomCategory,
  addHotelRooms,
  getRoomCategoryByHotel,
} from '../../../../api/Vendor/HotelApi';

const AddRoomImages = () => {
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [roomImages, setRoomImages] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const mockRooms = [
        { id: 'R001', name: 'Deluxe Room' },
        { id: 'R002', name: 'Suite' },
        { id: 'R003', name: 'Standard Room' },
      ];
      setRooms(mockRooms);
    };
    fetchRooms();
  }, []);

  const handleRoomChange = (e) => {
    setSelectedRoomId(e.target.value);
  };

  const handleImageUpload = (files) => {
    const newImages = Array.from(files).map((file) => ({
      url: URL.createObjectURL(file),
      name: file.name,
    }));
    setRoomImages([...roomImages, ...newImages]);
  };

  const handleImageDelete = (index) => {
    const updatedImages = roomImages.filter((_, i) => i !== index);
    setRoomImages(updatedImages);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    handleImageUpload(files);
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-2xl  mb-6 text-start'>Room Image Upload</h1>

      <div className='mb-8 p-4 border border-gray-300 rounded-md'>
        <select
          value={selectedRoomId}
          onChange={handleRoomChange}
          className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
        >
          <option value=''>Select Room</option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name}
            </option>
          ))}
        </select>

        <div
          className={`mb-4 border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FaCloudUploadAlt className='mx-auto text-5xl text-color mb-4' />
          <p className='text-lg mb-2'>Drag and drop your images here</p>
          <p className='text-sm text-gray-500 mb-4'>or</p>
          <label
            htmlFor='room-image-upload'
            className='cursor-pointer cta text-white px-6 py-2 rounded-md  transition-colors duration-300'
          >
            Select Files
          </label>
          <input
            id='room-image-upload'
            type='file'
            multiple
            accept='image/*'
            onChange={(e) => handleImageUpload(e.target.files)}
            className='hidden'
          />
        </div>

        <div className='grid grid-cols-3 gap-4 mb-4'>
          {roomImages.map((image, index) => (
            <div key={index} className='relative group'>
              <img
                src={image.url}
                alt={`Room ${index + 1}`}
                className='w-full h-32 object-cover rounded-md'
              />
              <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-md'>
                <button
                  onClick={() => handleImageDelete(index)}
                  className='text-white p-2 rounded-full hover:bg-red-600 transition-colors duration-300'
                >
                  <FaTrash />
                </button>
              </div>
              <p className='mt-1 text-sm text-gray-500 truncate'>
                {image.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AddRoomImages;
