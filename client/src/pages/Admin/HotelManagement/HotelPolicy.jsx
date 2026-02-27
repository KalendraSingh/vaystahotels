import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../Hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import {
  addHotelPolicy,
  getAllHotelsByVendor,
} from '../../../../api/Vendor/HotelApi';
import { notification } from 'antd';
import ImageViewer from '../../../components/ImageViewer/ImageViewer';
import { updateHotelPolicy } from '../../../../api/Admin/HotelApi';

export default function HotelPolicyForm({ selectedHotelPolicy, hotelName }) {
  console.log('selectedHotelPolicy', selectedHotelPolicy);
  const { vendorAuth } = useAuth();
  const vendorId = vendorAuth.data && vendorAuth.data.id;
  const [hotels, setHotels] = useState([]);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const [showImageViewer, setShowImageViewer] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageViewer = (imageList, index) => {
    setImages(imageList);
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  };

  const [workWithChannelManager, setWorkWithChannelManager] = useState(false);
  const [channelManagerDetails, setChannelManagerDetails] = useState({
    companyName: selectedHotelPolicy.companyName,
    contactPerson: selectedHotelPolicy.contactPerson,
    email: selectedHotelPolicy.email,
    phone: selectedHotelPolicy.phone,
  });
  const [ownershipDocument, setOwnershipDocument] = useState();
  const [propertyImage, setPropertyImage] = useState();

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

  const [formData, setFormData] = useState({
    hotelId: '',
    vendorId: vendorId && vendorId,
    checkInTime: selectedHotelPolicy.checkInTime,
    checkOutTime: selectedHotelPolicy.checkOutTime,
    childrenPolicy: selectedHotelPolicy.childrenPolicy,
    localId: selectedHotelPolicy.localId,
    coupleFriendly: selectedHotelPolicy.coupleFriendly,
    foreignGuests: selectedHotelPolicy.foreignGuests,
    cancellationPolicy: selectedHotelPolicy.cancellationPolicy,
    payAtHotel: selectedHotelPolicy.payAtHotel,
    noRefundable: selectedHotelPolicy.noRefundable,
    ownershipType: selectedHotelPolicy.ownershipType,
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

  const handleHotelPolicyApprove = async (id) => {
    try {
      const data = {
        status: 'APPROVED',
      };
      const res = await updateHotelPolicy(id, data);
      if (res.status === 200) {
        notification.success({
          message: 'Hotel policy approved!',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  const handleSubmit = async (id) => {
    if (!rejectionReason.trim()) {
      notification.error({ message: 'Please provide a rejection reason' });
      return;
    }

    setIsSubmitting(true);

    const data = {
      status: 'REJECTED',
      rejectionReason,
    };
    try {
      const res = await updateHotelPolicy(id, data);
      if (res.status === 200) {
        setIsSubmitting(false);
        setIsOpen(false);
        notification.success({
          message: 'Vendor KYC rejected!',
        });
      }
    } catch (error) {
      setIsSubmitting(false);
      setIsOpen(false);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  const handleRejectPolicy = () => {
    setIsOpen(true);
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
    <>
      <form onSubmit={handleFormSubmit}>
        <div className=' mx-auto p-6 bg-white  rounded-lg'>
          <h2 className='text-2xl font-bold mb-6'>Hotel Policy details</h2>

          {/* select hotel */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
            <div className='mb-6'>
              <label
                htmlFor='hotelId'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Hotel Name:
              </label>
              <p>{hotelName}</p>
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
                value={new Date(formData.checkInTime)
                  .toISOString()
                  .slice(11, 16)}
                onChange={handleValueChange}
                required
                disabled={true}
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
                value={new Date(formData.checkOutTime)
                  .toISOString()
                  .slice(11, 16)}
                onChange={handleValueChange}
                required
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                disabled={true}
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
                  disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
                    disabled={true}
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
              Upload a valid government lease or registration document as proof
              of property ownership.
            </p>
            <div className='mb-4'>
              <label
                htmlFor='ownershipType'
                className='block text-sm font-medium text-gray-700 mb-1'
              >
                Choose the ownership type
              </label>
              <select
                disabled={true}
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

          <div className='mt-4 flex flex-wrap gap-2'>
            {selectedHotelPolicy.ownershipDocument.map((doc, index) => (
              <div key={index} className='relative'>
                <img
                  src={doc}
                  onClick={() =>
                    openImageViewer(
                      selectedHotelPolicy.ownershipDocument,
                      index
                    )
                  }
                  alt={`Ownership Document ${index + 1}`}
                  className='max-w-full h-24 rounded-lg cursor-pointer'
                />
              </div>
            ))}
          </div>
          <div className='mt-6'>
            <label className='block text-sm font-medium text-gray-700 mb-1'>
              Upload Property Images
            </label>

            <div className='mt-4 flex flex-wrap gap-2'>
              {selectedHotelPolicy.propertyImage.map((img, index) => (
                <div key={index} className='relative'>
                  <img
                    src={img}
                    onClick={() =>
                      openImageViewer(selectedHotelPolicy.propertyImage, index)
                    }
                    alt={`Property Image ${index + 1}`}
                    className='max-w-full h-24 rounded-lg cursor-pointer'
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='flex items-center justify-between gap-6'>
          <button
            type='button'
            disabled={selectedHotelPolicy.policyStatus === 'APPROVED'}
            onClick={() => handleHotelPolicyApprove(selectedHotelPolicy.id)}
            className={`w-full ${
              selectedHotelPolicy.policyStatus === 'APPROVED'
                ? 'bg-green-200'
                : 'bg-green-400'
            }  text-white py-2 px-4 rounded-md  transition duration-300`}
          >
            Approve
          </button>
          <button
            type='button'
            onClick={handleRejectPolicy}
            disabled={selectedHotelPolicy.policyStatus === 'REJECTED'}
            className={`w-full  ${
              selectedHotelPolicy.policyStatus === 'REJECTED'
                ? 'bg bg-red-400'
                : 'cta'
            } text-white py-2 px-4 rounded-md  transition duration-300`}
          >
            Reject
          </button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50'
              role='dialog'
              aria-modal='true'
              aria-labelledby='modal-title'
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className='bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative'
              >
                <button
                  onClick={() => setIsOpen(false)}
                  className='absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200'
                  aria-label='Close modal'
                >
                  <FiX className='w-6 h-6' />
                </button>

                <h2
                  id='modal-title'
                  className='text-2xl font-semibold text-gray-900 mb-4'
                >
                  Rejection Reason
                </h2>

                <div className='space-y-4'>
                  <div>
                    <label
                      htmlFor='rejection-reason'
                      className='block text-sm font-medium text-gray-700 mb-1'
                    >
                      Please provide a reason for rejection
                    </label>
                    <textarea
                      id='rejection-reason'
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      className='w-full h-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none'
                      placeholder='Enter rejection reason...'
                      required
                      aria-required='true'
                    />
                  </div>

                  <div className='flex justify-end space-x-3'>
                    <button
                      type='button'
                      onClick={() => setIsOpen(false)}
                      className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400'
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      onClick={() => handleSubmit(selectedHotelPolicy.id)}
                      disabled={isSubmitting}
                      className='px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {showImageViewer && (
        <ImageViewer
          images={images}
          selectedImageIndex={selectedImageIndex}
          onClose={() => setShowImageViewer(false)}
        />
      )}
    </>
  );
}
