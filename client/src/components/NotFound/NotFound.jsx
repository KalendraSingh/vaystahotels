import { IoArrowBack } from 'react-icons/io5';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
      <div className='max-w-3xl w-full space-y-8 text-center'>
        <div>
          <h1 className='text-9xl font-extrabold text-color animate-bounce'>
            404
          </h1>
          <h2 className='mt-6 text-3xl font-bold text-gray-900'>
            Oops! Page Not Found
          </h2>
          <p className='mt-2 text-lg text-gray-600'>
            The page you're looking for doesn't exist or has been removed.
          </p>
        </div>

        <form className='mt-8'>
          <div className='flex items-center justify-center'>
            <Link to={'/'}>
              <button
                type='submit'
                className='px-4 py-2 flex items-center gap-2 text-white rounded-md cta focus:outline-none '
              >
                <IoArrowBack />
                Back to Home
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotFound;
