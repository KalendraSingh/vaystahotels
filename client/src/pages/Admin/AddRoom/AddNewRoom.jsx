import React, { useState, useEffect } from 'react';
import {
  FaHotel,
  FaPercent,
  FaRupeeSign,
  FaBed,
  FaUsers,
  FaRulerCombined,
  FaCloudUploadAlt,
  FaTrash,
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import {
  getAllHotels,
  getAllHotelRoomCategory,
} from '../../../../api/Public/HotelApi';
import {
  addHotelRoomCategory,
  addHotelRooms,
  getRoomCategoryByHotel,
} from '../../../../api/Vendor/HotelApi';
import { addNewRoom } from '../../../../api/Vendor/RoomApi';

import { getAllAmenities } from '../../../../api/Public/RoomApi';

import { Modal, notification } from 'antd';
import AddAmenity from './AddAmenity';

const AddNewRoom = () => {
  const [formData, setFormData] = useState({
    hotelId: '',
    price: '',
    discount: '',
    amenities: [],
    category: '',
    bedType: '',
    adultCount: '',
    roomSize: '',
    description: '',
    perGuestPrice: '',
  });
  const [errors, setErrors] = useState({});
  const [hotels, setHotels] = useState([]);
  const [roomCategories, setRoomCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [roomCategoryId, setRoomCategoryId] = useState('');
  const [roomNo, setRoomNo] = useState('');
  const [amenitiesData, setAmenitiesData] = useState('');
  const [openModel, setOpenModel] = useState(false);

  const showAmenityModal = () => {
    setOpenModel(true);
  };

  const onCancelModal = () => {
    setOpenModel(false);
  };

  useEffect(() => {
    fetchHotels();
    fetchAllAmenities();
  }, []);

  useEffect(() => {
    if (selectedHotelId) {
      fetchHotelRoomCategory(selectedHotelId);
    }
  }, [selectedHotelId]);

  const fetchAllAmenities = async () => {
    const res = await getAllAmenities();
    if (res.status === 200 && res.data.length > 0) {
      setAmenitiesData(res.data);
    }
  };

  const fetchHotels = async () => {
    const res = await getAllHotels();
    if (res.status === 200 && res.data.length > 0) {
      setHotels(res.data.map((item) => ({ name: item.name, id: item.id })));
    }
  };

  const fetchHotelRoomCategory = async (id) => {
    const res = await getRoomCategoryByHotel(id);
    if (res.status === 200 && res.data.length > 0) {
      const filteredData = res.data.map(({ id, category }) => ({
        id,
        category,
      }));
      setRoomCategories(filteredData);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAmenityChange = (amenity) => {
    setFormData((prevData) => {
      const isAlreadySelected = prevData.amenities.some(
        (selectedAmenity) => selectedAmenity.name === amenity.name
      );

      const updatedAmenities = isAlreadySelected
        ? prevData.amenities.filter(
            (selectedAmenity) => selectedAmenity.name !== amenity.name
          )
        : [...prevData.amenities, { name: amenity.name, icon: amenity.icon }];

      return {
        ...prevData,
        amenities: updatedAmenities,
      };
    });
  };

  const validateForm = () => {
    const {
      hotelId,
      price,
      discount,
      amenities,
      category,
      bedType,
      adultCount,
      roomSize,
      description,
      perGuestPrice,
    } = formData;

    if (!hotelId) {
      notification.error({ message: 'Hotel is required' });
      return false;
    }
    if (!category) {
      notification.error({ message: 'Category is required' });
      return false;
    }
    if (!price || isNaN(price) || price <= 0) {
      notification.error({ message: 'Valid price is required' });
      return false;
    }
    if (discount !== '' && (isNaN(discount) || discount < 0)) {
      notification.error({ message: 'Valid discount is required' });
      return false;
    }
    if (!amenities || amenities.length === 0) {
      notification.error({ message: 'At least one amenity is required' });
      return false;
    }
    if (!bedType) {
      notification.error({ message: 'Bed type is required' });
      return false;
    }
    if (!adultCount || isNaN(adultCount) || adultCount <= 0) {
      notification.error({ message: 'Valid adult count is required' });
      return false;
    }
    if (!roomSize || isNaN(roomSize) || roomSize <= 0) {
      notification.error({ message: 'Valid room size is required' });
      return false;
    }
    if (!description || description.trim() === '') {
      notification.error({ message: 'Description is required' });
      return false;
    }
    if (categoryImages.length === 0) {
      notification.error({
        message: 'At least one category image is required',
      });
      return false;
    }
    if (!perGuestPrice || isNaN(perGuestPrice) || perGuestPrice <= 0) {
      notification.error({ message: 'Valid per guest price is required' });
      return false;
    }
    return true;
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setCategoryImages([...categoryImages, ...newImages]);
  };

  const handleImageDelete = (index) => {
    const updatedImages = categoryImages.filter((_, i) => i !== index);
    setCategoryImages(updatedImages);
  };

  const handleAddCategory = async () => {
    if (!validateForm()) {
      return;
    }

    const catFormData = new FormData();
    catFormData.append('hotelId', formData.hotelId);
    catFormData.append('category', formData.category);
    catFormData.append('price', formData.price);
    catFormData.append('discount', formData.discount);
    catFormData.append('amenities', JSON.stringify(formData.amenities));
    catFormData.append('bedType', formData.bedType);
    catFormData.append('adultCount', formData.adultCount);
    catFormData.append('roomSize', formData.roomSize);
    catFormData.append('description', formData.description);
    catFormData.append('perGuestPrice', formData.perGuestPrice);

    categoryImages.forEach((image, index) => {
      catFormData.append(`roomCatImage`, image.file);
    });

    try {
      const response = await addHotelRoomCategory(catFormData);
      if (response.status === 201) {
        notification.success({
          message: 'Category created successfully!',
        });
        setCategoryImages([]);
        setFormData({
          hotelId: '',
          price: '',
          discount: '',
          amenities: [],
          category: '',
          bedType: '',
          adultCount: '',
          roomSize: '',
          description: '',
          categoryImage: [],
          perGuestPrice: '',
        });
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!validateFormRoom()) {
      return;
    }

    const formData = {
      hotelId: selectedHotelId,
      roomCategoryId: roomCategoryId,
      roomNo,
    };

    try {
      const response = await addNewRoom(formData);
      if (response.status === 201) {
        notification.success({
          message: 'Room added successfully!',
        });
        setSelectedHotelId('');
        setRoomCategoryId('');
        setRoomNo('');
      }
    } catch (error) {
      notification.error({
        message: 'Error submitting room data',
      });
    }
  };

  const validateFormRoom = () => {
    const newErrors = {};
    if (!selectedHotelId) {
      newErrors.hotelId = 'Hotel is required';
    }
    if (!roomCategoryId) {
      newErrors.roomCategoryId = 'Room Category is required';
    }
    if (!roomNo) {
      newErrors.roomCategoryId = 'Room Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <div className='mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-3xl font-bold mb-6 text-start'>
        Room Category Creation
      </h1>

      <div className='mb-8 p-4 border border-gray-300 rounded-md gap-4 grid grid-cols-1 md:grid-cols-2'>
        {/* Hotel Select */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className='relative mb-4'
        >
          <FaHotel className='absolute left-3 top-3 text-gray-400' />
          <select
            id='hotelId'
            name='hotelId'
            value={formData.hotelId}
            onChange={handleInputChange}
            className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          >
            <option value=''>Select Hotel</option>
            {hotels &&
              hotels.map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
          </select>
        </motion.div>

        {/* Category Input */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <input
            type='text'
            name='category'
            value={formData.category}
            onChange={handleInputChange}
            placeholder='Enter Category Name'
            className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          />
        </motion.div>

        {/* Bed Type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className='relative'
        >
          <FaBed className='absolute left-3 top-3 text-gray-400' />
          <input
            type='text'
            id='bedType'
            name='bedType'
            value={formData.bedType}
            onChange={handleInputChange}
            placeholder='Enter Bed Type'
            className='pl-10 w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          />
        </motion.div>

        {/* Adult Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className='relative'
        >
          <FaUsers className='absolute left-3 top-3 text-gray-400' />
          <input
            type='number'
            id='adultCount'
            name='adultCount'
            value={formData.adultCount}
            onChange={handleInputChange}
            placeholder='Enter Number of Adults'
            className='pl-10 w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          />
        </motion.div>

        {/* Room Size */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className='relative'
        >
          <FaRulerCombined className='absolute left-3 top-3 text-gray-400' />
          <input
            type='number'
            id='roomSize'
            name='roomSize'
            value={formData.roomSize}
            onChange={handleInputChange}
            placeholder='Enter Room Size (sqft)'
            className='pl-10 w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          />
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
        >
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleInputChange}
            placeholder='Enter Room Description'
            className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
          ></textarea>
        </motion.div>

        {/* Per Guest Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
        >
          <div className='relative'>
            <FaRupeeSign className='absolute left-2 top-3 text-gray-400' />
            <input
              type='number'
              id='perGuestPrice'
              name='perGuestPrice'
              value={formData.perGuestPrice}
              onChange={handleInputChange}
              placeholder='Enter Price Per Guest'
              className='w-full pl-10 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
            />
          </div>
        </motion.div>

        {/* Price */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <div className='relative'>
            <FaRupeeSign className='absolute left-3 top-3 text-gray-400' />
            <input
              type='number'
              id='price'
              name='price'
              value={formData.price}
              onChange={handleInputChange}
              className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Enter Price'
            />
          </div>
          {errors.price && (
            <p className='mt-1 text-sm text-red-600'>{errors.price}</p>
          )}
        </motion.div>

        {/* Discount */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 1 }}
        >
          <div className='relative'>
            <FaPercent className='absolute left-3 top-3 text-gray-400' />
            <input
              type='number'
              id='discount'
              name='discount'
              value={formData.discount}
              onChange={handleInputChange}
              className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              placeholder='Enter Discount (Optional)'
            />
          </div>
          {errors.discount && (
            <p className='mt-1 text-sm text-red-600'>{errors.discount}</p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className='mt-6'
        >
          <h2 className='text-lg font-semibold mb-6'>Room Amenities</h2>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4'>
            {amenitiesData &&
              amenitiesData.map((amenity) => (
                <div key={amenity.id} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={formData.amenities.some(
                      (selectedAmenity) => selectedAmenity.name === amenity.name
                    )}
                    onChange={() => handleAmenityChange(amenity)}
                  />
                  <label className='flex items-center text-sm text-gray-700'>
                    <img
                      src={amenity.icon}
                      alt={amenity.name}
                      className='mr-2 w-5 h-5'
                    />{' '}
                    {/* Render icon */}
                    {amenity.name}
                  </label>
                </div>
              ))}
          </div>
          <div className='mt-10'>
            <button
              type='button'
              onClick={showAmenityModal}
              className='cta py-2 w-full rounded-md'
            >
              Add new room amenity
            </button>
          </div>
        </motion.div>

        {/* Category Image Upload */}
        <div className='mb-4 border-2 py-4 rounded-lg border-dashed flex justify-center'>
          <label
            htmlFor='hotel-image-upload'
            className='cursor-pointer flex flex-col items-center justify-center px-4 py-2 transition-colors duration-300'
          >
            <FaCloudUploadAlt className='text-color text-4xl' />{' '}
            <span className='mt-2'>Upload Images</span>{' '}
          </label>
          <input
            id='hotel-image-upload'
            type='file'
            multiple
            accept='image/*'
            onChange={handleImageUpload}
            className='hidden'
          />
        </div>

        {/* Image Preview */}
        <div className='grid grid-cols-3 gap-4 mb-4'>
          {categoryImages.map((image, index) => (
            <div key={index} className='relative'>
              <img
                src={image.url}
                alt={`Category ${index + 1}`}
                className='w-full h-32 object-cover rounded-md'
              />
              <button
                onClick={() => handleImageDelete(index)}
                className='absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors duration-300'
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        {/* Add Category Button */}
        <button
          type='button'
          onClick={handleAddCategory}
          className='w-full px-4 py-2 text-white font-semibold rounded-md cta focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300'
        >
          Add Category
        </button>
      </div>

      <h1 className='text-3xl font-bold mb-6 text-start'>Room Listing</h1>
      <form className='mb-8 space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <label
              htmlFor='hotelId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Hotel
            </label>
            <div className='relative'>
              <FaHotel className='absolute left-3 top-3 text-gray-400' />
              <select
                id='hotelId'
                name='hotelId'
                value={selectedHotelId}
                onChange={(e) => setSelectedHotelId(e.target.value)}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value=''>Select Hotel</option>
                {hotels &&
                  hotels.map((hotel) => (
                    <option key={hotel.id} value={hotel.id}>
                      {hotel.name}
                    </option>
                  ))}
              </select>
            </div>
            {errors.hotelId && (
              <p className='mt-1 text-sm text-red-600'>{errors.hotelId}</p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label
              htmlFor='roomCategoryId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Room Category
            </label>
            <div className='relative'>
              <FaBed className='absolute left-3 top-3 text-gray-400' />
              <select
                id='roomCategoryId'
                name='roomCategoryId'
                value={roomCategoryId}
                disabled={!selectedHotelId}
                onChange={(e) => setRoomCategoryId(e.target.value)}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value=''>Select Room Category</option>
                {roomCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>
            {errors.roomCategoryId && (
              <p className='mt-1 text-sm text-red-600'>
                {errors.roomCategoryId}
              </p>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <label
              htmlFor='roomCategoryId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Enter Room No.
            </label>
            <div className='relative'>
              <FaBed className='absolute left-3 top-3 text-gray-400' />
              <input
                id='roomNo'
                name='roomNo'
                placeholder='Room number 102'
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                disabled={!roomCategoryId}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              ></input>
            </div>
            {errors.roomNo && (
              <p className='mt-1 text-sm text-red-600'>{errors.roomNo}</p>
            )}
          </motion.div>
        </div>

        <section className='mt-6 mb-4  rounded-lg shadow-sm'>
          <div className='flex justify-between flex-wrap gap-4 md:gap-10 text-xs leading-loose'>
            <button
              className='flex gap-4 justify-center items-center px-4 py-3.5 text-xs leading-loose rounded-md min-h-[45px] bg-white border border-solid border-zinc-300 text-neutral-800'
              // onClick={handlePrevious}
            >
              <img
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/fdb0c970f410df03561f81973edcc532a431f49e2267e19a28c48dff71cff4c1?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                alt=''
                className='object-contain shrink-0 self-stretch my-auto w-3.5 aspect-[1.27]'
              />
              <span className='self-stretch my-auto'>Go to Previous</span>
            </button>

            <button
              className='flex gap-4  cta justify-center items-center px-4 py-3.5 text-xs leading-loose rounded-md min-h-[45px] text-white'
              onClick={handleFormSubmit}
            >
              <span className='self-stretch my-auto'>Add & Continue</span>
              <img
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/71f8756073f7c484fb75bd1c8d99ff0e943df76f946819ab27aa9900feaa7d0f?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                alt=''
                className='object-contain shrink-0 self-stretch my-auto w-3.5 aspect-[1.27]'
              />
            </button>
          </div>
        </section>
      </form>
      <div>
        <Modal
          width={500}
          open={openModel}
          footer={null}
          onCancel={onCancelModal}
        >
          <AddAmenity fetchAllAmenities={fetchAllAmenities} />
        </Modal>
      </div>
    </div>
  );
};

export default AddNewRoom;
