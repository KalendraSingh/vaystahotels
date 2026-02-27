import React, { useState } from 'react';
import ButtonSpinner from '../../../components/ButtonSpinner/ButtonSpinner';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorEmailVerification } from '../../../../api/Vendor/AuthApi';
import { notification } from 'antd';

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const navigate = useNavigate();

  const verifyLink = async () => {
    setIsLoading(true);
    try {
      const res = await vendorEmailVerification(id);
      if (res.status === 200) {
        notification.success({
          message: res.data.message,
        });
        navigate('/vendor-login');
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='h-[80vh] bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl  text-gray-900'>
            Link Verification
          </h2>
          <p className='mt-2 text-center text-sm text-gray-600'>
            Click on below button to verify your Email.
          </p>
        </div>
        <div className='mt-8 space-y-6'>
          <div>
            <button
              onClick={verifyLink}
              disabled={isLoading}
              className=' w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white cta focus:outline-none focus:ring-none focus:ring-offset-none  disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isLoading ? <ButtonSpinner /> : 'Verify Link'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
