const SearchNotFound = () => {
  return (
    <div className='h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl w-full space-y-8 text-center'>
        <div className='mt-8'>
          <img
            src={'/searchnotfound/search.png'}
            alt='Funny 404 Illustration'
            className='mx-auto w-52 h-52  animate-pulse'
          />
        </div>
        <div>
          <h2 className='mt-6 text-3xl font-bold text-gray-900'>
            Ups!... no results found
          </h2>
          <p className='mt-2 text-lg text-gray-600'>
            Please try another search
          </p>
        </div>
      </div>
    </div>
  );
};

export default SearchNotFound;
