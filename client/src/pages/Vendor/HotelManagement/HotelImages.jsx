import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import {
  updateHotelImages,
  deleteHotelImages,
} from '../../../../api/Vendor/HotelApi';
import { notification } from 'antd';

const AddHotelImages = ({ hotelImageData, hotelId }) => {
  const [selectedImageCategory, setSelectedImageCategory] = useState('');
  const [filteredImages, setFilteredImages] = useState([]);
  const [categoryId, setCategoryId] = useState('');

  const imageCategories = hotelImageData?.map((item) => item.category) || [];
  useEffect(() => {
    if (imageCategories.length > 0) {
      const initialCategory = imageCategories[0];
      setSelectedImageCategory(initialCategory);
      const initialData = hotelImageData.find(
        (item) => item.category === initialCategory
      );
      setFilteredImages(initialData?.imageUrls || []);
      setCategoryId(initialData?.id || '');
    }
  }, [hotelImageData]);

  const handleImageCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setSelectedImageCategory(selectedCategory);
    const categoryData = hotelImageData.find(
      (item) => item.category === selectedCategory
    );
    setFilteredImages(categoryData?.imageUrls || []);
    setCategoryId(categoryData?.id || '');
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setFilteredImages([...filteredImages, ...newImages]);
  };

  const handleImageDelete = (imageIndex) => {
    setFilteredImages(filteredImages.filter((_, idx) => idx !== imageIndex));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('hotelId', hotelId);
    formData.append('category', selectedImageCategory);

    const existingUrls = [];

    filteredImages.forEach((image) => {
      if (image.file) {
        formData.append('hotelImage', image.file);
      } else {
        existingUrls.push(image);
      }
    });

    existingUrls.forEach((url) => {
      formData.append('existingImageUrls[]', url);
    });

    try {
      const res = await updateHotelImages(formData);
      if (res.status === 200) {
        notification.success({ message: 'Images updated successfully!' });
      } else {
        notification.error({ message: 'Failed to upload images.' });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      notification.error({
        message: error?.response?.data?.message || 'Error uploading images.',
      });
    }
  };

  const handleImagesDelete = async () => {
    try {
      const res = await deleteHotelImages(categoryId); // Use categoryId here
      if (res.status === 200) {
        notification.success({
          message: 'Hotel Images deleted successfully',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Failed to delete images',
      });
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-2xl mb-6 text-start'>Hotel Image Upload</h1>
      <div className='mb-8 p-4 border border-gray-300 rounded-md'>
        <select
          value={selectedImageCategory}
          onChange={handleImageCategoryChange}
          className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
        >
          <option value=''>Select Image Category</option>
          {imageCategories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <div className='mb-4 border-2 py-4 rounded-lg border-dashed flex justify-center'>
          <label
            htmlFor='hotel-image-upload'
            className='cursor-pointer flex flex-col items-center justify-center px-4 py-2 transition-colors duration-300'
          >
            <FaCloudUploadAlt className='text-color text-4xl' />
            <span className='mt-2'>Upload Hotel Images</span>
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

        <div className='grid grid-cols-3 gap-4 mb-4'>
          {filteredImages.map((image, index) => (
            <div key={index} className='relative'>
              <img
                src={image.url || image}
                alt={`Hotel ${index + 1}`}
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
      </div>

      <div className='flex gap-4 '>
        <button
          onClick={handleSubmit}
          className='cta text-white px-2 rounded-md '
        >
          Update
        </button>

        <button
          onClick={handleImagesDelete}
          className=' text-white bg-red-500 py-2 px-4 rounded-md'
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AddHotelImages;
