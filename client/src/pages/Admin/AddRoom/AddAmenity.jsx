import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { addNewAmenity } from '../../../../api/Vendor/RoomApi';
import { notification } from 'antd';

const AddAmenity = ({ fetchAllAmenities }) => {
  const [roomImages, setRoomImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [amenity, setAmenity] = useState('');
  const [iconImage, setIconImage] = useState(null);

  // Handle image upload
  const handleImageUpload = (files) => {
    const file = files[0];
    if (file) {
      setIconImage(file);
      setRoomImages([
        {
          url: URL.createObjectURL(file),
          name: file.name,
        },
      ]);
    }
  };

  // Handle image deletion
  const handleImageDelete = () => {
    setIconImage(null);
    setRoomImages([]);
  };

  const validateForm = () => {
    if (!amenity) {
      notification.error({ message: 'Amenity is required' });
      return false;
    }
    return true;
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', amenity);

    if (iconImage) {
      formData.append('iconImage', iconImage);
    }

    if (!validateForm()) {
      return;
    }

    try {
      const res = await addNewAmenity(formData);
      if (res.status === 201) {
        notification.success({
          message: 'Amenity added successfully!',
        });
        fetchAllAmenities();
        setAmenity('');
        setIconImage(null);
        setRoomImages([]);
      } else {
        notification.error({
          message: "Error: Can't add amenity",
        });
      }
    } catch (error) {
      console.error('Error submitting form', error);
      notification.error({
        message: 'Error occurred while adding amenity',
      });
    }
  };

  // Handle drag and drop for image upload
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
    <div className='mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-2xl mb-6 text-start'>Add new amenity</h1>

      <form onSubmit={handleSubmit} className='space-y-4 items-center'>
        <div>
          <label className='block font-semibold mb-1'>Amenity</label>
          <input
            type='text'
            name='amenity'
            required
            value={amenity}
            onChange={(e) => setAmenity(e.target.value)}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter Amenity'
          />
        </div>
      </form>

      <div
        className={`mb-4 mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
          isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <FaCloudUploadAlt className='mx-auto text-5xl text-color mb-4' />
        <p className='text-lg mb-2'>Drag and drop your amenity image here</p>
        <p className='text-sm text-gray-500 mb-4'>or</p>
        <label
          htmlFor='city-image-upload'
          className='cursor-pointer cta text-white px-6 py-2 rounded-md transition-colors duration-300'
        >
          Select amenity Image
        </label>
        <input
          id='city-image-upload'
          type='file'
          accept='image/*'
          onChange={(e) => handleImageUpload(e.target.files)}
          className='hidden'
        />
      </div>

      {roomImages.length > 0 && (
        <div className='grid grid-cols-3 gap-4 mb-4'>
          {roomImages.map((image, index) => (
            <div key={index} className='relative group'>
              <img
                src={image.url}
                alt={`City ${index + 1}`}
                className='w-full h-32 object-cover rounded-md'
              />
              <div className='absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-md'>
                <button
                  onClick={handleImageDelete}
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
      )}

      <button
        type='submit'
        onClick={handleSubmit}
        className='w-full cta text-white py-2 rounded-md focus:outline-none focus:ring-2'
      >
        Submit
      </button>
    </div>
  );
};

export default AddAmenity;
