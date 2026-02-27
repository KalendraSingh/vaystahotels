import React from 'react';

const ContactInfo = () => {
  return (
    <a
      href='tel:+918840621562'
      className='flex gap-2.5 text-sm leading-8 text-center text-white'>
      <img
        loading='lazy'
        src='https://cdn.builder.io/api/v1/image/assets/TEMP/e144dff555856408676e7d48b4a299336d59b6359cb6c5acd43d920d51320879?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
        alt='Phone icon'
        className='object-contain shrink-0 my-auto w-4 aspect-square'
      />
      <div className='basis-auto'>+91 8840621562</div>
    </a>
  );
};

export default ContactInfo;
