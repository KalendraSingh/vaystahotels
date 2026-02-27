import React from 'react';
import { FaArrowLeft } from 'react-icons/fa6';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  CheckCircle,
  Printer,
  Share2,
  MapPin,
  Mail,
  Globe,
  Phone,
} from 'lucide-react';
import DataLoading from '../../../components/DataLoading/DataLoading';

import { useEffect, useRef, useState } from 'react';

import { getBookingById } from '../../../../api/Customer/bookingApi';

function BookingDetails() {
  const componentRef = useRef();
  const [bookingData, setBookingData] = useState(null);

  const { id } = useParams();
  console.log('id====>', id);
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1); // Navigates back to the previous page
  };

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const response = await getBookingById(id);
        if (response.status === 200) {
          setBookingData(response.data);
        }
      } catch (error) {
        console.error('Error fetching booking data:', error);
      }
    };
    if (id) {
      fetchBookingData();
    }
  }, [id]);

  if (!bookingData) {
    return <DataLoading />;
  }

  const {
    customerId,
    adultCount,
    roomCount,
    checkIn,
    checkOut,
    roomDetails,
    payment: [
      { amount, gstAmount, discountAmount, due_amount, paid_amount } = {},
    ] = [],
    Hotel: {
      name: hotelName,
      city,
      state,
      country,
      phone: phoneNo,
      email: coEmail,
      location,
      website,
      description: hotelDescription,
      bannerImage,
    } = {},
    customer: { name: customerName, email, phone } = {},
  } = bookingData || {};

  const categoryNames =
    roomDetails && roomDetails.map((room) => room.categoryName).join(', ');

  return (
    <main className='rounded-none '>
      <button onClick={handleGoBack}>
        <FaArrowLeft />
      </button>

      <div className='flex gap-5 max-md:flex-col'>
        <section className='flex flex-col w-[66%] max-md:ml-0 max-md:w-full'>
          <div className='flex flex-col px-10 py-8 mx-auto w-full rounded-xl border border-solid bg-stone-50 border-zinc-300 max-md:px-5 max-md:mt-8 max-md:max-w-full'>
            <h1 className='mr-7 text-2xl font-medium capitalize text-zinc-700 max-md:mr-2.5 max-md:max-w-full'>
              {categoryNames}
            </h1>
            <div className='self-start mt-2 text-base font-medium text-zinc-700'>
              {location}
            </div>
            <div className='self-start mt-1.5 text-base font-medium text-zinc-700'>
              Booking ID:{bookingData && bookingData.id}
            </div>
            <div className='flex flex-wrap gap-7 self-start mt-7 text-zinc-700'>
              <div className='flex flex-col'>
                <div className='self-start text-sm leading-6'>Check-In</div>
                <div className='text-base font-medium'>
                  {checkIn.slice(0, 10)} ,12:00PM
                </div>
              </div>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/a641a6a3efdbf392676b1d382620cf88395186573bad550e3c4ecae5e855aade?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto w-px aspect-[0.03]'
              />
              <div className='flex flex-col'>
                <div className='self-start text-sm leading-6'>Check-Out</div>
                <div className='text-base font-medium'>
                  {checkOut.slice(0, 10)} ,11:00AM
                </div>
              </div>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/e7cdab3bc8682c0262d1bfbe46d386ebe47daaa573c0e9086e7f88f9858edffb?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto w-px aspect-[0.03]'
              />
              <div className='flex flex-col'>
                <div className='text-sm leading-6'>No. of Guest</div>
                <div className='self-start text-base font-medium'>
                  {adultCount} Guest
                </div>
              </div>
            </div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/9aab0227874ddd8ba80ab54aa46399958327bc963b06fd8652da0f14f434407d?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
              alt='Hotel room'
              className='object-contain mt-5 w-full aspect-[500] max-md:max-w-full'
            />
            <h2 className='self-start mt-6 text-base font-medium text-zinc-700'>
              Primary Guest Information
            </h2>
            <div className='flex gap-5 justify-between mt-3 max-w-full text-zinc-700 w-[379px]'>
              <div className='flex flex-col'>
                <div className='self-start text-sm leading-6'>Name</div>
                <div className='mt-1.5 text-base font-medium'>
                  {customerName}
                </div>
              </div>
              <div className='flex flex-col'>
                <div className='self-start text-sm leading-6'>Mobile No.</div>
                <div className='mt-1.5 text-base font-medium'>+91 {phone}</div>
              </div>
            </div>
            <div className='self-start mt-5 text-sm leading-6 text-zinc-700'>
              Email Address
            </div>
            <div className='self-start text-base font-medium text-zinc-700'>
              {email}
            </div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/6dfc101e134a082f2615e4483c1a8ded793db437143c2b62b4b436cc28f4ed54?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
              alt=''
              className='object-contain mt-5 w-full aspect-[500] max-md:max-w-full'
            />
            <div className='flex flex-wrap gap-5 justify-between mt-5 text-sm leading-loose text-zinc-700 max-md:mr-1 max-md:max-w-full'>
              <div className='flex flex-col items-start'>
                <h3 className='text-base font-medium'>Booking Fare Breakup</h3>
                <div className='mt-3.5'>Booking Price</div>
                <div className='self-stretch mt-5'>Discount</div>
              </div>
              <div className='flex flex-col self-end mt-9 text-right whitespace-nowrap'>
                <div>₹ {amount}</div>
                <div className='mt-5'>-₹ {discountAmount}</div>
              </div>
            </div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/3a129e21a53b3fe85054ccf3e848d0d80965c8e0798fe10ddd1275817d079290?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
              alt=''
              className='object-contain mt-6 w-full aspect-[500] max-md:max-w-full'
            />
            <div className='flex flex-wrap gap-5 justify-between mt-6 text-zinc-700 max-md:mr-1 max-md:max-w-full'>
              <div className='flex flex-col items-start text-sm leading-loose'>
                <h3 className='self-stretch text-base font-medium'>
                  Discounted Price
                </h3>

                <div className='mt-6'>GST</div>
                <div className='mt-5'>Over Fee At hotel</div>
              </div>
              <div className='flex flex-col text-right whitespace-nowrap'>
                <div className='text-base font-medium'>
                  ₹ {amount - discountAmount}
                </div>
                <div className='flex flex-col items-start pl-2.5 mt-5 text-sm leading-loose'>
                  <div>₹ {gstAmount}</div>
                  <div className='mt-6'>₹ {'00'}</div>
                </div>
              </div>
            </div>
            <img
              loading='lazy'
              src='https://cdn.builder.io/api/v1/image/assets/TEMP/5c5fde3b1496711fe013fd236a16ba7c4713afdb2bf59e41df89a401e4d332ec?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
              alt=''
              className='object-contain mt-7 w-full aspect-[500] max-md:mr-1.5 max-md:max-w-full'
            />
            <div className='flex justify-between'>
              <div className='text-blue-500'>Total Payable</div>
              <div className='text-blue-500'>{paid_amount || due_amount}</div>
            </div>
          </div>
        </section>
        <aside className='flex flex-col ml-5 w-[34%] max-md:ml-0 max-md:w-full'>
          <div className='flex flex-col items-start mt-1.5 w-full max-md:mt-9'>
            <img
              loading='lazy'
              src={bannerImage}
              alt='Mardan Palace, Turkey'
              className='object-contain self-stretch w-full rounded-md aspect-[1.53]'
            />
            <h2 className='mt-6 text-2xl font-medium capitalize text-zinc-700'>
              {hotelName}
            </h2>

            <div className='flex gap-4 mt-6 text-sm leading-6 text-zinc-700'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/0f9db5b11da2f20fd110925279bfb3b7f1560cf25f3a9995fc5948751e281b2e?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto aspect-[0.86] w-[18px]'
              />
              <div className='basis-auto'>{location}</div>
            </div>
            <div className='flex gap-4 mt-4 text-sm leading-6 whitespace-nowrap text-zinc-700'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/046549a3645ef0bb9bec7c79e01c6a3f6582073d288a9e26c2a3e02729cb8432?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto aspect-[1.29] w-[18px]'
              />
              <div className='basis-auto'>{coEmail}</div>
            </div>
            <div className='flex gap-4 mt-4 text-sm leading-6 whitespace-nowrap text-zinc-700'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/bff53d5926a02602dc28ca7c4c5f4396193f34e18b557bb11bd242a1868ee580?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto aspect-square w-[18px]'
              />
              <div>{website}</div>
            </div>
            <div className='flex gap-4 mt-4 text-sm leading-6 text-zinc-700'>
              <img
                loading='lazy'
                src='https://cdn.builder.io/api/v1/image/assets/TEMP/c81c3005e0c18cc1698f13b4cae6f8b852020f891255a038a911af0aead62dd2?placeholderIfAbsent=true&apiKey=6fce45e9d0874fb8af3b7bbaed948d5d'
                alt=''
                className='object-contain shrink-0 my-auto w-4 aspect-square'
              />
              <div className='basis-auto'>+91 {phoneNo}</div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

export default BookingDetails;
