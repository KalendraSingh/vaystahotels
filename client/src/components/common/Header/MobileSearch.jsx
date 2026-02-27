import React, { useState, useEffect, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import { MdLocationOn } from 'react-icons/md';
import { notification } from 'antd';
import { getAllCities, getAllHotels } from '../../../../api/Public/HotelApi'; // Update here
import { useSelector, useDispatch } from 'react-redux';
import { setSearchDetails } from '../../../Features/Search/SearchSlice';
import { useLocation, useNavigate } from 'react-router-dom';

const MobileSearchForm = ({ top, id, shadow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [guests, setGuests] = useState(1);
  const [location, setLocation] = useState(null);
  const [cities, setCities] = useState([]);
  const [filteredCities, setFilteredCities] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const dropdownRef = useRef(null);

  const path = useLocation();

  // Set default startDate (current date) and endDate (next day)
  // const [startDate, setStartDate] = useState(new Date());
  // const [endDate, setEndDate] = useState(() => {
  //   const nextDay = new Date();
  //   nextDay.setDate(nextDay.getDate() + 1);
  //   return nextDay;
  // });

  const selector = useSelector((state) => state.searchDetailes);

  const [startDate, setStartDate] = useState(
    selector.startDate ? new Date(selector.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    selector.endDate
      ? new Date(selector.endDate)
      : new Date(new Date().getTime() + 24 * 60 * 60 * 1000)
  );

  useEffect(() => {
    setGuests(selector.guestCount);
  }, [selector.guestCount]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCities = async () => {
      const res = await getAllCities();
      if (res.status === 200) {
        setCities(res.data);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const filtered =
      cities &&
      cities
        .filter((cityItem) =>
          cityItem.city.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .map((cityItem) => cityItem.city);
    setFilteredCities(filtered);
  }, [searchTerm, cities]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleCitySelect = (city) => {
    setSearchTerm(city);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const validateForm = () => {
    if (!searchTerm.trim()) {
      notification.error({ message: 'Please enter a valid destination' });
      return false;
    }
    if (!startDate) {
      notification.error({ message: 'Please select a check-in date' });
      return false;
    }
    if (!endDate) {
      notification.error({ message: 'Please select a check-out date' });
      return false;
    }
    if (startDate && endDate && startDate >= endDate) {
      notification.error({
        message: 'Check-out date must be after check-in date',
      });
      return false;
    }
    if (guests < 1) {
      notification.error({ message: 'Number of guests must be at least 1' });
      return false;
    }

    return true;
  };

  const handleSearch = async () => {
    // if (!validateForm()) {
    //   return;
    // }

    // Update Redux store with search data
    dispatch(
      setSearchDetails({
        search: selector.search,
        startDate: format(startDate, 'yyyy-MM-dd'),
        endDate: format(endDate, 'yyyy-MM-dd'),
        guestCount: guests,
      })
    );

    // Build the search query
    const searchParams = new URLSearchParams({
      search: selector.search,
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      guests: guests,
      latitude: location?.latitude || '',
      longitude: location?.longitude || '',
    }).toString();

    // if (path.pathname === '/hotels' || path.pathname.includes('/hotels-in')) {
    //   navigate(`/hotels?${searchParams}`);
    // } else {
    //   navigate(`/hotelDetailed/${id}?${searchParams}`);
    // }
  };

  useEffect(() => {
    handleSearch();
  }, [startDate, endDate, guests]);

  return (
    <form
      className={`flex relative z-10 flex-col py-2 px-2 mb-2 w-full bg-white ${
        shadow ? '' : 'shadow-md'
      }`}
    >
      <div className='flex flex-wrap gap-9 items-start w-full max-md:flex-col'>
        {/* Destination Field */}
        <div className='flex flex-col grow shrink-0 basis-0 w-full max-md:max-w-full'>
          <div className='flex gap-5 items-center justify-around w-full px-5 py-2 text-neutral-800'>
            {/* <div className='flex flex-col'>
              <div className='relative' ref={dropdownRef}>
                {showSuggestions && filteredCities.length > 0 && (
                  <ul className='absolute top-0 min-w-60 max-w-full shadow-lg z-10 bg-white mt-1 rounded-lg overflow-y-auto'>
                    {filteredCities.map((city, index) => (
                      <div
                        onClick={() => handleCitySelect(city)}
                        className='flex items-center gap-4 px-4 py-2 hover:bg-gray-100 '
                        key={index}>
                        <MdLocationOn className='w-4 h-4 text-gray-500' />
                        <li className='cursor-pointer transition-colors duration-200'>
                          {city}
                        </li>
                      </div>
                    ))}
                  </ul>
                )}
              </div>
            </div> */}

            {/* Date Picker (Check-in and Check-out) */}
            <div className='flex gap-2.5 items-center w-2/3'>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                placeholderText='Check-in'
                className='border-b border-gray-300 focus:outline-none text-sm w-full'
                dateFormat='EEE, dd MMM'
                minDate={new Date()}
                popperPlacement='bottom-end' // You can use "bottom", "top", "right", "left", etc.
                popperModifiers={[
                  {
                    name: 'preventOverflow',
                    options: {
                      rootBoundary: 'viewport',
                      tether: false,
                    },
                  },
                ]}
              />
              <span className='mx-2'>-</span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                minDate={
                  startDate
                    ? new Date(startDate.getTime() + 24 * 60 * 60 * 1000)
                    : new Date()
                }
                placeholderText='Check-out'
                className='border-b border-gray-300 focus:outline-none text-sm w-full'
                dateFormat='EEE, dd MMM'
              />
            </div>

            {/* Guests & Rooms Selector */}
            <div className='flex gap-2.5 items-center text-sm w-1/3'>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className='w-full border-b border-gray-300 focus:outline-none '
              >
                <option value={1}>1 Guest</option>
                <option value={2}>2 Guests</option>
                <option value={3}>3 Guests</option>
                <option value={4}>4 Guests</option>
                <option value={5}>5 Guests</option>
              </select>
            </div>

            {/* Submit Button */}
          </div>
        </div>
      </div>
    </form>
  );
};

export default MobileSearchForm;
