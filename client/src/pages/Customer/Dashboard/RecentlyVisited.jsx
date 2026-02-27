import React from 'react';

const recentlyVisitedData = [
  {
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/1ca4be3f2435425118686e4198c64b3158bb086e56dfce13240fee4e29f290d4?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    hotelName: 'The Venetian Resort',
    location: 'Las Vegas, Nevada',
  },
  {
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/958dc7e9b06c7481b52f3934dff464b0cb90b45a649d7802677b66daa8dfb991?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    hotelName: 'Traders Hotel',
    location: 'Kuala Lumpur, Malaysia',
  },
  {
    imageSrc:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/9425bcf1e589c386a9712a8fc3f1f7feaa1a54c8fcb28ee7e7714d1de09861b0?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    hotelName: 'Hotel Sofitel',
    location: 'New York, Manhattan',
  },
];

const RecentlyVisited = () => {
  function RecentlyVisitedCard({ imageSrc, hotelName, location }) {
    return (
      <article className='flex flex-col w-[33%] max-md:ml-0 max-md:w-full'>
        <div className='flex relative flex-col grow pt-28 text-xs rounded-xl aspect-[1.039] shadow-[0px_1px_1px_rgba(0,0,0,0.05)] text-neutral-800 w-[185px] max-md:pt-24 max-md:mt-6'>
          <img
            loading='lazy'
            src={imageSrc}
            alt={`${hotelName} exterior`}
            className='object-cover absolute inset-0 size-full'
          />
          <div className='flex relative flex-col items-start px-5 py-4 w-full bg-white rounded-xl max-md:pr-5'>
            <h3 className='font-medium leading-normal'>{hotelName}</h3>
            <div className='flex gap-1.5 mt-3'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/78b0032d47714a3c02e9c4c8bc9615e481be8ae46168da2fad758b7cdda22233?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 self-start aspect-[0.82] w-[9px]'
              />
              <p className='basis-auto'>{location}</p>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <section className='bg-white rounded-lg p-4 sm:p-6 mx-auto'>
      <h2 className='text-xl font-medium text-zinc-700 mb-4'>
        You Recently Visited
      </h2>
      <div className='flex flex-wrap -mx-2'>
        {recentlyVisitedData &&
          recentlyVisitedData.map((hotel, index) => (
            <RecentlyVisitedCard
              key={index}
              imageSrc={hotel.imageSrc}
              hotelName={hotel.hotelName}
              location={hotel.location}
            />
          ))}
      </div>
    </section>
  );
};

export default RecentlyVisited;
