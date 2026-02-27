import { useEffect } from 'react';
import { FiLoader } from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
export const PersistLoader = ({ path }) => {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const interval = setInterval(() => {
      navigate(`${path}`, {
        state: { from: location.pathname },
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [navigate, location]);

  return (
    <div className=' mx-auto p-6'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='flex justify-center items-center h-64'>
        <FiLoader
          className='animate-spin text-4xl text-color'
          aria-label='Loading'
        />
      </motion.div>
    </div>
  );
};
