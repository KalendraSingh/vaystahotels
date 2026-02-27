import React, { useState } from 'react';
import { FaEdit, FaTrash, FaBed, FaUsers, FaRuler } from 'react-icons/fa';
import { deleteRoomCategoryById } from '../../../../api/Vendor/RoomApi';
import { notification } from 'antd';
import { Link } from 'react-router-dom';

const CategoryManager = ({ selectedHotelCategories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleDeleteCategory = async (id) => {
    try {
      const res = await deleteRoomCategoryById(id);
      if (res.status === 200) {
        notification.success({
          message: 'Hotel categoory deleted!',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error in category deletion!',
      });
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 p-8'>
      <div className='max-w-7xl mx-auto'>
        {selectedHotelCategories &&
          selectedHotelCategories.map((selectedCategory, index) => {
            return (
              <div
                key={index}
                className='bg-white rounded-lg shadow-lg p-8 m-4'
              >
                <div className='flex justify-between items-center mb-6'>
                  <h2 className='text-2xl font-bold'>
                    {selectedCategory.category} Room
                  </h2>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
                  <img
                    src={selectedCategory.categoryImage[0]}
                    alt={selectedCategory.name}
                    className='w-full h-64 object-cover rounded-lg'
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1566665797739-1674de7a421a';
                    }}
                  />
                  <div className='space-y-4'>
                    <div className='flex items-center gap-2'>
                      <FaUsers className='text-gray-500' />
                      <span>Adults: {selectedCategory.adultCount}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <FaBed className='text-gray-500' />
                      <span>Bed Type: {selectedCategory.bedType}</span>
                    </div>
                    <div className='flex items-center gap-2'>
                      <FaRuler className='text-gray-500' />
                      <span>Room Size: {selectedCategory.roomSize} Sqrf</span>
                    </div>
                    <div>
                      <h3 className='font-semibold mb-2'>Amenities:</h3>
                      <div className='flex flex-wrap gap-2'>
                        {selectedCategory.amenities.map((amenity, index) => (
                          <span
                            key={index}
                            className='bg-gray-100 px-3 py-1 rounded-full text-sm'
                          >
                            {amenity.name}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className='mt-4'>
                      <p className='text-lg font-semibold'>
                        Price: ₹ {selectedCategory.perGuestPrice} per guest
                      </p>
                      <p className='text-green-600'>
                        {selectedCategory.discount}% off - ₹
                        {selectedCategory.discountedPrice}
                      </p>
                      <div className='flex justify-end gap-4'>
                        <Link
                          to={`/vendor-dashboard/manage-hotels/category/${selectedCategory.id}`}
                        >
                          <button className='text-color'>
                            <FaEdit className='w-6 h-6' />
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            handleDeleteCategory(selectedCategory.id)
                          }
                          className='text-red-500'
                        >
                          <FaTrash className='w-6 h-6' />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CategoryManager;
