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
  FaEdit,
  FaTrashAlt,
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import { addHotelRoomCategory } from '../../../../api/Vendor/HotelApi';
import { addNewRoom } from '../../../../api/Vendor/RoomApi';

import { getAllAmenities } from '../../../../api/Public/RoomApi';
import {
  getRoomCategoryById,
  updateRoomCategory,
  deleteRoomById,
  updateActiveRoom,
  updateRoom,
  updateAvailabilityRoom,
} from '../../../../api/Vendor/RoomApi';

import { notification } from 'antd';
import { useParams } from 'react-router-dom';
import { Switch } from 'antd';

const AddNewRoom = () => {
  const [catData, setCatData] = useState(null);
  const [formData, setFormData] = useState({
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
  const [roomCategories, setRoomCategories] = useState([]);
  const [categoryImages, setCategoryImages] = useState([]);

  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [roomCategoryId, setRoomCategoryId] = useState('');
  const [roomNumbers, setRoomNumbers] = useState(
    catData &&
      catData.rooms.reduce((acc, room) => {
        acc[room.id] = room.roomNo || ''; // Initialize with current room numbers
        return acc;
      }, {})
  );
  const [amenitiesData, setAmenitiesData] = useState('');
  const { id } = useParams();
  const catId = id && id;

  useEffect(() => {
    fetchAllAmenities();
  }, []);

  useEffect(() => {
    if (id) {
      fetchRoomCategory(id);
    }
  }, [id]);

  const fetchAllAmenities = async () => {
    const res = await getAllAmenities();
    if (res.status === 200 && res.data.length > 0) {
      setAmenitiesData(res.data);
    }
  };

  const fetchRoomCategory = async (id) => {
    try {
      const res = await getRoomCategoryById(id);
      if (res.status === 200) {
        setCatData(res.data);
        setFormData({
          price: res.data.price || '',
          discount: res.data.discount || '',
          amenities: res.data.amenities || [],
          category: res.data.category || '',
          bedType: res.data.bedType || '',
          adultCount: res.data.adultCount || '',
          roomSize: res.data.roomSize || '',
          description: res.data.description || '',
          perGuestPrice: res.data.perGuestPrice || '',
        });
        setCategoryImages(res.data.categoryImage);
      }
    } catch (error) {
      console.log(error);
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

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file), // For previewing the new image
    }));
    setCategoryImages([...categoryImages, ...newImages]);
  };

  const handleImageDelete = (index) => {
    const updatedImages = categoryImages.filter((_, i) => i !== index);
    setCategoryImages(updatedImages);
  };

  const handleAddCategory = async () => {
    const catFormData = new FormData();
    catFormData.append('category', formData.category);
    catFormData.append('price', formData.price);
    catFormData.append('discount', formData.discount);
    catFormData.append('amenities', JSON.stringify(formData.amenities));
    catFormData.append('bedType', formData.bedType);
    catFormData.append('adultCount', formData.adultCount);
    catFormData.append('roomSize', formData.roomSize);
    catFormData.append('description', formData.description);
    catFormData.append('perGuestPrice', formData.perGuestPrice);

    const existingUrls = [];
    categoryImages.forEach((image) => {
      if (image.file) {
        catFormData.append('categoryImage', image.file);
      } else {
        existingUrls.push(image);
      }
    });

    existingUrls.forEach((url) => {
      catFormData.append('existingImageUrls[]', url);
    });

    try {
      const response = await updateRoomCategory(catFormData, id);
      if (response.status === 200) {
        notification.success({
          message: 'Category updated successfully!',
        });
        fetchRoomCategory(id);
      }
    } catch (error) {
      console.error(error);
      notification.error({
        message: error.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const handleInputRoomChange = (id, value) => {
    setRoomNumbers((prevState) => ({
      ...prevState,
      [id]: value, // Update the specific room's room number
    }));
  };

  const handleRoomUpdate = async (id) => {
    try {
      const data = {
        roomNo: roomNumbers[id],
      };
      const res = await updateRoom(id, data);
      if (res.status === 200) {
        notification.success({
          message: 'Room updated successfully!',
        });
        fetchRoomCategory(catId);
      }
    } catch (error) {
      notification.success({
        message: error.response.data.message,
      });
    }
  };
  const handleChangeAvailability = async (id) => {
    try {
      const res = await updateAvailabilityRoom(id);
      if (res.status === 200) {
        notification.success({
          message: 'Room availability updated successfully!',
        });
        fetchRoomCategory(catId);
      }
    } catch (error) {
      notification.success({
        message: error.response.data.message,
      });
    }
  };

  const handleChangeStatus = async (id) => {
    try {
      const res = await updateActiveRoom(id);
      if (res.status === 200) {
        notification.success({
          message: 'Room status updated successfully!',
        });
        fetchRoomCategory(catId);
      }
    } catch (error) {
      notification.success({
        message: error.response.data.message,
      });
    }
  };
  const handleDeleteRoom = async (id) => {
    try {
      const res = await deleteRoomById(id);
      if (res.status === 200) {
        notification.success({
          message: 'Room deleted successfully!',
        });
        fetchRoomCategory(catId);
      }
    } catch (error) {
      notification.success({
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className='mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-3xl font-bold mb-6 text-start'>
        Update Room Category
      </h1>

      <div className='mb-8 p-4 border border-gray-300 rounded-md gap-4 grid grid-cols-1 md:grid-cols-2'>
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
            rows={10}
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
                src={image.url || image} // Render new images (file-based) or existing URLs
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
        <div>
          <button
            type='button'
            onClick={handleAddCategory}
            className='w-full px-4 py-2 text-white font-semibold rounded-md cta focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-300'
          >
            Update Category
          </button>
        </div>
      </div>

      <h1 className='text-3xl font-bold mb-6 text-start'>Update Rooms</h1>
      <form className='mb-8 space-y-4'>
        <div className='grid grid-cols-1 gap-4'>
          <table className='min-w-full table-auto border-collapse border border-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-nowrap text-sm font-medium text-gray-600'>
                  Sr No.
                </th>
                <th className='px-6 py-3 text-left text-sm text-nowrap font-medium text-gray-600'>
                  Room No.
                </th>

                <th className='px-6 py-3 text-left text-sm text-nowrap font-medium text-gray-600'>
                  Availability
                </th>
                <th className='px-6 py-3 text-left text-sm text-nowrap font-medium text-gray-600'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-sm text-nowrap font-medium text-gray-600'>
                  Update Status
                </th>
                <th className='px-6 py-3 text-left text-sm text-nowrap font-medium text-gray-600'>
                  Update Availability
                </th>
                <th className='px-6 py-3 text-left text-sm text-nowrap font-medium text-gray-600'>
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {catData && catData.rooms.length > 0 ? (
                catData &&
                catData.rooms.map((room, index) => {
                  return (
                    <tr key={index} className='border-t border-gray-200'>
                      <td className='px-6 py-4 text-sm text-gray-600'>
                        {index + 1}
                      </td>
                      <td className='px-6 py-4 flex  text-sm text-gray-600'>
                        <div>
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: 0.1 }}
                          >
                            <div className='relative flex gap-2'>
                              <FaBed className='absolute left-3 top-3 text-gray-400' />
                              <input
                                id='roomNo'
                                name='roomNo'
                                placeholder='Room 102'
                                value={
                                  (roomNumbers && roomNumbers[room.id]) ??
                                  room.roomNo
                                }
                                onChange={(e) =>
                                  handleInputRoomChange(room.id, e.target.value)
                                }
                                className='pl-10 w-full py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                              ></input>
                              <button
                                type='button'
                                onClick={() => handleRoomUpdate(room.id)}
                                className='cta py-2 px-2 rounded-md'
                              >
                                Update
                              </button>
                            </div>
                          </motion.div>
                        </div>
                      </td>
                      <td>
                        <p
                          className={`text-center rounded-full  text-sm font-semibold text-white ${
                            room.isAvailable ? 'bg-green-500' : 'bg-red-500'
                          }`}
                        >
                          {room.isAvailable ? 'Available' : 'Unavailable'}
                        </p>
                      </td>
                      <td>
                        <p
                          className={`text-center rounded-full  text-sm font-semibold text-white ${
                            room.status ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                        >
                          {room.isActive ? 'Active' : 'Inactive'}
                        </p>
                      </td>
                      <td className='text-center'>
                        <Switch
                          checked={room.isActive}
                          onChange={() => handleChangeStatus(room.id)}
                        />
                      </td>
                      <td className='text-center'>
                        <Switch
                          checked={room.isAvailable}
                          onChange={() => handleChangeAvailability(room.id)}
                        />
                      </td>

                      <td className='px-6 py-4 flex space-x-4 text-gray-600'>
                        <button
                          type='button'
                          className='text-red-500 hover:text-red-700'
                          onClick={() => handleDeleteRoom(room.id)}
                        >
                          <FaTrashAlt className='inline-block text-lg' />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className='px-6 py-4 text-center text-sm text-gray-600 font-medium'
                  >
                    Room not found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};

export default AddNewRoom;
