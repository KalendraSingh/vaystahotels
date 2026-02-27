import React, { useEffect, useState } from 'react';
import LoginImgSlider from '../../../components/LoginImgSlider/LoginImgSlider';
import { notification } from 'antd';
import { userRegister } from '../../../../api/Customer/AuthApi';

import { Link } from 'react-router-dom';
const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      notification.error({
        message: 'Password Error',
        description: 'Password and Confirm Password do not match.',
      });
      return;
    }

    try {
      const res = await userRegister(formData);
      if (res.status === 200) {
        notification.success({
          message: res.data.message,
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.log('Error:', error);
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notification.error({
          message: 'Registration Error',
          description: error.response.data.message,
        });
      } else {
        notification.error({
          message: 'Error',
          description: 'Something went wrong. Please try again.',
        });
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
    <header className="w-full sticky top-0 z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center ml-4 space-x-3">
            <img
              src="/vaystaF.png"
              alt="Company logo"
              className="w-14 sm:w-12 md:w-16 object-contain mr-4"
            />
            <span className="hidden sm:inline text-xl sm:text-2xl font-bold text-yellow-800">
              Vaysta Hotels
            </span>
          </Link>

          {/* Register Button */}
          <Link
            to="/login"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded-lg transition shadow-md"
          >
             Login
          </Link>
        </div>
      </header>
    <div className="flex overflow-hidden flex-col items-center pb-32 bg-[#fffdf5] max-md:pb-24">
  <div className="mt-4 w-full px-4 lg:px-6 xl:px-0 max-w-[1147px] max-md:mt-10 max-md:max-w-full">
    <div className="flex gap-5 max-md:flex-col">
      {window.innerWidth > 1024 && <LoginImgSlider />}

      <div className="flex flex-col lg:ml-5 lg:w-6/12 w-full px-4 sm:px-20 md:px-56 lg:px-0">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col mt-2.5 w-full text-sm text-zinc-700 max-md:mt-10 max-md:max-w-full"
        >
          <h2 className="self-start text-3xl font-bold text-[#7A4C00] max-md:ml-0.5">
            Create an Account
          </h2>
          <p className="self-start mt-3 leading-6 text-zinc-700 max-md:ml-0.5">
            Let’s get you all set up so you can access your personal account.
          </p>

          <div className="flex gap-5 mt-7 leading-loose max-md:max-w-full">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="First Name"
              className="px-4 py-5 bg-white rounded-md border border-solid border-zinc-300 w-full focus:outline-none"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Email address"
            className="px-4 py-5 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 w-full focus:outline-none"
            required
          />

          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Mobile Number"
            className="px-4 py-5 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 w-full focus:outline-none"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Password"
            className="w-full px-4 py-5 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 focus:outline-none"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            placeholder="Confirm Password"
            className="w-full px-4 py-5 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 focus:outline-none"
            required
          />

          <button
            type="submit"
            className="self-center w-[383px] px-4 py-3.5 mt-6 text-base font-semibold text-[#0D0D0D] bg-gradient-to-br from-[#D4AF37] to-[#FFD700] rounded-md transition duration-300 hover:from-[#E5C100] hover:to-[#FFD700]"
          >
            Create an Account
          </button>

          <div className="self-center mt-5 leading-loose text-center text-orange-600">
            Already have an account?{' '}
            <Link to="/login">
              <span className="text-orange-600 cursor-pointer hover:underline">
                Sign in
              </span>
            </Link>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>
</>
  );
};

export default Signup;
