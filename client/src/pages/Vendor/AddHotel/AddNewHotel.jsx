import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import {
  FaHotel,
  FaCity,
  FaMapMarkerAlt,
  FaGlobe,
  FaMapPin,
  FaLandmark,
  FaTrash,
  FaCloudUploadAlt,
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import { addNewHotel } from '../../../../api/Vendor/HotelApi';
import { getAllCities, getAllAmenities } from '../../../../api/Public/HotelApi';
import { notification } from 'antd';
import AddNewCity from './AddNewCity';
import AddAmenity from './AddAmenity';
import Map from '../../../components/Map/Map';
import { useAuth } from '../../../Hooks/useAuth';

const AddHotel = () => {
  const { vendorAuth } = useAuth();
  let vendorId = null;
  if (vendorAuth?.data.role === 'vendorStaff') {
    vendorId = vendorAuth && vendorAuth.data?.vendorId;
  } else {
    vendorId = vendorAuth && vendorAuth.data.id;
  }

  const [formData, setFormData] = useState({
    type: '',
    name: '',
    phone: '',
    website: '',
    email: '',
    city: '',
    state: '',
    country: '',
    zipcode: '',
    landmark: '',
    avgPrice: '',
    description: '',
    cityAddressId: '',
    bannerImage: null,
    vendorId: vendorId,
    amenities: [],
  });

  const [mapData, setMapData] = useState(null);

  const [errors, setErrors] = useState({});
  const [suggestions, setSuggestions] = useState({});
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [cityData, setCityData] = useState('');
  const [amenitiesData, setAmenitiesData] = useState('');

  const showModal = () => {
    setOpen(true);
  };

  const showAmenityModal = () => {
    setOpenModel(true);
  };

  const handleCancel = () => {
    setOpen(false);
  };
  const onCancelModal = () => {
    setOpenModel(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const sendData = (data) => {
    setMapData(data);
  };

  const handleCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cityData.find((city) => city.id === selectedCityId);

    if (selectedCity) {
      setFormData((prevData) => ({
        ...prevData,
        city: selectedCity.city,
        cityAddressId: selectedCityId,
      }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        bannerImage: file,
      }));
    }
  };

  const removeBannerImage = () => {
    setFormData((prevData) => ({
      ...prevData,
      bannerImage: null,
    }));
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

  const validateField = (name, value) => {
    let newErrors = { ...errors };
    switch (name) {
      case 'type':
        if (!value.trim()) {
          newErrors.type = 'Hotel type is required';
        } else {
          delete newErrors.type;
        }
        break;
      case 'name':
        if (!value.trim()) {
          newErrors.name = 'Hotel name is required';
        } else {
          delete newErrors.name;
        }
        break;
      case 'zipcode':
        if (!/^\d{6}$/.test(value)) {
          newErrors.zipcode = 'Invalid zipcode format';
        } else {
          delete newErrors.zipcode;
        }
        break;
      case 'description':
        if (value.trim().length < 50) {
          newErrors.description =
            'Description should be at least 50 characters long';
        } else {
          delete newErrors.description;
        }
        break;
      default:
        if (!value.trim()) {
          newErrors[name] = `${
            name.charAt(0).toUpperCase() + name.slice(1)
          } is required`;
        } else {
          delete newErrors[name];
        }
    }
    setErrors(newErrors);
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      const mockSuggestions = {
        city: ['New York', 'Los Angeles', 'Chicago'],
        state: ['California', 'Texas', 'Florida'],
        country: ['United States', 'Canada', 'United Kingdom'],
      };
      setSuggestions(mockSuggestions);
    };
    fetchSuggestions();
  }, []);

  useEffect(() => {
    fetchAllCities();
    fetchAllAmenities();
  }, []);

  const fetchAllCities = async () => {
    const res = await getAllCities();

    if (res.status === 200 && res.data.length > 0) {
      setCityData(res.data);
    }
  };

  const fetchAllAmenities = async () => {
    const res = await getAllAmenities();
    if (res.status === 200 && res.data.length > 0) {
      setAmenitiesData(res.data);
    }
  };

  const renderSuggestions = (field) => {
    if (!suggestions[field] || !formData[field]) return null;
    const filteredSuggestions = suggestions[field].filter((item) =>
      item.toLowerCase().includes(formData[field].toLowerCase())
    );

    return (
      <ul className='absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg'>
        {filteredSuggestions.map((item, index) => (
          <li
            key={index}
            className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
            onClick={() => {
              setFormData({ ...formData, [field]: item });
              validateField(field, item);
            }}
          >
            {item}
          </li>
        ))}
      </ul>
    );
  };

  const handleSaveAndContinue = async () => {
    if (
      !formData.name ||
      !formData.type ||
      !formData.phone ||
      !formData.email ||
      !formData.city ||
      !formData.avgPrice ||
      !formData.country ||
      !formData.name ||
      !formData.zipcode ||
      !formData.state ||
      !formData.amenities ||
      !formData.bannerImage ||
      !formData.cityAddressId
    ) {
      notification.error({
        message: 'All fields are requied',
      });
      return;
    }

    const formDataToSend = new FormData();

    formDataToSend.append('name', formData.name);
    formDataToSend.append('type', formData.type);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('zipcode', formData.zipcode);
    formDataToSend.append('landmark', formData.landmark);
    formDataToSend.append('avgPrice', formData.avgPrice);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('cityAddressId', formData.cityAddressId);
    formDataToSend.append('vendorId', formData.vendorId);
    formDataToSend.append('latitude', mapData.latitude);
    formDataToSend.append('longitude', mapData.longitude);
    formDataToSend.append('location', mapData.location);

    if (formData.bannerImage) {
      formDataToSend.append('bannerImage', formData.bannerImage);
    }

    formDataToSend.append('amenities', JSON.stringify(formData.amenities));

    try {
      const res = await addNewHotel(formDataToSend);
      if (res.status === 201) {
        setFormData({
          type: '',
          name: '',
          phone: '',
          website: '',
          email: '',
          city: '',
          state: '',
          country: '',
          zipcode: '',
          landmark: '',
          avgPrice: '',
          location: '',
          description: '',
          cityAddressId: '',
          bannerImage: null,
          vendorId: vendorId,
          amenities: [],
        });
        setMapData(null);
        notification.success({
          message: 'Hotel Information created!',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className=' mx-auto p-6 bg-white rounded-lg shadow-xl'>
      <h1 className='text-2xl text-start'>Add hotel Details</h1>
      <div className='py-4'>
        <button className='cta px-3 py-2 rounded-md' onClick={showModal}>
          Add New City
        </button>
      </div>
      <form className='space-y-6'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor='type'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Select Type
            </label>
            <div className='relative'>
              <FaHotel className='absolute left-3 top-3 text-gray-400' />
              <select
                id='type'
                name='type'
                value={formData.type}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
              >
                <option value='stay'>Home Stay</option>
                <option value='hotel'>Hotel</option>
              </select>
            </div>
            {errors.type && (
              <p className='mt-1 text-sm text-red-600'>{errors.type}</p>
            )}
          </motion.div>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Hotel Name
            </label>
            <div className='relative'>
              <FaHotel className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter hotel name'
                aria-label='Hotel Name'
              />
            </div>
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </motion.div>

          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor='phone'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Hotel Phone Number
            </label>
            <div className='relative'>
              <FaHotel className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='phone'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter hotel phone number'
                aria-label='Hotel phone number'
              />
            </div>
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </motion.div>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Hotel email
            </label>
            <div className='relative'>
              <FaHotel className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter hotel email'
                aria-label='Hotel email'
              />
            </div>
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </motion.div>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <label
              htmlFor='website'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Hotel website
            </label>
            <div className='relative'>
              <FaHotel className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='website'
                name='website'
                value={formData.website}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter hotel website url'
                aria-label='Hotel website'
              />
            </div>
            {errors.name && (
              <p className='mt-1 text-sm text-red-600'>{errors.name}</p>
            )}
          </motion.div>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label
              htmlFor='avgPrice'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Average Price
            </label>
            <div className='relative'>
              {/* <FaLandmark className='absolute left-3 top-3 text-gray-400' /> */}
              <div className='absolute left-3 top-3 text-gray-500'>₹</div>
              <input
                type='number'
                id='avgPrice'
                name='avgPrice'
                value={formData.avgPrice}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter average price'
                aria-label='avgPrice'
              />
            </div>
            {errors.avgPrice && (
              <p className='mt-1 text-sm text-red-600'>{errors.avgPrice}</p>
            )}
          </motion.div>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <label
              htmlFor='country'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Country
            </label>
            <div className='relative'>
              <FaGlobe className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='country'
                name='country'
                value={formData.country}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter country'
                aria-label='Country'
              />
            </div>
            {renderSuggestions('country')}
            {errors.country && (
              <p className='mt-1 text-sm text-red-600'>{errors.country}</p>
            )}
          </motion.div>

          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <label
              htmlFor='state'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              State
            </label>
            <div className='relative'>
              <FaMapMarkerAlt className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='state'
                name='state'
                value={formData.state}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter state'
                aria-label='State'
              />
            </div>
            {renderSuggestions('state')}
            {errors.state && (
              <p className='mt-1 text-sm text-red-600'>{errors.state}</p>
            )}
          </motion.div>

          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <label
              htmlFor='city'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              City
            </label>
            <div className='relative'>
              <FaCity className='absolute left-3 top-3 text-gray-400' />
              <select
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                value={formData.cityAddressId}
                onChange={(e) => handleCityChange(e)}
              >
                <option value=''>Select city</option>
                {cityData &&
                  cityData.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.city}
                    </option>
                  ))}
              </select>
            </div>
            {renderSuggestions('city')}
            {errors.city && (
              <p className='mt-1 text-sm text-red-600'>{errors.city}</p>
            )}
          </motion.div>

          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <label
              htmlFor='zipcode'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Zipcode
            </label>
            <div className='relative'>
              <FaMapPin className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='zipcode'
                name='zipcode'
                value={formData.zipcode}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter zipcode'
                aria-label='Zipcode'
              />
            </div>
            {errors.zipcode && (
              <p className='mt-1 text-sm text-red-600'>{errors.zipcode}</p>
            )}
          </motion.div>

          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label
              htmlFor='landmark'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Landmark
            </label>
            <div className='relative'>
              <FaLandmark className='absolute left-3 top-3 text-gray-400' />
              <input
                type='text'
                id='landmark'
                name='landmark'
                value={formData.landmark}
                onChange={handleChange}
                className='pl-10 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
                placeholder='Enter nearby landmark (optional)'
                aria-label='Landmark'
              />
            </div>
          </motion.div>
          <motion.div
            className='relative'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <label
              htmlFor='location'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Location
            </label>
            <div className='relative'>
              <Map sendData={sendData} />
            </div>
            {errors.location && (
              <p className='mt-1 text-sm text-red-600'>{errors.location}</p>
            )}
          </motion.div>
        </div>

        <motion.div
          className='relative'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700 mb-1'
          >
            Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            rows='4'
            className='w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500'
            placeholder='Enter hotel description'
            aria-label='Description'
          ></textarea>
          {errors.description && (
            <p className='mt-1 text-sm text-red-600'>{errors.description}</p>
          )}
        </motion.div>

        <motion.div
          className='relative'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className='py-4'>
            <label
              htmlFor='bannerImage'
              className='block text-sm font-medium text-gray-700 mb-2'
            >
              Banner Image
            </label>

            {/* Hidden File Input */}
            <input
              type='file'
              id='bannerImage'
              accept='image/*'
              className='hidden'
              onChange={handleImageUpload}
            />

            {/* Upload Cloud Icon Button */}
            <label
              htmlFor='bannerImage' // Link the label to the input for click functionality
              className='cursor-pointer flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500'
            >
              <FaCloudUploadAlt className='text-4xl text-color' />
              <span className='text-sm text-gray-500'>
                Click to upload banner image
              </span>
            </label>

            {/* Display the image preview with delete icon */}

            {formData.bannerImage && (
              <div className='relative mt-4'>
                <img
                  src={URL.createObjectURL(formData.bannerImage)}
                  alt='Banner Preview'
                  className='w-40 h-40 object-cover rounded-md'
                />
                {/* Delete icon */}
                <button
                  type='button'
                  className='absolute top-0 right-0 text-red-600'
                  onClick={removeBannerImage}
                >
                  <FaTrash className='text-xl' />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className='relative'
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className='py-4'>
            <button
              type='button'
              onClick={showAmenityModal}
              className='cta py-2 px-3 rounded-md'
            >
              Add new amenity
            </button>
          </div>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Hotel Amenities
          </label>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {amenitiesData &&
              amenitiesData.map((amenity) => (
                <div key={amenity.id} className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    checked={formData.amenities.some(
                      (selectedAmenity) => selectedAmenity.name === amenity.name
                    )} // Check if the amenity object is already in the selected list
                    onChange={() => handleAmenityChange(amenity)} // Pass the entire amenity object (name and icon)
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
      </form>

      <section className='mt-6 mb-4  rounded-lg shadow-sm'>
        <div className='flex justify-between flex-wrap gap-4 md:gap-10 leading-loose'>
          <button
            className='flex gap-4  cta justify-center items-center px-6 py-2 text-[16px] leading-loose rounded-md  text-white'
            onClick={handleSaveAndContinue}
          >
            <span className='self-stretch my-auto'>Submit</span>
          </button>
        </div>
      </section>

      <div>
        <Modal width={1000} open={open} footer={null} onCancel={handleCancel}>
          <AddNewCity />
        </Modal>
      </div>
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

export default AddHotel;
