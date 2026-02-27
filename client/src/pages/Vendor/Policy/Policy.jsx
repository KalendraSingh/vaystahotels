import React, { useEffect, useState } from 'react';
import { PlusCircle, XCircle } from 'lucide-react';
import { useAuth } from '../../../Hooks/useAuth';
import {
  addHotelPolicy,
  getAllHotelsByVendor,
} from '../../../../api/Vendor/HotelApi';
import { message, notification } from 'antd';

export default function HotelPolicyForm() {
  const { vendorAuth } = useAuth();
  const vendorId = vendorAuth.data && vendorAuth.data.id;
  const [hotels, setHotels] = useState([]);

  const getAllHotelByVendorId = async () => {
    try {
      const res = await getAllHotelsByVendor(vendorId);
      setHotels(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllHotelByVendorId();
  }, []);

  const [workWithChannelManager, setWorkWithChannelManager] = useState(false);
  const [channelManagerDetails, setChannelManagerDetails] = useState({
    companyName: '',
    contactPerson: '',
    email: '',
    phone: '',
  });
  const [ownershipDocument, setOwnershipDocument] = useState([]);
  const [propertyImage, setPropertyImage] = useState([]);

  const handleChannelManagerChange = (e) => {
    console.log(e.target.value);
    setWorkWithChannelManager(!workWithChannelManager);
    setFormData({
      ...formData,
      workWithChannelManager: workWithChannelManager,
    });
    if (e.target.value === false) {
      setChannelManagerDetails({
        companyName: '',
        contactPerson: '',
        email: '',
        phone: '',
      });
    } else {
      setFormData({
        ...formData,
        channelManagerDetails: {
          companyName: '',
          contactPerson: '',
          email: '',
          phone: '',
        },
      });
    }
  };

  const handleChannelManagerDetailsChange = (e) => {
    setChannelManagerDetails({
      ...channelManagerDetails,
      [e.target.name]: e.target.value,
    });
    setFormData({
      ...formData,
      channelManagerDetails: {
        ...formData.channelManagerDetails,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleOwnershipDocumentChange = (e) => {
    const files = Array.from(e.target.files);
    setOwnershipDocument((prevDocs) => [
      ...prevDocs,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const handlePropertyImageChange = (e) => {
    const files = Array.from(e.target.files);
    setPropertyImage((prevImages) => [
      ...prevImages,
      ...files.map((file) => ({ file, preview: URL.createObjectURL(file) })),
    ]);
  };

  const removeOwnershipDocument = (index) => {
    setOwnershipDocument((prevDocs) => prevDocs.filter((_, i) => i !== index));
  };

  const removePropertyImage = (index) => {
    setPropertyImage((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const [formData, setFormData] = useState({
    hotelId: '',
    vendorId: vendorId && vendorId,
    checkInTime: '',
    checkOutTime: '',
    childrenPolicy: false,
    localId: false,
    coupleFriendly: false,
    foreignGuests: '',
    cancellationPolicy: true,
    payAtHotel: true,
    noRefundable: false,
    ownershipType: '',
  });

  const handleValueChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const parseBoolean = (value) => {
    return value === 'true' ? true : value === 'false' ? false : value;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('trgger');
      const policyFormData = new FormData();

      // Append text fields to formData
      policyFormData.append('hotelId', formData.hotelId);
      policyFormData.append('vendorId', formData.vendorId);
      policyFormData.append('checkInTime', formData.checkInTime);
      policyFormData.append('checkOutTime', formData.checkOutTime);
      policyFormData.append(
        'childrenPolicy',
        parseBoolean(formData.childrenPolicy)
      );
      policyFormData.append('localId', parseBoolean(formData.localId));
      policyFormData.append(
        'coupleFriendly',
        parseBoolean(formData.coupleFriendly)
      );
      policyFormData.append('foreignGuests', formData.foreignGuests);
      policyFormData.append(
        'cancellationPolicy',
        parseBoolean(formData.cancellationPolicy)
      );
      policyFormData.append(
        'noRefundable',
        parseBoolean(formData.noRefundable)
      );

      policyFormData.append('ownershipType', formData.ownershipType);

      // Append channel manager details if applicable
      if (workWithChannelManager) {
        policyFormData.append(
          'channelManagerDetails[companyName]',
          channelManagerDetails.companyName
        );
        policyFormData.append(
          'channelManagerDetails[contactPerson]',
          channelManagerDetails.contactPerson
        );
        policyFormData.append(
          'channelManagerDetails[email]',
          channelManagerDetails.email
        );
        policyFormData.append(
          'channelManagerDetails[phone]',
          channelManagerDetails.phone
        );
      }

      policyFormData.append(
        'workWithChannelManager',
        parseBoolean(workWithChannelManager)
      );

      // Append file inputs to formData
      ownershipDocument.forEach((doc) =>
        policyFormData.append(`ownershipDocument`, doc.file)
      );

      propertyImage.forEach((img) =>
        policyFormData.append(`propertyImage`, img.file)
      );

      const res = await addHotelPolicy(policyFormData);
      if (res.status === 201) {
        notification.success({
          message: 'Policy form submitted successfully, wait for aproval!',
        });
      }
      resetForm();
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  const resetForm = () => {
    setFormData({
      hotelId: '',
      checkInTime: '',
      checkOutTime: '',
      childrenPolicy: false,
      localId: false,
      coupleFriendly: false,
      foreignGuests: '',
      cancellationPolicy: '',
      noRefundable: false,
      workWithChannelManager: '',
      ownershipType: '',
    });
    setOwnershipDocument(null);
    setPropertyImage(null);
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className=' mx-auto p-6 bg-white  rounded-lg'>
        <h2 className='text-2xl font-bold mb-6'>Hotel Policy Form</h2>

        {/* select hotel */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div className='mb-6'>
            <label
              htmlFor='hotelId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Select Hotel*
            </label>
            <select
              id='hotelId'
              name='hotelId'
              value={formData.hotelId}
              onChange={handleValueChange}
              required
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value=''>Select Hotel</option>
              {hotels &&
                hotels.length > 0 &&
                hotels.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {/* Basic Policy Fields */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label
              htmlFor='checkInTime'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Check-In Time*
            </label>
            <input
              type='time'
              id='checkInTime'
              name='checkInTime'
              value={formData.checkInTime}
              onChange={handleValueChange}
              required
              className='w-full px-3 py-2 border rounded-md'
            />
          </div>
          <div>
            <label
              htmlFor='checkOutTime'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Check-Out Time*
            </label>
            <input
              type='time'
              id='checkOutTime'
              name='checkOutTime'
              value={formData.checkOutTime}
              onChange={handleValueChange}
              required
              className='w-full px-3 py-2 border rounded-md'
            />
          </div>
          <div>
            <label
              htmlFor='childrenPolicy'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Children Policy
            </label>
            <select
              id='childrenPolicy'
              name='childrenPolicy'
              value={formData.childrenPolicy}
              onChange={handleValueChange}
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value=''>Select</option>
              <option value={true}>Allowed</option>
              <option value={false}>Not Allowed</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='localId'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Local ID*
            </label>
            <select
              id='localId'
              name='localId'
              required
              value={formData.localId}
              onChange={handleValueChange}
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value=''>Select</option>
              <option value={true}>Required</option>
              <option value={false}>Not Required</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='coupleFriendly'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Couple Friendly
            </label>
            <select
              id='coupleFriendly'
              value={formData.coupleFriendly}
              onChange={handleValueChange}
              name='coupleFriendly'
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value=''>Select</option>
              <option value={true}>Yes</option>
              <option value={false}>No</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='foreignGuests'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Foreign Guests
            </label>
            <select
              id='foreignGuests'
              value={formData.foreignGuests}
              onChange={handleValueChange}
              name='foreignGuests'
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value=''>Select</option>
              <option value={true}>Allowed</option>
              <option value={false}>Not Allowed</option>
            </select>
          </div>
        </div>

        {/* Channel Manager Section */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Do you work with channel manager?
          </label>
          <div className='flex space-x-4 items-center'>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                name='workWithChannelManager'
                value={true}
                onChange={handleChannelManagerChange}
                className='form-radio'
              />
              <span className='ml-2'>Yes</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                name='workWithChannelManager'
                value={false}
                onChange={handleChannelManagerChange}
                className='form-radio'
                defaultChecked
              />
              <span className='ml-2'>No</span>
            </label>
          </div>
        </div>

        {workWithChannelManager === true && (
          <div className='mb-6 p-4 bg-gray-50 rounded-md'>
            <h3 className='text-lg font-semibold mb-4'>
              Channel Manager Details
            </h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label
                  htmlFor='companyName'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Company Name
                </label>
                <input
                  type='text'
                  id='companyName'
                  name='companyName'
                  value={channelManagerDetails.companyName}
                  onChange={handleChannelManagerDetailsChange}
                  className='w-full px-3 py-2 border rounded-md'
                />
              </div>
              <div>
                <label
                  htmlFor='contactPerson'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Contact Person
                </label>
                <input
                  type='text'
                  id='contactPerson'
                  name='contactPerson'
                  value={channelManagerDetails.contactPerson}
                  onChange={handleChannelManagerDetailsChange}
                  className='w-full px-3 py-2 border rounded-md'
                />
              </div>
              <div>
                <label
                  htmlFor='email'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Email
                </label>
                <input
                  type='email'
                  id='email'
                  name='email'
                  value={channelManagerDetails.email}
                  onChange={handleChannelManagerDetailsChange}
                  className='w-full px-3 py-2 border rounded-md'
                />
              </div>
              <div>
                <label
                  htmlFor='phone'
                  className='block text-sm font-medium text-gray-700 mb-1'
                >
                  Phone
                </label>
                <input
                  type='tel'
                  id='phone'
                  name='phone'
                  value={channelManagerDetails.phone}
                  onChange={handleChannelManagerDetailsChange}
                  className='w-full px-3 py-2 border rounded-md'
                />
              </div>
            </div>
          </div>
        )}

        {/* Cancellation Policy */}
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Cancellation Policy
          </label>
          <div className='flex gap-4 items-center'>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                name='cancellationPolicy'
                value={true}
                defaultChecked
                onChange={handleValueChange}
                className='form-radio'
              />
              <span className='ml-2'>Free Cancellation</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                name='cancellationPolicy'
                value={false}
                onChange={handleValueChange}
                className='form-radio'
              />
              <span className='ml-2'>No Free Cancellation</span>
            </label>
          </div>
        </div>
        <div className='mb-6'>
          <label className='block text-sm font-medium text-gray-700 mb-2'>
            Pay At Hotel
          </label>
          <div className=' flex items-center gap-4'>
            <label className='inline-flex items-center '>
              <input
                type='radio'
                name='payAtHotel'
                value={true}
                defaultChecked
                onChange={handleValueChange}
                className='form-radio'
              />
              <span className='ml-2'>Yes</span>
            </label>
            <label className='inline-flex items-center'>
              <input
                type='radio'
                name='payAtHotel'
                value={false}
                onChange={handleValueChange}
                className='form-radio'
              />
              <span className='ml-2'>No</span>
            </label>
          </div>
        </div>

        <div className='mb-6'>
          <label className='inline-flex items-center'>
            <input
              checked={formData.noRefundable}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  noRefundable: e.target.checked,
                })
              }
              type='checkbox'
              className='form-checkbox'
            />
            <span className='ml-2'>No Refundable</span>
          </label>
        </div>

        {/* Ownership Details */}
        <div className='mb-6'>
          <h3 className='text-xl font-semibold mb-2'>Ownership Details</h3>
          <p className='text-gray-600 mb-4'>
            Upload a valid government lease or registration document as proof of
            property ownership.
          </p>
          <div className='mb-4'>
            <label
              htmlFor='ownershipType'
              className='block text-sm font-medium text-gray-700 mb-1'
            >
              Choose the ownership type
            </label>
            <select
              value={formData.ownershipType}
              onChange={handleValueChange}
              name='ownershipType'
              id='ownershipType'
              className='w-full px-3 py-2 border rounded-md'
            >
              <option value=''>Select ownership type</option>
              <option value='own'>My Own Property</option>
              <option value='leased'>Leased Property</option>
              <option value='managed'>Managed Property</option>
            </select>
          </div>
        </div>

        <label className='block text-sm font-medium text-gray-700 mb-1'>
          Upload Ownership Documents
        </label>
        <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
          <div className='space-y-1 text-center'>
            <PlusCircle className='mx-auto h-12 w-12 text-gray-400' />
            <label
              htmlFor='ownership-documents-upload'
              className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500'
            >
              <span>Upload files</span>
              <input
                id='ownership-documents-upload'
                type='file'
                className='sr-only'
                onChange={handleOwnershipDocumentChange}
                multiple
              />
            </label>
            <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
        <div className='mt-4 flex flex-wrap gap-2'>
          {ownershipDocument &&
            ownershipDocument.map((doc, index) => (
              <div key={index} className='relative'>
                <img
                  src={doc.preview}
                  alt={`Ownership Document ${index + 1}`}
                  className='max-w-full h-24 rounded-lg'
                />
                <button
                  onClick={() => removeOwnershipDocument(index)}
                  className='absolute top-0 right-0'
                >
                  <XCircle className='h-6 w-6 text-red-500' />
                </button>
              </div>
            ))}
        </div>
        <div className='mt-6'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>
            Upload Property Images
          </label>
          <div className='mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md'>
            <div className='space-y-1 text-center'>
              <PlusCircle className='mx-auto h-12 w-12 text-gray-400' />
              <label
                htmlFor='property-images-upload'
                className='relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500'
              >
                <span>Upload files</span>
                <input
                  id='property-images-upload'
                  type='file'
                  className='sr-only'
                  onChange={handlePropertyImageChange}
                  multiple
                />
              </label>
              <p className='text-xs text-gray-500'>PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            {propertyImage &&
              propertyImage.map((img, index) => (
                <div key={index} className='relative'>
                  <img
                    src={img.preview}
                    alt={`Property Image ${index + 1}`}
                    className='max-w-full h-24 rounded-lg'
                  />
                  <button
                    onClick={() => removePropertyImage(index)}
                    className='absolute top-0 right-0'
                  >
                    <XCircle className='h-6 w-6 text-red-500' />
                  </button>
                </div>
              ))}
          </div>
        </div>
      </div>

      <button
        type='submit'
        className='w-full cta text-white py-2 px-4 rounded-md  transition duration-300'
      >
        Submit Policies
      </button>
    </form>
  );
}
