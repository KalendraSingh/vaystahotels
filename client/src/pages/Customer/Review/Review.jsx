import React, { useState } from 'react';
import { addNewRating } from '../../../../api/Customer/profileApi';
import { notification } from 'antd';
import { useAuth } from '../../../Hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Review = ({ hotelId }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { auth } = useAuth();
  const customerId = auth.data && auth.data.id;

  const navigate = useNavigate();

  const handleReviewSubmit = async () => {
    try {
      if (!customerId) {
        return navigate('/login', {
          state: { from: `/hotelDetailed/${hotelId}` },
        });
      }
      const data = {
        customerId,
        hotelId,
        comment,
        rating,
      };
      const res = await addNewRating(data);
      if (res.status === 201) {
        notification.success({
          message: 'Your review submitted successfully!',
        });
        setIsOpen(false);
        setRating(0);
        setComment('');
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <div className='p-4'>
      <button
        onClick={() => setIsOpen(true)}
        className='px-4 py-2 text-[10px] sm:text-[12px] md:text-[14px] text-nowrap cta text-white font-semibold rounded-md '
      >
        Give Review
      </button>

      {/* Custom Dialog */}
      {isOpen && (
        <div className='fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white rounded-md shadow-lg p-6 w-[90%] max-w-md'>
            {/* Dialog Header */}
            <h2 className='text-xl font-semibold mb-4'>Submit Your Review</h2>
            <div className='grid gap-4'>
              {/* Star Rating */}
              <div className='flex justify-center gap-2'>
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`w-8 h-8 cursor-pointer ${
                      star <= rating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                    onClick={() => setRating(star)}
                  >
                    <path d='M12 17.27l6.18 3.73-1.64-7.03 5.46-4.73-7.19-.62L12 2 9.19 8.62l-7.19.62 5.46 4.73-1.64 7.03L12 17.27z' />
                  </svg>
                ))}
              </div>

              {/* Comment Input */}
              <textarea
                placeholder='Write your review here...'
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className='w-full h-24 border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500'
              ></textarea>

              {/* Submit Button */}
              <button
                onClick={handleReviewSubmit}
                disabled={rating === 0 || comment.trim() === ''}
                className={`px-4 py-2 rounded-md font-semibold ${
                  rating === 0 || comment.trim() === ''
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'cta text-white'
                }`}
              >
                Submit Review
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className='mt-2 text-sm text-gray-500 hover:underline'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Review;
