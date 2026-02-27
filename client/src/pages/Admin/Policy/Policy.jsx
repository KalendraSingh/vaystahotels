import React, { useState, useRef } from 'react';

const Policy = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [checkInTime, setCheckInTime] = useState('10:00 PM IST');
  const [checkOutTime, setCheckOutTime] = useState('11:00 AM IST');
  const [childrenPolicy, setChildrenPolicy] = useState('');
  const [localId, setLocalId] = useState('');
  const [coupleFriendly, setCoupleFriendly] = useState('');
  const [foreignGuests, setForeignGuests] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState('My Own Property');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);
  const ownershipTypes = [
    'My Own Property',
    'Rented Property',
    'Family Property',
  ];

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (type) => {
    setSelectedType(type);
    setIsOpen(false);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handlePrevious = () => {
    console.log('Go to Previous');
  };

  const handleSaveAndContinue = () => {
    console.log('Save & Continue');
  };

  const policies = [
    { label: 'Free Cancellation upto 24hrs', value: '24hrs' },
    { label: 'Free Cancellation upto 48hrs', value: '48hrs' },
    { label: 'Free Cancellation upto 72hrs', value: '72hrs' },
    { label: 'No Refundable', value: 'no_refund' },
  ];

  const TimeInput = ({ label, value, onChange }) => (
    <div className='flex flex-col'>
      <label className='font-medium text-zinc-700'>{label}</label>
      <input
        type='time'
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='flex gap-5 justify-between px-5 py-3 mt-1.5 max-w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 w-[221px]'
      />
    </div>
  );

  const SelectInput = ({ label, value, onChange, options }) => (
    <div className='flex flex-col'>
      <label className='font-medium text-zinc-700'>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='flex gap-5 justify-between px-5 py-3 mt-1.5 max-w-full text-gray-500 whitespace-nowrap bg-white rounded-md border border-solid border-zinc-300 w-[221px]'
      >
        <option value=''>Select</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  const CancellationPolicy = ({ label, isSelected, onChange }) => (
    <div
      className='flex gap-3 px-3 py-2.5 mt-9 text-gray-500 bg-white rounded-md border border-solid border-zinc-300 cursor-pointer'
      onClick={onChange}
    >
      <div
        className={`flex shrink-0 my-auto h-3 rounded-full border border-solid ${
          isSelected ? 'bg-zinc-700' : 'border-zinc-700'
        } w-[13px]`}
      />
      <span className='basis-auto'>{label}</span>
    </div>
  );

  return (
    <>
      <form className='flex flex-col text-sm rounded-lg'>
        <section className='flex overflow-hidden flex-col items-start pt-5 pr-16 pb-11 pl-7 w-full bg-white rounded-lg max-md:px-5 max-md:max-w-full'>
          <h2 className='text-xl font-medium text-zinc-700'>Policies</h2>
          <p className='text-gray-500 max-md:max-w-full'>
            Mention your property policies, house rules, check-in, and check-out
            timings, and cancellation policies
          </p>
          <div className='flex gap-8 mt-7'>
            <TimeInput
              label='Check-In Time*'
              value={checkInTime}
              onChange={setCheckInTime}
              placeholder='Check In'
            />
            <TimeInput
              label='Check-Out Time*'
              value={checkOutTime}
              onChange={setCheckOutTime}
              placeholder='Check Out'
            />
            <SelectInput
              label='Children Policy'
              value={childrenPolicy}
              onChange={setChildrenPolicy}
              options={['Allowed', 'Not Allowed']}
            />
          </div>
          <div className='flex gap-8 mt-7'>
            <SelectInput
              label='Local ID*'
              value={localId}
              onChange={setLocalId}
              options={['Required', 'Not Required']}
            />
            <SelectInput
              label='Couple Friendly'
              value={coupleFriendly}
              onChange={setCoupleFriendly}
              options={['Yes', 'No']}
            />
            <SelectInput
              label='Foreign Guests'
              value={foreignGuests}
              onChange={setForeignGuests}
              options={['Allowed', 'Not Allowed']}
            />
          </div>
          <div className='flex flex-wrap gap-5 items-end self-stretch mt-10'>
            <div className='flex flex-col self-stretch'>
              <label className='font-medium text-zinc-700 max-md:mr-1.5'>
                Do you work with channel manager?
              </label>
            </div>
            {policies.map((policy, index) => (
              <CancellationPolicy
                key={index}
                label={policy.label}
                isSelected={selectedPolicy === policy.value}
                onChange={() => setSelectedPolicy(policy.value)}
              />
            ))}
          </div>
        </section>
      </form>

      <main className='flex flex-col rounded-none'>
        <section className='flex overflow-hidden flex-col items-start pt-5 pr-20 pb-14 pl-7 w-full bg-white rounded-lg max-md:px-5 max-md:max-w-full'>
          <h1 className='text-xl font-medium text-zinc-700'>
            Ownership Details
          </h1>
          <p className='text-sm text-gray-500 max-md:max-w-full'>
            Upload a valid government lease or registration document as proof of
            property ownership.
          </p>
          <div className='flex flex-col mt-7 max-w-full text-sm w-[456px]'>
            <label
              htmlFor='ownershipType'
              className='font-medium text-zinc-700'
            >
              Choose the ownership type
            </label>
            <div className='relative'>
              <button
                id='ownershipType'
                onClick={handleToggle}
                aria-haspopup='listbox'
                aria-expanded={isOpen}
                className='flex gap-5 justify-between px-5 py-3 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 max-md:pr-5'
              >
                <span>{selectedType}</span>
                <img
                  src='https://cdn.builder.io/api/v1/image/assets/TEMP/297287767f2206e1bdd1d5f3a46b2b2268e99ec57387d0960fe5aac18d8b3c58?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                  className={`object-contain shrink-0 self-start mt-2.5 w-3.5 aspect-[1.75] transition-transform ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                  alt=''
                />
              </button>
              {isOpen && (
                <ul
                  role='listbox'
                  className='absolute z-10 w-full mt-1 bg-white border border-zinc-300 rounded-md shadow-lg'
                >
                  {ownershipTypes.map((type) => (
                    <li
                      key={type}
                      role='option'
                      aria-selected={type === selectedType}
                      onClick={() => handleSelect(type)}
                      className='px-5 py-2 hover:bg-gray-100 cursor-pointer'
                    >
                      {type}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          <label
            htmlFor='documentUpload'
            className='mt-7 text-sm font-medium text-zinc-700'
          >
            Upload the registration document of the property
          </label>
          <div
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            className='flex flex-col justify-center items-center px-16 py-9 mt-3 max-w-full text-center bg-white rounded-md border border-dashed border-zinc-300 w-[345px] max-md:px-5 cursor-pointer'
          >
            <div className='flex flex-col items-center max-w-full w-[104px]'>
              <img
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/4915d7db280d9cc11fc6215c2ea31f44cc14fb5e5149e4d2fd9df7f4615a4647?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                className='object-contain aspect-square w-[29px]'
                alt='Upload icon'
              />
              <span className='mt-2 text-xs font-medium text-zinc-700'>
                {file ? file.name : 'Upload Photo'}
              </span>
              <span className='self-stretch text-xs leading-4 text-stone-300'>
                or drop files to upload
              </span>
            </div>
            <input
              type='file'
              id='documentUpload'
              ref={fileInputRef}
              onChange={handleFileChange}
              className='sr-only'
              aria-label='Upload registration document'
              accept='image/*,.pdf'
            />
          </div>
        </section>
      </main>
      <section className='mt-6 mb-4 p-4 bg-gray-100 rounded-lg shadow-sm'>
        <div className='flex justify-between flex-wrap gap-4 md:gap-10 text-xs leading-loose'>
          <button
            className='flex gap-4 justify-center items-center px-4 py-3.5 text-xs leading-loose rounded-md min-h-[45px] bg-white border border-solid border-zinc-300 text-neutral-800'
            onClick={handlePrevious}
          >
            <img
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/fdb0c970f410df03561f81973edcc532a431f49e2267e19a28c48dff71cff4c1?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
              alt=''
              className='object-contain shrink-0 self-stretch my-auto w-3.5 aspect-[1.27]'
            />
            <span className='self-stretch my-auto'>Go to Previous</span>
          </button>

          <button
            className='flex gap-4  cta justify-center items-center px-4 py-3.5 text-xs leading-loose rounded-md min-h-[45px] text-white'
            onClick={handleSaveAndContinue}
          >
            <span className='self-stretch my-auto'>Save & Continue</span>
            <img
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/71f8756073f7c484fb75bd1c8d99ff0e943df76f946819ab27aa9900feaa7d0f?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
              alt=''
              className='object-contain shrink-0 self-stretch my-auto w-3.5 aspect-[1.27]'
            />
          </button>
        </div>
      </section>
    </>
  );
};

export default Policy;
