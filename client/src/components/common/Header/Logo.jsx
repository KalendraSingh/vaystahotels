import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link to='/'>
      <img
        loading='lazy'
        src='/vaystaF.png'
        alt='Company logo'
        className='object-contain shrink-0 aspect-[1.17] w-[50px] md:w-[83px]'
      />
    </Link>
  );
};

export default Logo;
