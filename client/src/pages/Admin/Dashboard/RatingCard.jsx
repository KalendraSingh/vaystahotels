import React, { useState } from 'react';

function RatingCard() {
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
  };

  return (
    <article className='flex flex-col text-sm rounded-none'>
      <div className='flex flex-wrap gap-4 px-7 py-7 w-full bg-white rounded-xl shadow-[0px_4px_4px_rgba(233,233,233,1)] max-md:px-5 max-md:max-w-full'>
        <div className='flex flex-auto gap-0.5'>
          <div className='flex flex-col grow shrink-0 basis-0 w-fit max-md:max-w-full'>
            <div className='flex gap-5 items-start self-start font-medium tracking-normal leading-none text-zinc-700'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/3f471b61bd6e3092f0e2dc6d7d31f49cc55f69242f5abb5d36c0d6fec7337cea?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                alt='Profile picture of Jessica Jane'
                className='object-contain shrink-0 w-11 aspect-[0.98] rounded-[200px]'
              />
              <div className='flex flex-col'>
                <h2>Jessica Jane</h2>
                <img
                  loading='lazy'
                  src='https://cdn.builder.io/api/v1/image/assets/TEMP/5088a32722573aa1e0a52a47a4956445f6f86d034d97f03cdd8cc25d158139fd?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                  alt='Rating: 5 stars'
                  className='object-contain mt-4 aspect-[7.81] w-[78px] max-md:mr-2'
                />
              </div>
            </div>
            <p className='self-end mt-1 leading-5 text-gray-500'>
              Hi, I'm Jessica Jane. I am a doctoral student at Harvard
              University majoring in Web . . .
            </p>
          </div>
          <button
            className='object-contain shrink-0 self-start aspect-[1.06] w-[18px]'
            onClick={handleLikeToggle}
            aria-label={isLiked ? 'Unlike' : 'Like'}
          >
            <img
              loading='lazy'
              src={
                isLiked
                  ? 'http://b.io/ext_9-'
                  : 'https://cdn.builder.io/api/v1/image/assets/TEMP/2700e0b27cb96e64009a515787d9b60e3f53e3162d932ccaee87259f339d7ea0?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
              }
              alt=''
            />
          </button>
        </div>
        <button
          className='object-contain shrink-0 self-start aspect-[1.06] w-[18px]'
          aria-label='More options'
        >
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/28979610cfc806d0b2becb0d100473d45e07f972a3dce333045191426dc69f5e?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
            alt=''
          />
        </button>
      </div>
    </article>
  );
}

export default RatingCard;
