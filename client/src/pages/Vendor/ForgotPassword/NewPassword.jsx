import React, { useEffect, useState } from 'react';
import { IoMdEyeOff } from 'react-icons/io';
import { IoEye } from 'react-icons/io5';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { notification } from 'antd';
import { resetPassword } from '../../../../api/Vendor/AuthApi';
import LoginImgSlider from '../../../components/LoginImgSlider/LoginImgSlider';

const VendorNewPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { token } = useParams();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notification.error({
        message: 'Passwords do not match!',
      });
      return;
    }

    const allData = {
      token,
      password: newPassword,
    };

    try {
      const res = await resetPassword(allData);
      if (res.status === 200) {
        setConfirmPassword('');
        setNewPassword('');
        notification.success({
          message: 'Password Updated Successfully!',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response?.data?.message || 'Error occurred!',
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className='py-6'>
      <section className='mt-4 w-full max-w-4xl mx-auto px-4'>
        <div className=''>
          <form onSubmit={handleSubmit} className=''>
            <div className='flex flex-col self-stretch my-auto w-full text-sm text-zinc-700 max-md:mt-10 max-md:max-w-full'>
              <h1 className='self-start text-3xl font-medium text-zinc-700 max-md:ml-1'>
                Create Password
              </h1>
              <p className='self-start mt-1.5 leading-loose max-md:ml-1'>
                Create a new password for your account
              </p>

              <div className='flex gap-5 justify-between p-4 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:max-w-full'>
                <label htmlFor='newPassword' className='sr-only'>
                  New Password
                </label>
                <input
                  id='newPassword'
                  type={showNewPassword ? 'text' : 'password'}
                  placeholder='New Password'
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className='w-full bg-transparent border-none focus:outline-none'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  aria-label={
                    showNewPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showNewPassword ? (
                    <IoEye className='w-6 h-6' />
                  ) : (
                    <IoMdEyeOff className='w-6 h-6' />
                  )}
                </button>
              </div>
              <div className='flex gap-5 justify-between p-4 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:max-w-full'>
                <label htmlFor='confirmPassword' className='sr-only'>
                  Confirm Password
                </label>
                <input
                  id='confirmPassword'
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder='Confirm Password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='w-full bg-transparent border-none focus:outline-none'
                  required
                />
                <button
                  type='button'
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={
                    showConfirmPassword ? 'Hide password' : 'Show password'
                  }
                >
                  {showConfirmPassword ? (
                    <IoEye className='w-6 h-6' />
                  ) : (
                    <IoMdEyeOff className='w-6 h-6' />
                  )}
                </button>
              </div>
              <button
                type='submit'
                className='gap-1 cta self-center px-4 py-3.5 mt-9 max-w-full text-base font-medium text-white whitespace-nowrap rounded min-h-[50px] w-[383px] transition-colors'
              >
                Submit
              </button>
              <p className='self-center mt-5 leading-loose text-center text-orange-600'>
                Remembered your password?{' '}
                <Link
                  to='/vendor-login'
                  className='text-orange-600 hover:underline'
                >
                  Login
                </Link>
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default VendorNewPassword;
