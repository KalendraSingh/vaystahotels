import React, { useState } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { addNewCity } from '../../../../api/Vendor/HotelApi';
import { notification } from 'antd';

const AddNewCity = () => {
  const [roomImages, setRoomImages] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState({
    city: '',
    country: '',
    state: '',
    cityAvgPrice: '',
    landmark: '',
    location: '',
    zipcode: '',
  });

  const [cityImage, setCityImage] = useState(null);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle image upload
  const handleImageUpload = (files) => {
    const file = files[0];
    if (file) {
      setCityImage(file);
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
    setCityImage(null);
    setRoomImages([]);
  };

  const validateForm = () => {
    const { city, state, cityAvgPrice, country, landmark, location, zipcode } =
      formData;
    if (!city) {
      notification.error({ message: 'City is required' });
      return false;
    }
    if (!state) {
      notification.error({ message: 'State is required' });
      return false;
    }
    if (!cityAvgPrice || isNaN(cityAvgPrice) || cityAvgPrice <= 0) {
      notification.error({ message: 'Valid average price is required' });
      return false;
    }
    if (!country) {
      notification.error({ message: 'Country is required' });
      return false;
    }
    if (!landmark) {
      notification.error({ message: 'Landmark is required' });
      return false;
    }
    if (!location) {
      notification.error({ message: 'Location is required' });
      return false;
    }
    if (!zipcode || zipcode.length !== 6) {
      notification.error({ message: 'Valid 6-digit zipcode is required' });
      return false;
    }
    if (!cityImage) {
      notification.error({ message: 'City image is required' });
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const cityFormData = new FormData();

    cityFormData.append('city', formData.city);
    cityFormData.append('state', formData.state);
    cityFormData.append('cityAvgPrice', formData.cityAvgPrice);
    cityFormData.append('country', formData.country);
    cityFormData.append('landmark', formData.landmark);
    cityFormData.append('location', formData.location);
    cityFormData.append('zipcode', formData.zipcode);

    if (cityImage) {
      cityFormData.append('cityImage', cityImage);
    }

    if (!validateForm()) {
      return;
    }

    try {
      const res = await addNewCity(cityFormData);
      if (res.status === 201) {
        notification.success({
          message: 'City added successfully!',
        });

        setFormData({
          city: '',
          state: '',
          cityAvgPrice: '',
          country: '',
          landmark: '',
          location: '',
          zipcode: '',
        });
        setCityImage(null);
        setRoomImages([]);
      } else {
        notification.error({
          message: "Error: Can't add city",
        });
      }
    } catch (error) {
      console.error('Error submitting form', error);
      notification.error({
        message: 'Error occurred while adding city',
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
      <h1 className='text-2xl mb-6 text-start'>Add City Details</h1>

      <form
        onSubmit={handleSubmit}
        className='space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4 items-center'
      >
        {/* City */}
        <div>
          <label className='block font-semibold mb-1'>City</label>
          <input
            type='text'
            name='city'
            value={formData.city}
            required
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter city name'
          />
        </div>

        {/* State */}
        <div>
          <label className='block font-semibold mb-1'>State</label>
          <input
            type='text'
            name='state'
            value={formData.state}
            required
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter state name'
          />
        </div>

        {/* City Avg Price */}
        <div>
          <label className='block font-semibold mb-1'>Average Price</label>
          <input
            type='number'
            name='cityAvgPrice'
            min={0}
            value={formData.cityAvgPrice}
            required
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter average price'
          />
        </div>

        {/* Country */}
        <div>
          <label className='block font-semibold mb-1'>Country</label>
          <input
            type='text'
            name='country'
            value={formData.country}
            required
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter country'
          />
        </div>

        {/* Landmark */}
        <div>
          <label className='block font-semibold mb-1'>Landmark</label>
          <input
            type='text'
            name='landmark'
            value={formData.landmark}
            required
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter landmark'
          />
        </div>

        {/* Location */}
        <div>
          <label className='block font-semibold mb-1'>Location</label>
          <input
            type='text'
            name='location'
            value={formData.location}
            required
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter location'
          />
        </div>

        {/* Zipcode */}
        <div>
          <label className='block font-semibold mb-1'>Zipcode</label>
          <input
            type='text'
            name='zipcode'
            required
            value={formData.zipcode}
            onChange={handleChange}
            className='w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-300'
            placeholder='Enter zipcode'
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
        <p className='text-lg mb-2'>Drag and drop your city image here</p>
        <p className='text-sm text-gray-500 mb-4'>or</p>
        <label
          htmlFor='city-image-upload'
          className='cursor-pointer cta text-white px-6 py-2 rounded-md transition-colors duration-300'
        >
          Select City Image
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

export default AddNewCity;
