import React from 'react';
import { Link } from 'react-router-dom';

const SocialIcons = () => {
  const icons = [
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/e3ddead94b403aa63bf7e4bdcc6f073688cb9416465a01f0852e1bfcd21e8345?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      alt: 'Facebook',
      link: 'https://www.facebook.com/',
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/66f1629c96abcc118ac5e10e23950eeed8d804b9c713a4a7167f28ddc3df65ea?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      alt: 'twitter',
      link: 'https://www.twitter.com/',
    },
    {
      src: 'https://cdn.builder.io/api/v1/image/assets/TEMP/afde6d58230668021e3bd4afb32f8727fe0b879ea85370f8ea1561d57c4aa73c?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      alt: 'Instagram',
      link: 'https://www.instagram.com/',
    },
  ];

  return (
    <div className='flex gap-4 items-center my-auto'>
      {icons.map((icon, index) => (
        <Link key={index} to={`${icon.link}`} target='_blanck'>
          <img
            key={index}
            loading='lazy'
            src={icon.src}
            alt={icon.alt}
            className='object-contain shrink-0 self-stretch my-auto aspect-square w-[18px]'
          />
        </Link>
      ))}
      <div className='shrink-0 self-stretch w-px bg-white border border-white border-solid h-[23px]' />
    </div>
  );
};

export default SocialIcons;
