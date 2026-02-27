import React, { useState } from 'react';
import RatingReviewCard from './RatingReviewCard';

const profileData = [
  {
    id: 1,
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/4cce19578d5f50c6a31ac46ac34177de073e24d4a6a0fb1f389cad58651839ac?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    name: 'Jessica Jane',
    rating:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/4782d9f69486ef4db554ab0c3cdd175bb7937b90afd0f5dabc6699016cd094e2?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    description:
      "Hi, I'm Jessica Jane. I am a doctoral student at Harvard University majoring in Web . . .",
  },
  {
    id: 2,
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/1a1daa42c38251e7fd74b25b8bd3fee6cf9ec01a961860a5de0ba29d1bf67f95?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    name: 'Jessica Jane',
    rating:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/db1593a5a83a9f19d7a4c6f61fc12a70fdd513b97ef08c3adaea00e76921671d?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    description:
      "Hi, I'm Jessica Jane. I am a doctoral student at Harvard University majoring in Web . . .",
  },
  {
    id: 3,
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/e633c020450f274e174663f3eb348ee2cf2c71c76fced1c3174d9a275b055bd9?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    name: 'Jessica Jane',
    rating:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/bcfaee4b048b98acee3b19d39799797036e36d6750c2c425555eb6f88af447a4?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    description:
      "Hi, I'm Jessica Jane. I am a doctoral student at Harvard University majoring in Web . . .",
  },
];

const RatingReview = () => {
  const [profiles] = useState(profileData);

  const handleReply = (id) => {
    console.log(`Replying to profile ${id}`);
  };

  const handleRequestChange = (id) => {
    console.log(`Requesting change for profile ${id}`);
  };

  return (
    <section className='rounded-none'>
      <div className='flex gap-5 max-md:flex-col'>
        {profiles.map((profile, index) => (
          <div
            key={profile.id}
            className={`flex flex-col ${
              index > 0 ? 'ml-5' : ''
            } w-[33%] max-md:ml-0 max-md:w-full`}
          >
            <RatingReviewCard
              {...profile}
              onReply={() => handleReply(profile.id)}
              onRequestChange={() => handleRequestChange(profile.id)}
              showActions={index === 0}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RatingReview;
