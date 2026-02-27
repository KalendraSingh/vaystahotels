import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import VenderHeader from '../Home/VenderHeader';
import { getAllCities } from '../../../api/Public/HotelApi';

const AllCities = () => {
  const [cityData, setCityData] = useState(null);
  const fetchAllCities = async () => {
    const res = await getAllCities();
    if (res.status === 200 && res.data.length > 0) {
      setCityData(res.data);
    }
  };
  useEffect(() => {
    fetchAllCities();
  }, []);
  return (
    <>
    <VenderHeader />
   
    <section className='flex flex-col mt-14 w-full  px-4 max-md:mt-10 max-md:max-w-full overflow-hidden'>
      <div className='flex max-w-[1250px] mx-auto flex-wrap gap-5 justify-between items-start w-full max-md:max-w-full'>
        <div className='flex flex-col mt-1.5 text-zinc-700'>
          <h2 className='self-start text-2xl font-semibold'>
            Explore Our Most Popular Cities
          </h2>
          <p className='mt-2.5 text-sm max-md:max-w-full'>
            Discover and book stays in our top destinations
          </p>
        </div>
        <div className='py-6 '>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
            {cityData &&
              cityData.map((city, index) => (
                <Link to={`/hotels-in/${city.city}`}>
                  <div
                    key={index}
                    className='flex gap-4 items-center  p-2 bg-white rounded-xl shadow-lg h-[120px] md:h-[150px]'
                  >
                    <div className='flex flex-col'>
                      <img
                        loading='lazy'
                        src={city.cityImage}
                        alt={city.name}
                        className=' rounded  w-[100px] h-[100px] md:h-[120px] md:w-[140px] '
                      />
                    </div>
                    <div className='flex flex-col'>
                      <div className='text-base font-medium text-neutral-800'>
                        {city.city}
                      </div>
                      <div className='flex gap-2 items-start mt-2 w-full text-sm whitespace-nowrap text-neutral-800'>
                        <div>{city.state}</div>
                        <div className='font-medium text-black'>•</div>
                        <div>{city.country}</div>
                        <br />
                      </div>
                      <div>Avg Price ₹ {city.cityAvgPrice}</div>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </section>
     </>
  );
};

export default AllCities;
