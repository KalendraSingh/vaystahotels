import React, { useState, useEffect, useRef } from 'react';

const AddNewHotel = () => {
  const [propertyName, setPropertyName] = useState('');
  const [starRating, setStarRating] = useState('');
  const [bookingSince, setBookingSince] = useState('');
  const [useChannelManager, setUseChannelManager] = useState(null);
  const [channelManagerName, setChannelManagerName] = useState('');
  const [pricing, setPricing] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [locality, setLocality] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = () => {
      if (window.google && mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 },
          zoom: 12,
        });
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY`;
      script.onload = loadMap;
      document.head.appendChild(script);
    } else {
      loadMap();
    }
  }, []);

  const InputField = ({ label, value, onChange, placeholder }) => (
    <div className='flex flex-col grow shrink-0 basis-0 w-fit'>
      <label htmlFor={label} className='font-medium text-zinc-700'>
        {label}
      </label>
      <input
        type='text'
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className='gap-10 self-stretch px-4 py-3 mt-1.5 w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 min-h-[45px]'
      />
    </div>
  );

  const amenitiesList = [
    {
      id: 'outdoor-pool',
      name: 'Outdoor pool',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/57163b5e6628b528208634dd7d92a44e59bfc69d7a01991038e5f3cfd0195cd4?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'indoor-pool',
      name: 'Indoor pool',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/7960a2790ccb6441622752e20fa89a89e46336763b35a0d78f4259e612373fac?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'spa',
      name: 'Spa and wellness center',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/92ba2a714860639a77ae120af6a7862527ad4e5bf92d6a1752420a318cbccdb6?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'restaurant',
      name: 'Restaurant',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/2072091e43bffe77f97fa8b72642558324f457a272e59595caf9ac70bcc1bfa3?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'room-service',
      name: 'Room service',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/c87a6635a4bbd4f616119980e191de0483f52f106ef9e3d2a204747115c53973?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'fitness-center',
      name: 'Fitness center',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/02d930d62aa26f923cb32ecca945c95322ef8cb083fe6032eeac15c6d63171df?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'bar-lounge',
      name: 'Bar/Lounge',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/30c7062039d4c17442339613c617b13af0d0ba1354d67e909e5612440843bca2?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'free-wifi',
      name: 'Free Wi-Fi',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/177a8f03211f43fe47d202f7a775f7a449dc710a227ba5e6c445bc9c026d0955?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
    {
      id: 'coffee-machine',
      name: 'Tea/coffee machine',
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/8469a235bec7fcb20b200e3cffa540b0db571d0bf3dd85bef201ccc22b13102f?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
    },
  ];

  const handlePrevious = () => {
    console.log('Go to Previous');
  };

  const handleSaveAndContinue = () => {
    console.log('Save & Continue');
  };

  const toggleAmenity = (id) => {
    setSelectedAmenities((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const renderAmenityItem = (amenity) => (
    <div key={amenity.id} className='flex gap-2 mt-6'>
      <input
        type='checkbox'
        id={amenity.id}
        checked={selectedAmenities.includes(amenity.id)}
        onChange={() => toggleAmenity(amenity.id)}
        className='flex shrink-0 self-start w-5 h-5 rounded-md border border-gray-600 border-solid'
      />
      <img
        loading='lazy'
        src={amenity.icon}
        className='object-contain shrink-0 w-6 aspect-square'
        alt=''
      />
      <label htmlFor={amenity.id} className='basis-auto'>
        {amenity.name}
      </label>
    </div>
  );

  return (
    <>
      <div className='flex flex-col rounded-lg'>
        <div className='flex overflow-hidden flex-col items-start pt-5 pr-16 pb-12 pl-7 w-full bg-white rounded-lg max-md:px-5 max-md:max-w-full'>
          <h2 className='text-xl font-medium text-zinc-700'>
            General Information
          </h2>
          <div className='self-stretch mt-5 max-md:max-w-full'>
            <div className='flex gap-5 max-md:flex-col'>
              <div className='flex flex-col w-6/12 max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col items-start w-full text-sm max-md:mt-7 max-md:max-w-full'>
                  <div className='flex flex-col self-stretch w-full max-md:max-w-full'>
                    <label
                      htmlFor='propertyName'
                      className='font-medium text-zinc-700'
                    >
                      Property Name*
                    </label>
                    <input
                      id='propertyName'
                      type='text'
                      value={propertyName}
                      onChange={(e) => setPropertyName(e.target.value)}
                      className='gap-10 self-stretch px-4 py-3 mt-1.5 max-w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 min-h-[45px] w-[504px]'
                      placeholder='Enter property name'
                    />
                  </div>
                  <div className='flex gap-7 self-stretch mt-6'>
                    <div className='flex flex-col flex-1'>
                      <label
                        htmlFor='starRating'
                        className='font-medium text-zinc-700'
                      >
                        Hotel Star Rating*
                      </label>
                      <select
                        id='starRating'
                        value={starRating}
                        onChange={(e) => setStarRating(e.target.value)}
                        className='flex gap-5 justify-between px-5 py-3 mt-1.5 max-w-full text-gray-500 bg-white rounded-md border border-solid border-zinc-300 w-[221px]'
                      >
                        <option value=''>Select rating</option>
                        <option value='1'>1 Star</option>
                        <option value='2'>2 Star</option>
                        <option value='3'>3 Star</option>
                        <option value='4'>4 Star</option>
                        <option value='5'>5 Star</option>
                      </select>
                    </div>
                    <div className='flex flex-col flex-1'>
                      <label
                        htmlFor='bookingSince'
                        className='font-medium text-zinc-700'
                      >
                        Taking booking since year
                      </label>
                      <input
                        id='bookingSince'
                        type='number'
                        value={bookingSince}
                        onChange={(e) => setBookingSince(e.target.value)}
                        className='flex gap-5 justify-between px-5 py-3 mt-1.5 max-w-full text-gray-500 whitespace-nowrap bg-white rounded-md border border-solid border-zinc-300 w-[221px]'
                        placeholder='Enter year'
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col ml-5 w-6/12 max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col items-start w-full text-sm max-md:mt-7 max-md:max-w-full'>
                  <div className='mt-7 font-medium text-zinc-700'>
                    Do you work with channel manager?
                  </div>
                  <div className='flex gap-3.5 mt-3.5 font-medium whitespace-nowrap text-zinc-700'>
                    <label className='flex gap-2 px-5 py-2.5 bg-white rounded-md border border-solid border-zinc-300'>
                      <input
                        type='radio'
                        name='channelManager'
                        value='yes'
                        checked={useChannelManager === true}
                        onChange={() => setUseChannelManager(true)}
                        className='flex shrink-0 my-auto rounded-full border border-solid border-zinc-700 h-[13px] w-[13px]'
                      />
                      <span>Yes</span>
                    </label>
                    <label className='flex gap-2 px-5 py-2.5 bg-white rounded-md border border-solid border-zinc-300'>
                      <input
                        type='radio'
                        name='channelManager'
                        value='no'
                        checked={useChannelManager === false}
                        onChange={() => setUseChannelManager(false)}
                        className='flex shrink-0 my-auto rounded-full border border-solid border-zinc-700 h-[13px] w-[13px]'
                      />
                      <span>No</span>
                    </label>
                  </div>
                  {useChannelManager && (
                    <div className='mt-7 w-full'>
                      <label
                        htmlFor='channelManagerName'
                        className='font-medium text-zinc-700'
                      >
                        Enter Name of channel Manager
                      </label>
                      <input
                        id='channelManagerName'
                        type='text'
                        value={channelManagerName}
                        onChange={(e) => setChannelManagerName(e.target.value)}
                        className='flex gap-5 justify-between px-4 py-3 mt-3 max-w-full text-gray-500 whitespace-nowrap bg-white rounded-md border border-solid border-zinc-300 w-[319px]'
                        placeholder='Select or enter name'
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className='mt-6 text-sm font-medium text-neutral-400'>
            Pricing{' '}
            <span className='text-xs leading-5 text-neutral-400'>
              (Including all taxes)*
            </span>
          </div>
          <input
            type='number'
            value={pricing}
            onChange={(e) => setPricing(e.target.value)}
            className='px-4 py-3 mt-3.5 max-w-full text-sm font-medium whitespace-nowrap bg-white rounded-md border border-solid border-zinc-300 text-zinc-700 w-[221px] max-md:pr-5'
            placeholder='Enter price'
          />
          <div className='mt-7 text-sm font-medium text-zinc-700'>
            Description
          </div>
          <div className='flex flex-col self-stretch px-5 py-3.5 mt-1.5 text-gray-500 bg-white rounded-md border border-solid border-zinc-300 max-md:px-5 max-md:mr-2.5 max-md:max-w-full'>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className='text-sm leading-6 max-md:mr-2.5 max-md:max-w-full resize-none h-40'
              placeholder='Enter hotel description'
            />
            <div className='self-end mt-5 text-xs text-right'>
              {description.length}/5000
            </div>
          </div>
          <div className='mt-10 text-xl font-medium text-zinc-700'>
            Select Hotel Amenities
          </div>
          <div className='text-sm text-gray-500'>
            Update 4 to 5 amenities offered at your property.
          </div>
          <div className='mt-7 w-full max-w-[957px] max-md:max-w-full'>
            <div className='flex gap-5 max-md:flex-col'>
              <div className='flex flex-col w-[33%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col items-start w-full text-base font-medium text-zinc-700 max-md:mt-10'>
                  {amenitiesList.slice(0, 3).map(renderAmenityItem)}
                </div>
              </div>
              <div className='flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col items-start w-full text-base font-medium text-zinc-700 max-md:mt-10'>
                  {amenitiesList.slice(3, 6).map(renderAmenityItem)}
                </div>
              </div>
              <div className='flex flex-col ml-5 w-[33%] max-md:ml-0 max-md:w-full'>
                <div className='flex flex-col items-start w-full text-base font-medium text-zinc-700 max-md:mt-10'>
                  {amenitiesList.slice(6, 9).map(renderAmenityItem)}
                  <div className='mt-6 ml-9 text-orange-600 max-md:ml-2.5'>
                    +12 more
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className='flex flex-col rounded-none'>
          <div className='flex flex-col px-7 pt-4 pb-14 w-full bg-white rounded-lg max-md:px-5 max-md:max-w-full'>
            <div className='max-md:max-w-full'>
              <div className='flex gap-5 max-md:flex-col'>
                <div className='flex flex-col w-[62%] max-md:ml-0 max-md:w-full'>
                  <div className='flex flex-col items-start w-full text-sm max-md:mt-8 max-md:max-w-full'>
                    <div className='text-xl font-medium text-zinc-700'>
                      Enter Property Location
                    </div>
                    <InputField
                      label='Address'
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder='Enter Address'
                    />
                    <div className='flex flex-wrap gap-7 self-stretch mt-6'>
                      <InputField
                        label='City*'
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder='Enter City'
                      />
                      <InputField
                        label='Locality*'
                        value={locality}
                        onChange={(e) => setLocality(e.target.value)}
                        placeholder='Enter Locality'
                      />
                    </div>
                    <div className='flex flex-wrap gap-7 mt-6'>
                      <InputField
                        label='Landmark*'
                        value={landmark}
                        onChange={(e) => setLandmark(e.target.value)}
                        placeholder='Enter Landmark'
                      />
                      <InputField
                        label='Pincode*'
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder='Enter Pincode'
                      />
                    </div>
                  </div>
                </div>
                <div className='flex flex-col ml-5 w-[38%] max-md:ml-0 max-md:w-full'>
                  <div
                    ref={mapRef}
                    className='grow mt-14 w-full rounded-xl aspect-[1.34] max-md:mt-10'
                    style={{ height: '300px' }}
                  />
                </div>
              </div>
            </div>
            <div className='flex gap-3 self-start text-base leading-loose text-zinc-700'>
              <input
                type='checkbox'
                id='termsAgreement'
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
                className='w-[23px] h-[23px] cursor-pointer'
              />
              <label
                htmlFor='termsAgreement'
                className='flex-auto cursor-pointer'
              >
                I agree to all the <span className='text-blue-500'>Terms</span>{' '}
                and <span className='text-blue-500'>Privacy Policies</span>
              </label>
            </div>
          </div>
        </div>
      </div>

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

export default AddNewHotel;
