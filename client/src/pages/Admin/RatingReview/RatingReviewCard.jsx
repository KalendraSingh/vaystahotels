import React from 'react';

const RatingReviewCard = ({
  imageSrc,
  name,
  rating,
  description,
  onReply,
  onRequestChange,
  showActions,
}) => {
  return (
    <article className='flex flex-col px-7 py-5 w-full bg-white rounded-xl shadow-[0px_4px_4px_rgba(233,233,233,1)] max-md:px-5 max-md:mt-7'>
      <header className='flex gap-5 justify-between w-full tracking-normal text-zinc-700'>
        <div className='flex gap-2.5'>
          <img
            loading='lazy'
            src={imageSrc}
            alt={`Profile picture of ${name}`}
            className='object-contain shrink-0 w-11 aspect-[0.98] rounded-[200px]'
          />
          <div className='flex flex-col self-start'>
            <h2 className='text-sm font-medium'>{name}</h2>
            <img
              loading='lazy'
              src={rating}
              alt='User rating'
              className='object-contain mt-3.5 aspect-[7.81] w-[78px] max-md:mr-2'
            />
          </div>
        </div>
        <button aria-label='More options' className='self-center'>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/acf27e17a0824776e582960cc55af3c0cf027ce0fbbaf23d07117b9b18c28495?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
            alt=''
            className='object-contain shrink-0 aspect-[0.23] w-[3px]'
          />
        </button>
      </header>
      <p className='mt-6 text-sm leading-5 text-gray-500 max-md:mr-2'>
        {description}
      </p>
      <button
        onClick={onReply}
        className='flex gap-4 self-start mt-10 text-sm font-medium tracking-normal text-orange-600 whitespace-nowrap'
      >
        Reply
        <img
          loading='lazy'
          src='https://cdn.builder.io/api/v1/image/assets/TEMP/2350ce32b1267b64d8f5bffc10e6beb89c4ad56240a8ad03bf8b0ebf63d46a02?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
          alt=''
          className='object-contain shrink-0 self-start w-1.5 aspect-[0.6]'
        />
      </button>
      {showActions && (
        <button
          onClick={onRequestChange}
          className='self-end px-3.5 pt-6 pb-24 mt-6 text-xs bg-white rounded-md shadow-[0px_4px_4px_rgba(0,0,0,0.1)] text-neutral-800'
        >
          Request to change
        </button>
      )}
    </article>
  );
};

export default RatingReviewCard;
