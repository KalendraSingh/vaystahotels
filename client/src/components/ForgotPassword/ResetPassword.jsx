import React, { useEffect, useState } from 'react';
import LoginImgSlider from '../../components/LoginImgSlider/LoginImgSlider';
import { Link } from 'react-router-dom';
import { userForgetPassword } from '../../../api/Customer/AuthApi';
import { notification } from 'antd';

const NewPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allData = {
      email,
    };

    try {
      const res = await userForgetPassword(allData);
      if (res.status === 200) {
        setEmail('');
        notification.success({
          message: 'Email verificatin link sent Successfully!',
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
    <main className='flex overflow-hidden flex-col items-center pb-8 bg-white'>
      <section className='mt-4 w-full px-4 lg:px-6 xl:px-0 max-w-[1048px] max-md:mt-10 max-md:max-w-full'>
        <div className='flex gap-5 max-md:flex-col'>
       
          <form
            onSubmit={handleSubmit}
            className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'
          >
            <div className='flex flex-col self-stretch my-auto w-full text-sm text-zinc-700 max-md:mt-10 max-md:max-w-full'>
              <h1 className='self-start text-3xl font-medium text-zinc-700 max-md:ml-1'>
                Forgot Password
              </h1>
              <p className='self-start mt-1.5 leading-loose max-md:ml-1'>
                Lost your password? Please enter your email address. You will
                recieve a link to create new password via email.
              </p>
              <div className='px-4 py-4 mt-9 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5 max-md:max-w-full'>
                <label htmlFor='email' className='sr-only'>
                  email
                </label>
                <input
                  id='email'
                  type='text'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='w-full bg-transparent border-none focus:outline-none'
                  required
                />
              </div>
              <button
                type='submit'
                className='gap-1 cta self-center px-4 py-3.5 mt-9 max-w-full text-base font-medium text-white whitespace-nowrap rounded min-h-[50px] w-[383px] transition-colors'
              >
                Send Email
              </button>
              <p className='self-center mt-5 leading-loose text-center text-orange-600'>
                Remembered your password?{' '}
                <Link to='/login' className='text-orange-600 hover:underline'>
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

export default NewPassword;
