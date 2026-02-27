import React, { useState } from 'react';
import { IoMdEyeOff } from 'react-icons/io';
import { IoEye } from 'react-icons/io5';
import LoginImgSlider from '../../../components/LoginImgSlider/LoginImgSlider';
import { Link, useNavigate } from 'react-router-dom';
import { adminLogin } from '../../../../api/Admin/AuthApi';
import { notification } from 'antd';
import { useAuth } from '../../../Hooks/useAuth';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { setAdminAuth } = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allData = {
      email,
      password,
    };
    try {
      const res = await adminLogin(allData);
      if (res.status === 200) {
        setAdminAuth(res.data);
        notification.success({
          message: 'Login Successfully!',
        });
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <main className='py-6'>
      <section className='mt-4 w-full px-4 mx-auto max-w-4xl'>
        <div className=''>
          <form onSubmit={handleSubmit} className=''>
            <div className='flex flex-col self-stretch my-auto w-full text-sm text-zinc-700 max-md:mt-10 max-md:max-w-full'>
              <h1 className='self-start text-3xl font-medium text-zinc-700 max-md:ml-1'>
                Login
              </h1>
              <p className='self-start mt-1.5 leading-loose max-md:ml-1'>
                Login to access your Account
              </p>
              <div className='px-4 py-4 mt-9 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5 max-md:max-w-full'>
                <label htmlFor='email' className='sr-only'>
                  email
                </label>
                <input
                  id='email'
                  type='text'
                  placeholder='email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full bg-transparent border-none focus:outline-none'
                  required
                />
              </div>
              <div className='flex gap-5 justify-between p-4 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:max-w-full'>
                <label htmlFor='password' className='sr-only'>
                  Password
                </label>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='w-full bg-transparent border-none focus:outline-none'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <IoEye className='w-6 h-6' />
                  ) : (
                    <IoMdEyeOff className='w-6 h-6' />
                  )}
                </button>
              </div>
              <button
                type='submit'
                className='gap-1 cta self-center px-4 py-3.5 mt-9 max-w-full text-base font-medium text-white whitespace-nowrap  rounded min-h-[50px] w-[383px]  transition-colors'
              >
                Continue
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
