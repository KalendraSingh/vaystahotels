import React, { useState, useEffect, useRef } from 'react';
import {
  getVendorProfile,
  updateVendorProfile,
} from '../../../../api/Vendor/profileApi';
import { useAuth } from '../../../Hooks/useAuth';

import { FiUpload, FiX } from 'react-icons/fi';
import { notification } from 'antd';
import { Link } from 'react-router-dom';

function Profile() {
  const [name, setName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('...............');
  const [email, setEmail] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(
    'https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png'
  );
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const [toggleOptions, setToggleOptions] = useState([
    { label: 'Email me for any Queries', checked: true },
    { label: 'Notify me for any important updates', checked: false },
  ]);

  const { vendorAuth } = useAuth();

  const vendorId = vendorAuth.data && vendorAuth.data.id;

  const fetchVendorData = async () => {
    try {
      const res = await getVendorProfile(vendorId);
      if (res.status === 200) {
        setName(res.data.name);
        setEmail(res.data.email);
        setMobileNumber(res.data.phone);
        setPreviewUrl(res.data.profileImage);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const updateVendorProfileData = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', mobileNumber);
    formData.append('profileImg', selectedImage);
    try {
      const res = await updateVendorProfile(formData, vendorId);
      if (res.status === 200) {
        notification.success({
          message: 'Profile updated successfully',
        });
        fetchVendorData();
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: 'Error: In profile updating',
      });
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file (PNG, JPG, JPEG)');
        return;
      }

      if (file.size > maxSize) {
        setError('Image size should not exceed 5MB');
        return;
      }

      setSelectedImage(file);
      setError('');

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(
      'https://res.cloudinary.com/sangamjone/image/upload/v1729827816/Img/wirewings/AoneHotel/3135715_r2qcdr.png'
    );
    setError('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      const fakeEvent = { target: { files: [file] } };
      handleImageChange(fakeEvent);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, []);

  const handleToggleChange = (index) => {
    const updatedOptions = [...toggleOptions];
    updatedOptions[index].checked = !updatedOptions[index].checked;
    setToggleOptions(updatedOptions);
  };

  const contactDetails = [
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/4b3adc8396f0d2349a4d7ef3c2c18b92dfbbf17f87886157703bc64162286385?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      text: '+91 8840621562',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/1a11746ad4182d5a583c1fa6fb3c1decfd3879c3b67a26fc42a40d13ebf3c3fb?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      text: 'mreverieroomspvtltd@gmail.com',
    },
  ];

  const ContactInfo = ({ icon, text }) => (
    <div className='flex items-center gap-3'>
      <div>
        <img
          loading='lazy'
          src={icon}
          alt=''
          className='object-contain shrink-0 my-auto aspect-square'
        />
      </div>
      <div className='basis-auto'>{text}</div>
    </div>
  );

  return (
    <main className='flex flex-col rounded-none'>
      <section className='flex flex-col gap-10 px-16 py-8 bg-white rounded-lg max-md:px-5'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          <div className='flex flex-col items-center'>
            <div className='max-w-md mx-auto p-6'>
              <Link to={'/vendor-dashboard/addHotel'}>
                <div className='grid grid-cols-1 gap-5 mb-4'>
                  <button className='cta py-2 rounded-md'>
                    + Add new Property
                  </button>
                </div>
              </Link>
              <div className='space-y-4'>
                <div className='text-center'>
                  <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                    Profile Image
                  </h2>
                  <p className='text-gray-600 text-sm'>
                    Upload a profile picture for your account
                  </p>
                </div>

                <div
                  className='relative group'
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className='relative w-48 h-48 mx-auto'>
                    <img
                      src={previewUrl}
                      alt='Profile preview'
                      className='w-full h-full object-cover rounded-full shadow-lg transition-all duration-300 border-4 border-white'
                    />
                    {selectedImage && (
                      <button
                        onClick={handleRemoveImage}
                        className='absolute -top-2 -right-2 bg-red-500 text-white p-2 rounded-full shadow-md hover:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
                        aria-label='Remove image'
                      >
                        <FiX className='w-4 h-4' />
                      </button>
                    )}
                  </div>

                  <div className='mt-4'>
                    <label
                      htmlFor='image-upload'
                      className='block w-full px-4 py-3 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors duration-200 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2'
                    >
                      <div className='flex items-center justify-center space-x-2'>
                        <FiUpload className='w-5 h-5 text-gray-400' />
                        <span className='text-gray-600'>
                          Click or drag to upload image
                        </span>
                      </div>
                      <input
                        id='image-upload'
                        type='file'
                        ref={fileInputRef}
                        className='hidden'
                        accept='image/*'
                        onChange={handleImageChange}
                        aria-label='Upload profile image'
                      />
                    </label>
                  </div>

                  {error && (
                    <div
                      className='mt-2 text-red-500 text-sm text-center'
                      role='alert'
                    >
                      {error}
                    </div>
                  )}

                  <div className='mt-2 text-xs text-gray-500 text-center'>
                    Accepted formats: PNG, JPG, JPEG (max 5MB)
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Details Input Grid */}
          <div className='md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5'>
            <div className='flex flex-col'>
              <label className='font-medium text-zinc-700' htmlFor='name'>
                Your Name
              </label>
              <input
                type='text'
                id='name'
                className='py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='flex flex-col'>
              <label
                className='font-medium text-zinc-700'
                htmlFor='mobileNumber'
              >
                Mobile Number
              </label>
              <input
                type='text'
                id='mobileNumber'
                className='py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500'
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
              />
            </div>

            <div className='flex flex-col'>
              <label className='font-medium text-zinc-700' htmlFor='password'>
                Password
              </label>
              <div className='flex items-center gap-2'>
                <input
                  type='password'
                  id='password'
                  className='py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500 flex-1'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className='flex flex-col'>
              <label className='font-medium text-zinc-700' htmlFor='email'>
                Email Address
              </label>
              <input
                type='text'
                id='email'
                disabled={true}
                className='py-2 pl-4 mt-1.5 bg-white border border-zinc-300 rounded-md text-gray-500'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              {/* Toggle Switches */}
              <div className='grid grid-cols-1 gap-5'>
                <button
                  onClick={updateVendorProfileData}
                  className='cta py-2 rounded-md'
                >
                  Update Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Profile;
