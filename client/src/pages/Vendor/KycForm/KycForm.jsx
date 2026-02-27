import { useState, useCallback } from 'react';
import { X, Upload, File } from 'lucide-react';
import { Pen } from 'lucide-react';
import { useAuth } from '../../../Hooks/useAuth';
import { addVendorKYC } from '../../../../api/Vendor/HotelApi';
import { notification } from 'antd';

export default function Component() {
  const { vendorAuth } = useAuth();
  const vendorId = vendorAuth.data && vendorAuth.data.id;
  const [formData, setFormData] = useState({
    vendorId: vendorId && vendorId,
    firstName: '',
    lastName: '',
    fatherFirstName: '',
    fatherLastName: '',
    gender: '',
    maritalStatus: '',
    dateOfBirth: '',
    nationality: '',
    status: '',
    pancardNumber: '',
    proofOfIdentity: '',
    address: {
      street: '',
      street2: '',
      city: '',
      state: '',
      postalCode: '',
      country: '',
    },
    phoneNumber: '',
    email: '',
    bankName: '',
    branchName: '',
    accountNumber: '',
    ifscCode: '',
    accountHolderName: '',
    gstNumber: '',
    taxResidency: '',
    aadharNumber: '',
    passportNumber: '',
    drivingLicense: '',
    declarationFirstName: '',
    declarationLastName: '',
    pancardDocument: null,
    aadharDocument: [],
    gstDocument: null,
    signature: null,
  });

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

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e, documentType) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length) {
      const files = Array.from(e.dataTransfer.files);
      setFormData((prev) => ({
        ...prev,
        [documentType]:
          documentType === 'aadharDocument'
            ? [...prev.aadharDocument, ...files]
            : files[0],
      }));
    }
  }, []);

  const handleFileChange = useCallback((e, documentType) => {
    if (e.target.files && e.target.files.length) {
      const files = Array.from(e.target.files);
      setFormData((prev) => ({
        ...prev,
        [documentType]:
          documentType === 'aadharDocument'
            ? [...prev.aadharDocument, ...files]
            : files[0],
      }));
    }
  }, []);

  const removeDocument = useCallback((docName, fileIndex = null) => {
    setFormData((prev) => ({
      ...prev,
      [docName]:
        docName === 'aadharDocument' && fileIndex !== null
          ? prev.aadharDocument.filter((_, index) => index !== fileIndex)
          : null, // Single file for other documents
    }));
  }, []);

  const handleSignatureChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        signature: e.target.files[0],
      }));
    }
  };

  const renderFileUpload = (documentType, label, placeholder) => {
    const files = formData[documentType];
    const isMultiple = Array.isArray(files);

    return (
      <div className='mb-6'>
        <label
          htmlFor={documentType}
          className='block text-sm font-medium text-gray-700 mb-2'
        >
          {label}
        </label>
        <div
          className='border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors'
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, documentType)}
          onClick={() => document.getElementById(documentType)?.click()}
        >
          {!files || files.length === 0 ? (
            <>
              <Upload className='w-12 h-12 text-gray-400 mb-2' />
              <p className='text-lg font-semibold text-gray-700'>
                Browse Files
              </p>
              <p className='text-sm text-gray-500'>Drag and drop files here</p>
              <p className='text-xs text-gray-400 mt-2'>{placeholder}</p>
              <input
                id={documentType}
                type='file'
                className='hidden'
                onChange={(e) => handleFileChange(e, documentType)}
                accept='image/*,.pdf'
                multiple={isMultiple}
              />
            </>
          ) : isMultiple ? (
            files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between w-full mb-2'
              >
                <div className='flex items-center'>
                  {file.type.startsWith('image/') ? (
                    <div className='relative w-16 h-16 mr-4'>
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`Preview of ${label}`}
                        className='w-full h-full object-cover rounded'
                      />
                    </div>
                  ) : (
                    <File className='w-8 h-8 text-blue-500 mr-2' />
                  )}
                  <span className='text-sm font-medium text-gray-700'>
                    {file.name}
                  </span>
                </div>
                <button
                  type='button'
                  onClick={(e) => {
                    e.stopPropagation();
                    removeDocument(documentType, index);
                  }}
                  className='text-red-500 hover:text-red-700'
                >
                  <X size={20} />
                </button>
              </div>
            ))
          ) : (
            <div className='flex items-center justify-between w-full'>
              <div className='flex items-center'>
                {files.type.startsWith('image/') ? (
                  <div className='relative w-16 h-16 mr-4'>
                    <img
                      src={URL.createObjectURL(files)}
                      alt={`Preview of ${label}`}
                      className='w-full h-full object-cover rounded'
                    />
                  </div>
                ) : (
                  <File className='w-8 h-8 text-blue-500 mr-2' />
                )}
                <span className='text-sm font-medium text-gray-700'>
                  {files.name}
                </span>
              </div>
              <button
                type='button'
                onClick={(e) => {
                  e.stopPropagation();
                  removeDocument(documentType);
                }}
                className='text-red-500 hover:text-red-700'
              >
                <X size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log('formData', formData);
    try {
      const kycFormData = new FormData();

      kycFormData.append('vendorId', formData.vendorId);
      kycFormData.append('firstName', formData.firstName);
      kycFormData.append('lastName', formData.lastName);
      kycFormData.append('fatherFirstName', formData.fatherFirstName);
      kycFormData.append('fatherLastName', formData.fatherLastName);
      kycFormData.append('gender', formData.gender);
      kycFormData.append('maritalStatus', formData.maritalStatus);
      kycFormData.append('dateOfBirth', formData.dateOfBirth);
      kycFormData.append('nationality', formData.nationality);
      kycFormData.append('status', formData.status);
      kycFormData.append('pancardNumber', formData.pancardNumber);
      kycFormData.append('street', formData.address.street);
      kycFormData.append('street2', formData.address.street2);
      kycFormData.append('city', formData.address.city);
      kycFormData.append('state', formData.address.state);
      kycFormData.append('postalCode', formData.address.postalCode);
      kycFormData.append('country', formData.address.country);
      kycFormData.append('phoneNumber', formData.phoneNumber);
      kycFormData.append('email', formData.email);
      kycFormData.append('bankName', formData.bankName);
      kycFormData.append('branchName', formData.branchName);
      kycFormData.append('accountNumber', formData.accountNumber);
      kycFormData.append('ifscCode', formData.ifscCode);
      kycFormData.append('accountHolderName', formData.accountHolderName);
      kycFormData.append('gstNumber', formData.gstNumber);
      kycFormData.append('taxResidency', formData.taxResidency);
      kycFormData.append('aadharNumber', formData.aadharNumber);
      kycFormData.append('passportNumber', formData.passportNumber);
      kycFormData.append('drivingLicense', formData.drivingLicense);
      kycFormData.append('declarationFirstName', formData.declarationFirstName);
      kycFormData.append('declarationLastName', formData.declarationLastName);
      kycFormData.append('pancardDocument', formData.pancardDocument);
      formData.aadharDocument.forEach((file) => {
        kycFormData.append('aadharDocuments', file);
      });
      kycFormData.append('gstDocument', formData.gstDocument);
      kycFormData.append('signature', formData.signature);
      const res = await addVendorKYC(kycFormData);
      if (res.status === 201) {
        notification.success({
          message: 'Your kyc submitted successfully, wait for aproval!',
        });
      }
    } catch (error) {
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
  };

  return (
    <form onSubmit={handleFormSubmit}>
      <div className=' mx-auto p-4 bg-gray-50'>
        <h1 className='text-3xl font-bold mb-6 text-gray-800'>KYC Form</h1>

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
              value={formData.dateOfBirth}
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
              {['Resident Individual', 'Non Resident', 'Foreign National'].map(
                (option) => (
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
                )
              )}
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
              name='street'
              value={formData.address.street}
              onChange={handleAddressChange}
              className='w-full p-2 border border-gray-300 rounded mb-2'
              placeholder='Street Address'
            />
            <input
              type='text'
              name='street2'
              value={formData.address.street2}
              onChange={handleAddressChange}
              className='w-full p-2 border border-gray-300 rounded mb-2'
              placeholder='Street Address Line 2'
            />
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-2'>
              <input
                type='text'
                name='city'
                value={formData.address.city}
                onChange={handleAddressChange}
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='City'
              />
              <select
                name='state'
                value={formData.address.state}
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
                value={formData.address.postalCode}
                onChange={handleAddressChange}
                className='w-full p-2 border border-gray-300 rounded'
                placeholder='Postal / Zip Code'
              />
              <input
                type='text'
                name='country'
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

            {renderFileUpload(
              'pancardDocument',
              'PAN Card',
              'Upload a clear image or PDF of your PAN card'
            )}
            {renderFileUpload(
              'aadharDocument',
              'Aadhar Card',
              'Upload a clear image or PDF of your Aadhar card (front and back)'
            )}
            {renderFileUpload(
              'gstDocument',
              'GST Document',
              'Upload a clear image or PDF of your GST registration certificate'
            )}
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
              incorrect and/or incomplete that leads a violation of regulations
              may initiate legal actions, and I accept that I am the responsible
              party for any and all charges, penalties and violations.
            </p>

            <div className='mb-6'>
              <label className='block text-sm font-medium text-gray-700 mb-2'>
                Name of the Applicant
              </label>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div>
                  <input
                    type='text'
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
                    src={URL.createObjectURL(formData.signature)}
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
                <button
                  type='button'
                  onClick={() => document.getElementById('signature')?.click()}
                  className='mt-4 px-4 py-2 cta text-white rounded transition-colors'
                >
                  Upload Signature
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className=''>
          <button className='cta py-2 px-8'>Submit form</button>
        </div>
      </div>
    </form>
  );
}
