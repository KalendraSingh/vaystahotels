import { notification } from 'antd';
import { newRole } from '../../../../api/Admin/roleAPI';
import { useState } from 'react';

const CreateRole = () => {
  const [role, setRole] = useState({
    name: '',
    rank: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRole((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const adminAddRole = async (e) => {
    e.preventDefault();
    try {
      const res = await newRole({
        name: role.name,
        rank: parseInt(role.rank),
      });
      if (res.status === 201) {
        notification.success({
          message: 'Success',
          description: 'Role created successfully',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    }
    setRole({
      name: '',
      rank: null,
    });
  };

  return (
    <div className='flex justify-center items-center h-[80vh]'>
      <div className='bg-white p-40 rounded-lg'>
        <form onSubmit={adminAddRole}>
          <div className='w-full  mx-auto'>
            <div className=' mt-6 grid gap-4 lg:lg:grid-cols-2 md:grid-cols-2 sm:grid-cols-1 grid-cols-1 px-5'>
              <div className='relative float-label-input'>
                <input
                  onChange={handleInputChange}
                  value={role.name}
                  type='text'
                  autoComplete='off'
                  id='name'
                  placeholder='Rank Name'
                  name='name'
                  className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
                />
              </div>
              <div className='relative float-label-input'>
                <input
                  onChange={handleInputChange}
                  value={role.rank}
                  type='number'
                  id='rank'
                  autoComplete='off'
                  name='rank'
                  placeholder='Rank'
                  className='block w-full input-border px-3 bg-white focus:outline-none focus:shadow-outline border border-gray-300 rounded-md py-2 appearance-none leading-normal'
                />
              </div>
            </div>
            <div className='w-full grid grid-cols-1 justify-center mt-8 px-5'>
              <button
                type='submit'
                value='submit'
                id='submit'
                className='w-2/4 mx-auto shadow-xl bg-gradient-to-tr cta text-white py-2 rounded-md text-lg tracking-wide transition duration-1000'>
                Add
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreateRole;
