import React, { useState } from 'react';

const initialPlaces = [
  {
    id: 1,
    name: 'The Leela Palace Udaipur',
    location: 'Kuala Lumpur, Malaysia',
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/596c8b4658d4e0aefb88f83d276cd8c4af44c89ac9d58732eed5d56b62275336?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/68557477d2a86da0e233d62a1b86f7d6a383f5921da26fbe0d94b603ea625d41?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    isFavorite: true,
  },
  {
    id: 2,
    name: 'The Leela Palace Udaipur',
    location: 'Kuala Lumpur, Malaysia',
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/596c8b4658d4e0aefb88f83d276cd8c4af44c89ac9d58732eed5d56b62275336?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/5ef8edcfecfadc6eafab5536f4e691bb35a7fe129b10574d2aeb51a9c98c613e?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    isFavorite: true,
  },
  {
    id: 3,
    name: 'The Leela Palace Udaipur',
    location: 'Kuala Lumpur, Malaysia',
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/46b3b3d2830019f00e866a37c17fd4853c13fa684f5855a83ade6c597e01d903?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/addec5f16c64de39c10490173d53e74d2513556089b42e22683130b2e954a8db?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    isFavorite: true,
  },
  {
    id: 4,
    name: 'The Leela Palace Udaipur',
    location: 'Kuala Lumpur, Malaysia',
    image:
      'https://cdn.builder.io/api/v1/image/assets/TEMP/46b3b3d2830019f00e866a37c17fd4853c13fa684f5855a83ade6c597e01d903?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/20cec375e4b440f13467385e190fa0044d8c7e1a30287db2cb74b5832ab3ed85?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d',
    isFavorite: true,
  },
];

function FavoritePlaces() {
  const [places, setPlaces] = useState(initialPlaces);

  const toggleFavorite = (id) => {
    setPlaces(
      places.map((place) =>
        place.id === id ? { ...place, isFavorite: !place.isFavorite } : place
      )
    );
  };

  return (
    <section className='rounded-none'>
      <div className='flex gap-5 max-md:flex-col'>
        <div className='flex flex-col w-[61%] max-md:ml-0 max-md:w-full'>
          <div className='flex flex-col mt-0 w-full max-md:mt-6 max-md:max-w-full'>
            <header className='flex gap-4 self-start text-xl font-medium text-zinc-700'>
              <h2 className='grow'>Favorite Places</h2>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/cae9f1427547889a7a3d51f556cd427ddce81945a3a32831d876e6d33bb33cb7?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto aspect-[1.05] w-[21px]'
              />
            </header>
            <div className='flex flex-wrap gap-8 mt-3.5'>
              {places.slice(0, 2).map((place) => (
                <PlaceCard
                  key={place.id}
                  {...place}
                  onToggleFavorite={() => toggleFavorite(place.id)}
                />
              ))}
            </div>
            <div className='flex flex-wrap gap-8 mt-5'>
              {places.slice(2, 4).map((place) => (
                <PlaceCard
                  key={place.id}
                  {...place}
                  onToggleFavorite={() => toggleFavorite(place.id)}
                />
              ))}
            </div>
          </div>
        </div>
        <MapImage places={places.filter((place) => place.isFavorite)} />
      </div>
    </section>
  );
}

function PlaceCard({
  name,
  location,
  image,
  icon,
  isFavorite,
  onToggleFavorite,
}) {
  return (
    <article className='flex flex-1 flex-auto gap-7 px-5 py-4 bg-white rounded-lg max-md:pr-5'>
      <div className='flex gap-4'>
        <img
          loading='lazy'
          src={image}
          alt={name}
          className='object-contain shrink-0 rounded-xl aspect-square w-[50px]'
        />
        <div className='flex flex-col my-auto'>
          <h3 className='text-xs font-medium text-zinc-800'>{name}</h3>
          <div className='flex gap-2 self-start mt-2 text-xs text-neutral-800'>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/23e589aa4ace2bc6be583ebd2d8423bb363d25459a1ae86269d306a06cfe9275?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
              alt=''
              className='object-contain shrink-0 aspect-[0.82] w-[9px]'
            />
            <span className='basis-auto'>{location}</span>
          </div>
        </div>
      </div>
      <button
        onClick={onToggleFavorite}
        className='object-contain shrink-0 my-auto w-5 aspect-[1.11] focus:outline-none'
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <img loading='lazy' src={icon} alt='' className='w-full h-full' />
      </button>
    </article>
  );
}

function MapImage({ places }) {
  return (
    <div className='flex flex-col ml-5 w-[39%] max-md:ml-0 max-md:w-full'>
      <img
        loading='lazy'
        src='https://cdn.builder.io/api/v1/image/assets/TEMP/f09ac1dc25811bba0dfab03cafb7d519f01ec12d2eff56d804a56e8e64f5c991?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
        alt={`Map showing ${places.length} favorite places`}
        className='object-contain grow mt-7 w-full rounded-xl aspect-[2.13] max-md:mt-10'
      />
    </div>
  );
}

export default FavoritePlaces;
