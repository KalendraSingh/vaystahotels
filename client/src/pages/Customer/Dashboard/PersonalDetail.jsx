import React, { useState } from 'react';

function PersonalDetails() {
  const [name, setName] = useState('Mr. Alexander Martin');
  const [mobile, setMobile] = useState('+91 000 0145 00');
  const [email, setEmail] = useState('demomail@comapny.');
  const [address, setAddress] = useState('Las Vegas, NV 89101');

  return (
    <section className='flex overflow-hidden flex-col pt-5 pr-12 pb-11 pl-4 bg-white rounded-lg'>
      <h2 className='self-start text-xl font-medium text-zinc-700'>
        Personal Details
      </h2>
      <div className='flex flex-col justify-center self-center p-1 mt-8 max-w-full rounded-full border-4 border-solid border-zinc-700 border-opacity-10 w-[118px]'>
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/9fcfd4d2e390381f0ba23fb3c292aba6f7ba3dbb8a518e1a27557760b70c702f?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
          alt='Profile'
          className='object-contain w-full rounded-full aspect-[0.99]'
        />
      </div>
      <form className='flex flex-col items-center self-end mt-9 w-full max-w-xs text-sm'>
        <div className='flex flex-col w-full'>
          <label htmlFor='name' className='font-medium text-zinc-700'>
            Your Name
          </label>
          <input
            type='text'
            id='name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='flex-1 shrink gap-2 self-stretch px-4 py-2.5 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300'
          />
        </div>
        <div className='flex flex-col w-full mt-4'>
          <label htmlFor='mobile' className='font-medium text-zinc-700'>
            Mobile Number
          </label>
          <input
            type='tel'
            id='mobile'
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className='flex-1 shrink gap-2 self-stretch px-4 py-2.5 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300'
          />
        </div>
        <div className='flex flex-col w-full mt-4'>
          <label htmlFor='email' className='font-medium text-zinc-700'>
            Email Address
          </label>
          <input
            type='email'
            id='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='flex-1 shrink gap-2 self-stretch px-4 py-2.5 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300'
          />
        </div>
        <div className='flex flex-col w-full mt-4'>
          <label htmlFor='address' className='font-medium text-zinc-700'>
            Address
          </label>
          <input
            type='text'
            id='address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className='flex-1 shrink gap-2 self-stretch px-4 py-2.5 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300'
          />
        </div>
      </form>
    </section>
  );
}

export default PersonalDetails;
