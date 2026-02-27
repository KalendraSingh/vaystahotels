import React from 'react';
import { GoDotFill } from 'react-icons/go';
import { Link } from 'react-router-dom';
const VerificationMsg = () => {
  return (
    <>
      <div className='border border-1 border-[#ffd684] rounded-[7px] p-3 mb-6 bg-[#ffffff]'>
        <div className='flex items-center gap-4'>
          <h1 className='font-semibold text-xl'>Account Verification</h1>
          <span className='text-[12px] font-normal bg-[#FFDDA8] rounded-[50px] px-3 py-1 text-[#FFD700] flex items-center'>
            <GoDotFill className='bg-[#FFD700] w-4 h-4 mr-1' /> Pending
          </span>
        </div>
        <p className='mt-3'>
          Your business is verified. Listing may be reviewed for quality and can
          take up to 3-5 business days to be published.{' '}
          <span>
            <Link className='text-blue-500 underline'>Learn More</Link>
          </span>
        </p>
      </div>
    </>
  );
};

export default VerificationMsg;
