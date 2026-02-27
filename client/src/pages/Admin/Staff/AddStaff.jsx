import React, { useEffect, useState } from 'react';
import LoginImgSlider from '../../../components/LoginImgSlider/LoginImgSlider';
import { notification } from 'antd'; // Import notification
import { vendorRegister } from '../../../../api/Vendor/AuthApi';
import { Link } from 'react-router-dom';
import { adminGetRoles, adminSignup } from '../../../../api/Admin/AuthApi';
const AddStaff = () => {
  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    roleId: '',
    password: '',
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const [roles, setRoles] = useState([]);
  const getRole = async () => {
    try {
      const res = await adminGetRoles();
      setRoles(res.data.roles);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminSignup(formData);
      if (res.status === 201) {
        notification.success({
          message: 'Success',
          description: 'Account created successfully',
        });
        setFormData({
          name: '',
          lastName: '',
          email: '',
          phone: '',
          roleId: '',
          password: '',
        });
      }
    } catch (error) {
      notification.error({
        message: 'Error',
        description: error.response.data.message,
      });
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className=''>
      <div className='flex overflow-hidden flex-col items-center bg-white py-10'>
        <div className='mt-4 px-4 lg:px-6 xl:px-0'>
          <div className='flex gap-5 max-md:flex-col'>
            <div className='flex flex-col w-full px-0'>
              <form
                onSubmit={handleSubmit}
                className='flex flex-col mt-2.5 w-full text-sm text-zinc-700 max-md:mt-10 max-md:max-w-full'>
                <h2 className='self-start text-3xl font-medium text-zinc-700 max-md:ml-0.5'>
                  Create an Staff
                </h2>
                <input
                  type='text'
                  name='name'
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder='First name'
                  autoComplete='off'
                  className='px-4 py-2 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5 max-md:max-w-full'
                  required
                />
                <input
                  type='text'
                  name='lastName'
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder='Last name'
                  autoComplete='off'
                  className='px-4 py-2 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5 max-md:max-w-full'
                  required
                />
                <input
                  type='email'
                  name='email'
                  autoSave='off'
                  autoComplete='off'
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder='Email address'
                  className='px-4 py-2 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5 max-md:max-w-full'
                  required
                />
                <input
                  type='tel'
                  name='phone'
                  autoComplete='off'
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder='Mobile Number'
                  className='px-4 py-2 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5 max-md:max-w-full'
                  required
                />
                <div className='relative mt-5'>
                  <input
                    type='password'
                    name='password'
                    autoComplete='off'
                    autoSave='off'
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder='Password'
                    className='w-full px-4 py-2 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:max-w-full'
                    required
                  />
                </div>
                <select
                  name='roleId'
                  onChange={handleInputChange}
                  className='w-full px-4 py-2 mt-5 leading-loose bg-white rounded-md border border-solid border-zinc-300 max-md:max-w-full'>
                  <option value=''>Select Role</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>

                <button
                  type='submit'
                  className={`self-center px-4 py-3.5 mt-6 max-w-full text-base font-medium text-white rounded min-h-[50px] cta w-[383px] transition-colors duration-300`}>
                  Create an Account
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddStaff;
