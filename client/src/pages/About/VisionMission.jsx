import React from 'react';

const visionMissionData = [
  {
    title: 'Our Vision',
    description:
      'To be a leading force in shaping the future by delivering innovative solutions that inspire growth and transform businesses worldwide',
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/ac7c19663cc511c905bb677fba812046201ff4f027198784a777460ddfc8657b?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    imageAlt: 'Vision icon',
  },
  {
    title: 'Our Mission',
    description:
      'Our mission is to empower businesses with cutting-edge tools and services, fostering success through innovation, quality, and exceptional customer experiences.',
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/35632baf4186df3b2c1487cdb41d8e0af2d6a3076163d8050da82195bae7a8d9?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    imageAlt: 'Mission icon',
  },
];

function VisionMission() {
  return (
    <section className='flex flex-col justify-center items-center px-16 py-16 w-full bg-stone-50 max-md:px-5 max-md:max-w-full'>
      <div className='ml-3.5 max-w-full w-[954px]'>
        <div className='flex gap-5 max-md:flex-col'>
          {visionMissionData.map((item, index) => (
            <article
              key={index}
              className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'
            >
              <div className='flex gap-10 text-gray-600 max-md:mt-10'>
                <img
                  loading='lazy'
                  src={item.imageSrc}
                  alt={item.imageAlt}
                  className='object-contain shrink-0 self-start mt-1.5 aspect-[1.15] w-[50px] md:w-[90px]'
                />
                <div className='flex flex-col grow shrink-0 basis-0 w-fit'>
                  <h2 className='self-start text-base md:text-2xl font-medium capitalize'>
                    {item.title}
                  </h2>
                  <p className='mt-5 text-sm leading-6'>{item.description}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VisionMission;
