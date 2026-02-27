import React, { useState, useEffect } from 'react';
import { FaCloudUploadAlt, FaTrash } from 'react-icons/fa';
import { getAllHotels } from '../../../../api/Public/HotelApi';
import { addHotelImages } from '../../../../api/Vendor/HotelApi';
import { notification } from 'antd';

const AddHotelImages = () => {
  const [selectedHotelId, setSelectedHotelId] = useState('');
  const [selectedImageCategory, setSelectedImageCategory] = useState('');
  const [hotelImages, setHotelImages] = useState([]);
  const [hotels, setHotels] = useState([]);

  console.log('hotelImages', hotelImages);

  const imageCategories = [
    
    { id: 'Banner', name: 'Banner' },
    { id: 'Reception', name: 'Reception' },
    { id: 'Corridor', name: 'Corridor' },
    { id: 'Lobby', name: 'Lobby' },
    { id: 'SwimmingPool', name: 'Swimming Pool' },
    { id: 'Restaurant', name: 'Restaurant' },
    { id: 'Gym', name: 'Gym' },
    { id: 'ConferenceHall', name: 'Conference Hall' },
    { id: 'Garden', name: 'Garden' },
    { id: 'Spa', name: 'Spa' },
    { id: 'Parking', name: 'Parking' },
    { id: 'Other', name: 'Other' },
  ];

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    const res = await getAllHotels();
    if (res.status === 200 && res.data.length > 0) {
      setHotels(res.data.map((item) => ({ name: item.name, id: item.id })));
    }
  };

  const handleHotelChange = (e) => {
    setSelectedHotelId(e.target.value);
  };

  const handleImageCategoryChange = (e) => {
    setSelectedImageCategory(e.target.value);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setHotelImages([...hotelImages, ...newImages]);
  };

  const handleImageDelete = (index) => {
    const updatedImages = hotelImages.filter((_, i) => i !== index);
    setHotelImages(updatedImages);
  };

  const handleSubmit = async () => {
    if (
      !selectedHotelId ||
      !selectedImageCategory ||
      hotelImages.length === 0
    ) {
      notification.error({
        message: 'Please select hotel, category, and images.',
      });
      return;
    }

    const formData = new FormData();
    formData.append('hotelId', selectedHotelId);
    formData.append('category', selectedImageCategory);

    hotelImages.forEach((image) => {
      formData.append(`hotelImage`, image.file);
    });

    try {
      const res = await addHotelImages(formData);
      if (res.status === 201) {
        notification.success({
          message: 'Images uploaded successfully!',
        });
        setHotelImages([]);
        setSelectedHotelId('');
        setSelectedImageCategory('');
      } else {
        notification.error({
          message: 'Failed to upload images.',
        });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className='max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-2xl mb-6 text-start'>Hotel Image Upload</h1>
      <div className='mb-8 p-4 border border-gray-300 rounded-md'>
        <select
          value={selectedHotelId}
          onChange={handleHotelChange}
          className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
        >
          <option value=''>Select Hotel</option>
          {hotels.map((hotel) => (
            <option key={hotel.id} value={hotel.id}>
              {hotel.name}
            </option>
          ))}
        </select>

        <select
          value={selectedImageCategory}
          onChange={handleImageCategoryChange}
          className='w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
        >
          <option value=''>Select Image Category</option>
          {imageCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {selectedImageCategory && (
          <div className='mb-4 border-2 py-4 rounded-lg border-dashed flex justify-center'>
            <label
              htmlFor='hotel-image-upload'
              className='cursor-pointer flex flex-col items-center justify-center px-4 py-2 transition-colors duration-300'
            >
              <FaCloudUploadAlt className='text-color text-4xl' />{' '}
              <span className='mt-2'>Upload Hotel Images</span>{' '}
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
        )}

        <div className='grid grid-cols-3 gap-4 mb-4'>
          {hotelImages.map((image, index) => (
            <div key={index} className='relative'>
              <img
                src={image.url}
                alt={`Hotel ${index + 1}`}
                className='w-full h-32 object-cover rounded-md'
              />
              <span className='absolute top-2 left-2 bg-white bg-opacity-75 px-2 py-1 rounded text-sm'>
                {imageCategories.find((cat) => cat.id === image.category)?.name}
              </span>
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
            onClick={handleSubmit}
          >
            <span className='self-stretch my-auto'>Save & Continue</span>
            <img
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/71f8756073f7c484fb75bd1c8d99ff0e943df76f946819ab27aa9900feaa7d0f?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
              alt=''
              className='object-contain shrink-0 self-stretch my-auto w-3.5 aspect-[1.27]'
            />
          </button>
        </div>
      </section>
    </div>
  );
};

export default AddHotelImages;
