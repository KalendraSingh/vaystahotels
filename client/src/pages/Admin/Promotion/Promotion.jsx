import React, { useState } from 'react';

const Promotion = () => {
  const [offerTitle, setOfferTitle] = useState(
    '25% Discount for First 100 Customers'
  );
  const [description, setDescription] = useState(
    'Optimize your offers with advanced features like limited-time flash deals, personalized offers for loyalty members, and multi-tier discounts for extended stays'
  );
  const [discountType, setDiscountType] = useState('Percentage Off');
  const [discountWorth, setDiscountWorth] = useState('25%');
  const [minimumBooking, setMinimumBooking] = useState('Percentage Off');
  const [startDate, setStartDate] = useState('2024-09-20');
  const [endDate, setEndDate] = useState('2024-09-20');
  const [startTime, setStartTime] = useState('12:40');
  const [endTime, setEndTime] = useState('12:40');
  const [file, setFile] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);

  const handleOfferTitleChange = (e) => setOfferTitle(e.target.value);
  const handleDescriptionChange = (e) => setDescription(e.target.value);
  const handleDiscountTypeChange = (value) => setDiscountType(value);
  const handleDiscountWorthChange = (e) => setDiscountWorth(e.target.value);
  const handleMinimumBookingChange = (value) => setMinimumBooking(value);
  const handleStartDateChange = (e) => setStartDate(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);
  const handleStartTimeChange = (e) => setStartTime(e.target.value);
  const handleEndTimeChange = (e) => setEndTime(e.target.value);
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
    } else {
      alert('Please select a valid image file.');
    }
  };
  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
    } else {
      alert('Please drop a valid image file.');
    }
  };
  const handleDragOver = (event) => event.preventDefault();
  const handleAgreementChange = () => setIsAgreed(!isAgreed);
  const handleDeleteImage = () => setFile(null);

  return (
    <main className='flex flex-col rounded-none'>
      <section className='overflow-hidden px-7 pt-5 pb-16 w-full bg-white rounded-lg max-md:px-5 max-md:max-w-full'>
        <div className='flex gap-5 max-md:flex-col'>
          <div className='flex flex-col w-[58%] max-md:ml-0 max-md:w-full'>
            <div className='flex flex-col items-start w-full max-md:mt-10 max-md:max-w-full'>
              <h2 className='text-xl font-medium text-zinc-700'>Description</h2>
              <p className='text-sm text-gray-500'>
                Set discount rates, offer durations, to attract more bookings.
              </p>
              <div className='flex flex-col mt-3.5 max-w-full text-sm w-[501px]'>
                <label
                  htmlFor='offerTitle'
                  className='font-medium text-zinc-700'
                >
                  Offer Title
                </label>
                <input
                  id='offerTitle'
                  type='text'
                  className='px-4 py-3 mt-1.5 w-full bg-white rounded-md border border-solid border-zinc-300 text-neutral-800 max-md:pr-5'
                  value={offerTitle}
                  onChange={handleOfferTitleChange}
                />
              </div>
              <label
                htmlFor='description'
                className='mt-6 text-sm font-medium text-zinc-700 max-md:ml-0.5'
              >
                Description
              </label>
              <div className='flex flex-col px-5 pt-4 pb-1.5 mt-1.5 max-w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 w-[501px] max-md:pl-5'>
                <textarea
                  id='description'
                  className='mr-7 text-sm leading-6 max-md:mr-2.5 max-md:max-w-full'
                  rows='4'
                  value={description}
                  onChange={handleDescriptionChange}
                />
                <div className='self-end mt-7 text-xs text-right'>
                  {description.length}/300
                </div>
              </div>
            </div>
            <div className='self-stretch mt-7 max-md:max-w-full'>
              <div className='flex gap-5 max-md:flex-col'>
                <div className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'>
                  <div className='flex z-10 flex-col grow items-start text-sm max-md:mr-0'>
                    <h3 className='text-xl font-medium text-zinc-700'>
                      Discount Type
                    </h3>
                    <div className='flex flex-col self-stretch mt-4 w-full'>
                      <SelectWithIcon
                        label='Discount Type'
                        options={[
                          'Percentage Off',
                          'Fixed Amount',
                          'Buy One Get One',
                        ]}
                        icon='http://b.io/ext_7-'
                        id='discountType'
                        value={discountType}
                        onChange={handleDiscountTypeChange}
                      />
                    </div>
                    <div className='flex flex-col mt-4 max-w-full min-h-[83px] w-[222px]'>
                      <InputWithIcon
                        label='Discount Worth'
                        type='text'
                        value={discountWorth}
                        onChange={handleDiscountWorthChange}
                        id='discountWorth'
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full'>
                  <div className='flex flex-col self-stretch my-auto w-full text-sm max-md:mt-10'>
                    <SelectWithIcon
                      label='Minimum Booking'
                      options={['Percentage Off', 'Fixed Amount', 'No Minimum']}
                      icon='http://b.io/ext_8-'
                      id='minimumBooking'
                      value={minimumBooking}
                      onChange={handleMinimumBookingChange}
                    />
                  </div>
                </div>
              </div>
            </div>
            <h3 className='mt-5 text-xl font-medium text-zinc-700'>
              Offer Validity Period
            </h3>
            <div className='mt-3 max-w-full w-[489px]'>
              <div className='flex gap-5 max-md:flex-col'>
                <div className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'>
                  <div className='flex flex-col w-full text-sm font-medium text-zinc-700 max-md:mt-10'>
                    <InputWithIcon
                      label='Starting On'
                      type='date'
                      value={startDate}
                      onChange={handleStartDateChange}
                      icon='http://b.io/ext_9-'
                      id='startDate'
                    />
                    <div className='mt-4'>
                      <InputWithIcon
                        label='Ending On'
                        type='date'
                        value={endDate}
                        onChange={handleEndDateChange}
                        icon='http://b.io/ext_9-'
                        id='endDate'
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full'>
                  <div className='flex flex-col mt-7 w-full text-sm text-gray-500 max-md:mt-10'>
                    <InputWithIcon
                      type='time'
                      value={startTime}
                      onChange={handleStartTimeChange}
                      icon='http://b.io/ext_10-'
                      id='startTime'
                    />
                    <div className='mt-11 max-md:mt-10'>
                      <InputWithIcon
                        type='time'
                        value={endTime}
                        onChange={handleEndTimeChange}
                        icon='http://b.io/ext_10-'
                        id='endTime'
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='flex gap-5 justify-between self-center mt-11 max-w-full text-xs leading-loose w-[393px] max-md:mt-10'>
              <button className='gap-4 self-stretch px-4 py-3.5 text-center whitespace-nowrap bg-white rounded-md border border-solid border-zinc-300 min-h-[45px] text-neutral-800'>
                Cancel
              </button>
              <button className='gap-4 self-stretch px-4 py-3.5 text-right text-white bg-orange-600 rounded-md min-h-[45px]'>
                Create Offer
              </button>
            </div>
          </div>
          <div className='flex flex-col ml-5 w-[42%] max-md:ml-0 max-md:w-full'>
            <div className='flex flex-col items-start mt-2 w-full max-md:mt-10'>
              <h3 className='text-xl font-medium text-zinc-700'>
                Banners<span className='text-base leading-6 '>(optional)</span>
              </h3>
              <div
                className='flex flex-col justify-center items-center px-16 py-5 mt-3 max-w-full text-center bg-white rounded-md border border-dashed border-zinc-300 w-[346px] max-md:px-5'
                onDrop={handleDrop}
                onDragOver={handleDragOver}
              >
                <div className='flex flex-col items-center max-w-full w-[104px]'>
                  <img
                    src='http://b.io/ext_11-'
                    alt=''
                    className='object-contain aspect-[1.03] w-[30px]'
                  />
                  <p className='mt-2 text-xs font-medium text-zinc-700'>
                    {file ? file.name : 'Upload Photo'}
                  </p>
                  <p className='self-stretch text-xs leading-4 text-stone-300'>
                    or drop files to upload
                  </p>
                  <input
                    type='file'
                    onChange={handleFileChange}
                    className='hidden'
                    accept='image/*'
                    id='fileInput'
                  />
                  <button
                    onClick={() => document.getElementById('fileInput').click()}
                    className='mt-2 px-4 py-2 bg-blue-500 text-white rounded-md text-xs'
                  >
                    Select File
                  </button>
                </div>
              </div>
              {file && (
                <div className='mt-4 relative'>
                  <img
                    src={URL.createObjectURL(file)}
                    alt='Uploaded banner'
                    className='max-w-full h-auto rounded-md'
                  />
                  <button
                    onClick={handleDeleteImage}
                    className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1'
                    aria-label='Delete image'
                  >
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path
                        fillRule='evenodd'
                        d='M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z'
                        clipRule='evenodd'
                      />
                    </svg>
                  </button>
                </div>
              )}
              <div className='flex gap-3 mt-7 text-xs leading-5 text-zinc-700'>
                <input
                  type='checkbox'
                  id='discountAgreement'
                  checked={isAgreed}
                  onChange={handleAgreementChange}
                  className='shrink-0 self-start w-[23px] h-[23px]'
                />
                <label htmlFor='discountAgreement' className='flex-auto'>
                  I understand the discount given in this offer will be borne by
                  me
                </label>
              </div>
            </div>
            <div className='mt-10 text-sm font-medium text-zinc-700 max-md:mt-10'>
              <h4>Offer Terms and Conditions</h4>
              <div className='mt-3 text-xs font-light leading-6 text-neutral-900'>
                <p>
                  <span className='font-medium'>Eligibility: </span>Promotional
                  offers are available to customers who meet the specified
                  criteria outlined in each promotion. Offers are subject to
                  availability and may be limited by region, booking type, or
                  other factors.
                </p>
                <p>
                  <span className='font-medium'>Validity:</span> Each offer is
                  valid for a limited time only, as stated in the promotion
                  details. Offers must be redeemed before the expiration date
                  and cannot be extended.
                </p>
                <p>
                  <span className='font-medium'>Non-Transferable: </span>{' '}
                  Promotional offers are non-transferable, non-exchangeable, and
                  cannot be redeemed for cash or combined with other discounts
                  or promotions unless otherwise stated.
                </p>
                <p>
                  <span className='font-medium'>Limited Use: </span>Each
                  customer may use the promotional offer only once unless
                  specified otherwise. Multiple uses by the same customer may
                  result in cancellation of bookings.
                </p>
                <p>
                  <span className='font-medium'>Cancellation Policy:</span> If a
                  booking made using a promotional offer is canceled, the offer
                  will not be reissued, and standard cancellation policies will
                  apply.
                </p>
                <p>
                  <span className='font-medium'>Modifications: </span>The
                  provider reserves the right to modify, suspend, or terminate
                  any promotional offer at any time without prior notice, for
                  any reason.
                </p>
                <p>
                  <span className='font-medium'>Misuse:</span> Any fraudulent
                  use or violation of the terms of a promotional offer may
                  result in booking cancellation and potential legal action.
                </p>
                <p>
                  <span className='font-medium'>Disputes:</span> In case of any
                  disputes regarding promotional offers, the provider's decision
                  will be final and binding.
                </p>
                <p>
                  <span className='font-medium'>Exclusions:</span> Certain
                  hotels, resorts, or room types may be excluded from
                  promotional offers. Check the offer details for any specific
                  exclusions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

const SelectWithIcon = ({ label, options, icon, id, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className='relative'>
      <label htmlFor={id} className='font-medium text-zinc-700'>
        {label}
      </label>
      <div
        className='flex gap-5 justify-between px-5 py-3 mt-1.5 max-w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 w-[225px] cursor-pointer'
        onClick={() => setIsOpen(!isOpen)}
      >
        <div>{value}</div>
        <img
          src={icon}
          alt=''
          className={`object-contain shrink-0 my-auto aspect-[1.63] w-[13px] transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </div>
      {isOpen && (
        <ul className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg'>
          {options.map((option) => (
            <li
              key={option}
              className='px-4 py-2 hover:bg-gray-100 cursor-pointer'
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const InputWithIcon = ({ label, type, value, onChange, icon, id }) => {
  return (
    <div className='relative'>
      {label && (
        <label htmlFor={id} className='font-medium text-zinc-700'>
          {label}
        </label>
      )}
      <div className='relative'>
        <input
          type={type}
          id={id}
          value={value}
          onChange={onChange}
          className='px-4 py-3 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300'
        />
        {icon && (
          <img
            src={icon}
            alt=''
            className='absolute right-3 top-1/2 transform -translate-y-1/2 object-contain shrink-0 aspect-square w-[18px]'
          />
        )}
      </div>
    </div>
  );
};

export default Promotion;
