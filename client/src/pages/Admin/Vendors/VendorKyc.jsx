import { useState } from 'react';
import { Pen } from 'lucide-react';
import { FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../../Hooks/useAuth';
import { notification } from 'antd';
import ImageViewer from '../../../components/ImageViewer/ImageViewer';
import { updateVendorKyc } from '../../../../api/Admin/VendorApi';

export default function Component({ selectedVendorKyc }) {
  const { vendorAuth } = useAuth();
  const vendorId = vendorAuth.data && vendorAuth.data.id;
  const [rejectionReason, setRejectionReason] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    vendorId: vendorId && vendorId,
    firstName: selectedVendorKyc.firstName,
    lastName: selectedVendorKyc.lastName,
    fatherFirstName: selectedVendorKyc.fatherFirstName,
    fatherLastName: selectedVendorKyc.fatherLastName,
    gender: selectedVendorKyc.gender,
    maritalStatus: selectedVendorKyc.maritalStatus,
    dateOfBirth: selectedVendorKyc.dateOfBirth,
    nationality: selectedVendorKyc.nationality,
    status: selectedVendorKyc.status,
    pancardNumber: selectedVendorKyc.pancardNumber,
    proofOfIdentity: selectedVendorKyc.proofOfIdentity,
    address: {
      street: selectedVendorKyc.street,
      street2: selectedVendorKyc.street2,
      city: selectedVendorKyc.city,
      state: selectedVendorKyc.state,
      postalCode: selectedVendorKyc.postalCode,
      country: selectedVendorKyc.country,
    },
    phoneNumber: selectedVendorKyc.phoneNumber,
    email: selectedVendorKyc.email,
    bankName: selectedVendorKyc.bankName,
    branchName: selectedVendorKyc.branchName,
    accountNumber: selectedVendorKyc.accountNumber,
    ifscCode: selectedVendorKyc.ifscCode,
    accountHolderName: selectedVendorKyc.accountHolderName,
    gstNumber: selectedVendorKyc.gstNumber,
    taxResidency: selectedVendorKyc.taxResidency,
    aadharNumber: selectedVendorKyc.aadharNumber,
    passportNumber: selectedVendorKyc.passportNumber,
    drivingLicense: selectedVendorKyc.drivingLicense,
    declarationFirstName: selectedVendorKyc.declarationFirstName,
    declarationLastName: selectedVendorKyc.declarationLastName,
    pancardDocument: selectedVendorKyc.pancardDocument,
    aadharDocument: selectedVendorKyc.aadharDocuments,
    gstDocument: selectedVendorKyc.gstDocument,
    signature: selectedVendorKyc.signature,
  });
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const openImageViewer = (imageList, index) => {
    setImages(imageList);
    setSelectedImageIndex(index);
    setShowImageViewer(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  const handleSignatureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        signature: e.target.files[0],
      }));
    }
  };

  const handleApproveKyc = async (id) => {
    const data = {
      status: 'VERIFIED',
    };
    try {
      const res = await updateVendorKyc(id, data);
      if (res.status === 200) {
        notification.success({
          message: 'Vendor KYC approved!',
        });
      }
    } catch (error) {
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  const handleSubmit = async (id) => {
    if (!rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    setIsSubmitting(true);

    const data = {
      status: 'REJECTED',
      rejectionReason,
    };
    try {
      const res = await updateVendorKyc(id, data);
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

  const handleRejectKyc = () => {
    setIsOpen(true);
  };

  return (
    <>
      <form>
        <div className=' mx-auto p-4 bg-gray-50'>
          <h1 className='text-xl font-bold mb-6 text-gray-800'>
            Vendor KYC Details
          </h1>

          <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              A. Identity Details
            </h2>
            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                1. Name of the Applicant
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <input
                    disabled
                    type='text'
                    name='firstName'
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded'
                    placeholder='First Name'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    disabled
                    name='lastName'
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded'
                    placeholder='Last Name'
                  />
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                2. Father's/Spouse's Name
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <input
                    disabled
                    type='text'
                    name='fatherFirstName'
                    value={formData.fatherFirstName}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded'
                    placeholder='First Name'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    disabled
                    name='fatherLastName'
                    value={formData.fatherLastName}
                    onChange={handleInputChange}
                    className='w-full p-2 border border-gray-300 rounded'
                    placeholder='Last Name'
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-6'>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  2a. Gender
                </label>
                <div className='space-y-2'>
                  {['Male', 'Female'].map((option) => (
                    <label key={option} className='flex items-center'>
                      <input
                        type='radio'
                        name='gender'
                        value={option}
                        checked={formData.gender === option}
                        onChange={handleInputChange}
                        className='form-radio'
                      />
                      <span className='ml-2'>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  2b. Marital Status
                </label>
                <div className='space-y-2'>
                  {['Single', 'Married'].map((option) => (
                    <label key={option} className='flex items-center'>
                      <input
                        type='radio'
                        name='maritalStatus'
                        value={option}
                        checked={formData.maritalStatus === option}
                        onChange={handleInputChange}
                        className='form-radio'
                      />
                      <span className='ml-2'>{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='dateOfBirth'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                2c. Date of Birth
              </label>
              <input
                type='date'
                id='dateOfBirth'
                name='dateOfBirth'
                disabled
                value={
                  formData.dateOfBirth
                    ? new Date(formData.dateOfBirth).toISOString().split('T')[0]
                    : ''
                }
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='MM-DD-YYYY'
              />
            </div>

            <div className='mb-6'>
              <label
                htmlFor='nationality'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                3. Nationality
              </label>
              <select
                id='nationality'
                disabled
                name='nationality'
                className='w-full p-2 border border-gray-300 rounded appearance-none bg-white'
                value={formData.nationality}
                onChange={handleInputChange}
              >
                <option value=''>Please Select</option>
                <option value='indian'>Indian</option>
                <option value='other'>Other</option>
              </select>
            </div>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                4. Status
              </label>
              <div className='space-y-2'>
                {[
                  'Resident Individual',
                  'Non Resident',
                  'Foreign National',
                ].map((option) => (
                  <label key={option} className='flex items-center'>
                    <input
                      type='radio'
                      name='status'
                      value={option}
                      checked={formData.status === option}
                      onChange={handleInputChange}
                      className='form-radio'
                    />
                    <span className='ml-2'>{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              B. Address Details
            </h2>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                1. Address for Correspondence
              </label>
              <input
                type='text'
                disabled
                name='street'
                value={formData.address.street}
                onChange={handleAddressChange}
                className='w-full p-2 border border-gray-300 rounded mb-2'
                placeholder='Street Address'
              />
              <input
                type='text'
                name='street2'
                disabled
                value={formData.address.street2}
                onChange={handleAddressChange}
                className='w-full p-2 border border-gray-300 rounded mb-2'
                placeholder='Street Address Line 2'
              />
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
                <input
                  type='text'
                  name='city'
                  disabled
                  value={formData.address.city}
                  onChange={handleAddressChange}
                  className='w-full p-2 border border-gray-300 rounded'
                  placeholder='City'
                />
                <select
                  name='state'
                  value={formData.address.state}
                  disabled
                  onChange={handleAddressChange}
                  className='w-full p-2 border border-gray-300 rounded appearance-none bg-white'
                >
                  <option value=''>Please Select</option>
                  <option value='state1'>State 1</option>
                  <option value='state2'>State 2</option>
                  {/* Add more states as needed */}
                </select>
              </div>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <input
                  type='text'
                  name='postalCode'
                  disabled
                  value={formData.address.postalCode}
                  onChange={handleAddressChange}
                  className='w-full p-2 border border-gray-300 rounded'
                  placeholder='Postal / Zip Code'
                />
                <input
                  type='text'
                  name='country'
                  disabled
                  value={formData.address.country}
                  onChange={handleAddressChange}
                  className='w-full p-2 border border-gray-300 rounded'
                  placeholder='Country'
                />
              </div>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='phoneNumber'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                2. Phone Number
              </label>
              <input
                type='tel'
                id='phoneNumber'
                name='phoneNumber'
                value={formData.phoneNumber}
                disabled
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='+91'
              />
              <p className='text-xs text-gray-500 mt-1'>
                Please enter a valid phone number.
              </p>
            </div>

            <div className='mb-6'>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                3. Email
              </label>
              <input
                type='email'
                id='email'
                name='email'
                disabled
                value={formData.email}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='Enter your email'
              />
            </div>
          </div>

          <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              C. Bank Account Details
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <label
                  htmlFor='bankName'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Bank Name
                </label>
                <input
                  type='text'
                  id='bankName'
                  name='bankName'
                  disabled
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                  placeholder='Bank of Barod'
                />
              </div>
              <div>
                <label
                  htmlFor='branchName'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Branch Name
                </label>
                <input
                  type='text'
                  id='branchName'
                  disabled
                  name='branchName'
                  placeholder='National Bank of XYZ'
                  value={formData.branchName}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <label
                  htmlFor='accountNumber'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Account Number
                </label>
                <input
                  type='text'
                  id='accountNumber'
                  name='accountNumber'
                  disabled
                  placeholder='1234567890'
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
              <div>
                <label
                  htmlFor='ifscCode'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  IFSC Code
                </label>
                <input
                  type='text'
                  id='ifscCode'
                  name='ifscCode'
                  placeholder='NBXYZ0001234'
                  disabled
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
            </div>
            <div className='mb-6'>
              <label
                htmlFor='accountHolderName'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Account Holder Name
              </label>
              <input
                type='text'
                id='accountHolderName'
                name='accountHolderName'
                disabled
                placeholder='Central City Branch'
                value={formData.accountHolderName}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded'
              />
            </div>
          </div>

          <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              D. Tax Information
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <label
                  htmlFor='pancardNumber'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  PAN Card Number
                </label>
                <input
                  type='text'
                  id='pancardNumber'
                  name='pancardNumber'
                  disabled
                  placeholder='ABCDE1234F'
                  value={formData.pancardNumber}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
              <div>
                <label
                  htmlFor='gstNumber'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  GST Number (if applicable)
                </label>
                <input
                  type='text'
                  id='gstNumber'
                  disabled
                  name='gstNumber'
                  placeholder='27ABCDE1234F2Z5'
                  value={formData.gstNumber}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
            </div>
            <div className='mb-6'>
              <label
                htmlFor='taxResidency'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Tax Residency
              </label>
              <input
                type='text'
                disabled
                id='taxResidency'
                name='taxResidency'
                placeholder='INDIA'
                value={formData.taxResidency}
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded'
              />
            </div>
          </div>

          <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
            <h2 className='text-xl font-semibold text-gray-700 mb-4'>
              E. Identity Documents
            </h2>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
              <div>
                <label
                  htmlFor='aadharNumber'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Aadhar Number
                </label>
                <input
                  type='text'
                  id='aadharNumber'
                  name='aadharNumber'
                  disabled
                  placeholder='1234 5678 9012'
                  value={formData.aadharNumber}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
              <div>
                <label
                  htmlFor='passportNumber'
                  className='block text-sm font-medium text-gray-700 mb-2'
                >
                  Passport Number
                </label>
                <input
                  type='text'
                  id='passportNumber'
                  name='passportNumber'
                  disabled
                  placeholder='N1234567'
                  value={formData.passportNumber}
                  onChange={handleInputChange}
                  className='w-full p-2 border border-gray-300 rounded'
                />
              </div>
            </div>
            <div className='mb-6'>
              <label
                htmlFor='drivingLicense'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Driving License
              </label>
              <input
                type='text'
                id='drivingLicense'
                name='drivingLicense'
                disabled
                value={formData.drivingLicense}
                placeholder='D1234567890'
                onChange={handleInputChange}
                className='w-full p-2 border border-gray-300 rounded'
              />
            </div>
          </div>

          <div className='max-w-4xl mx-auto p-4 bg-gray-50'>
            {/* Previous sections (A to E) remain unchanged */}

            <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                F. Document Verification
              </h2>

              {/* Aadhar Documents */}
              <div className='mb-4'>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  Aadhar Documents
                </h3>
                <div className='flex flex-row items-center gap-4'>
                  {formData.aadharDocument?.map((doc, index) => (
                    <div
                      key={index}
                      className='flex flex-col items-start space-y-2'
                    >
                      <img
                        src={doc}
                        onClick={() =>
                          openImageViewer(formData.aadharDocument, index)
                        }
                        alt={`Aadhar Document ${index + 1}`}
                        className='w-full h-auto max-w-xs rounded border border-gray-300'
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* GST Document */}
              <div className='mb-4'>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  GST Document
                </h3>
                {formData.gstDocument ? (
                  <img
                    src={formData.gstDocument}
                    onClick={() => openImageViewer([formData.gstDocument], 0)}
                    alt='GST Document'
                    className='w-full h-auto max-w-xs rounded border border-gray-300'
                  />
                ) : (
                  <p className='text-gray-500'>No GST Document available.</p>
                )}
              </div>

              {/* Pancard Document */}
              <div>
                <h3 className='text-lg font-semibold text-gray-600 mb-2'>
                  Pancard Document
                </h3>
                {formData.pancardDocument ? (
                  <img
                    src={formData.pancardDocument}
                    onClick={() =>
                      openImageViewer([formData.pancardDocument], 0)
                    }
                    alt='Pancard Document'
                    className='w-full h-auto max-w-xs rounded border border-gray-300'
                  />
                ) : (
                  <p className='text-gray-500'>
                    No Pancard Document available.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className='max-w-4xl mx-auto p-4 bg-gray-50'>
            {/* Previous sections (A to F) remain unchanged */}

            <div className='bg-blue-50 p-6 mb-6 rounded-lg shadow'>
              <h2 className='text-xl font-semibold text-gray-700 mb-4'>
                D. Declaration
              </h2>

              <p className='mb-6 text-sm text-gray-600'>
                I hereby declare that the information provided in this form is
                accurate and complete. I confirm that any information is found
                incorrect and/or incomplete that leads a violation of
                regulations may initiate legal actions, and I accept that I am
                the responsible party for any and all charges, penalties and
                violations.
              </p>

              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Name of the Applicant
                </label>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <input
                      type='text'
                      disabled
                      name='declarationFirstName'
                      value={formData.declarationFirstName}
                      onChange={handleInputChange}
                      className='w-full p-2 border border-gray-300 rounded'
                      placeholder='First Name'
                    />
                    <span className='text-xs text-gray-500'>First Name</span>
                  </div>
                  <div>
                    <input
                      type='text'
                      name='declarationLastName'
                      value={formData.declarationLastName}
                      onChange={handleInputChange}
                      disabled
                      className='w-full p-2 border border-gray-300 rounded'
                      placeholder='Last Name'
                    />
                    <span className='text-xs text-gray-500'>Last Name</span>
                  </div>
                </div>
              </div>

              <div className='mb-6'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Signature of the Applicant
                </label>
                <div className='border border-gray-300 rounded p-4 text-center'>
                  {formData.signature ? (
                    <img
                      src={formData.signature}
                      onClick={() => openImageViewer([formData.signature], 0)}
                      alt='Signature'
                      className='max-h-32 mx-auto'
                    />
                  ) : (
                    <div className='flex flex-col items-center justify-center h-32 bg-gray-100'>
                      <Pen className='w-8 h-8 text-gray-400 mb-2' />
                      <span className='text-sm text-gray-500'>Sign Here</span>
                    </div>
                  )}
                  <input
                    type='file'
                    id='signature'
                    name='signature'
                    accept='image/*'
                    onChange={handleSignatureChange}
                    className='hidden'
                  />
                </div>
              </div>
            </div>
          </div>
          <div className='flex justify-between gap-6 text-white'>
            <button
              onClick={() => handleApproveKyc(selectedVendorKyc.id)}
              disabled={selectedVendorKyc.kycStatus === 'VERIFIED'}
              type='button'
              className={`  ${
                selectedVendorKyc.kycStatus === 'VERIFIED'
                  ? 'bg-green-300'
                  : 'bg-green-400'
              } py-2 px-8 w-full`}
            >
              Approve
            </button>
            <button
              type='button'
              disabled={selectedVendorKyc.kycStatus === 'REJECTED'}
              onClick={() => handleRejectKyc(selectedVendorKyc.id)}
              className={` ${
                selectedVendorKyc.kycStatus === 'REJECTED'
                  ? 'bg-red-300'
                  : 'bg-red-500'
              } py-2 px-8 w-full`}
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
                        onClick={() => handleSubmit(selectedVendorKyc.id)}
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
        </div>
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
