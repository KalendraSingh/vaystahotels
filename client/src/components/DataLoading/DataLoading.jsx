import { motion } from 'framer-motion';
import React from 'react';
import { ImSpinner9 } from 'react-icons/im';

const DataLoading = () => {
  return (
    <div className='mx-auto p-6'>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className='flex justify-center items-center h-64'
      >
        <ImSpinner9
          className='animate-spin text-4xl text-color'
          aria-label='Loading'
        />
      </motion.div>
    </div>
  );
};

export default DataLoading;
