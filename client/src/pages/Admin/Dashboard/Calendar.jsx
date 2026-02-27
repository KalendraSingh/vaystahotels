import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedStartDate, setSelectedStartDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const clickedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    if (!selectedStartDate || (selectedStartDate && selectedEndDate)) {
      setSelectedStartDate(clickedDate);
      setSelectedEndDate(null);
    } else if (clickedDate > selectedStartDate) {
      setSelectedEndDate(clickedDate);
    } else {
      setSelectedEndDate(selectedStartDate);
      setSelectedStartDate(clickedDate);
    }
  };

  const isDateInRange = (day) => {
    if (!selectedStartDate || !selectedEndDate) return false;
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    return date >= selectedStartDate && date <= selectedEndDate;
  };

  const renderCalendarDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className='p-2'></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay =
        day === today.getDate() &&
        currentDate.getMonth() === today.getMonth() &&
        currentDate.getFullYear() === today.getFullYear();

      const isSelected =
        (selectedStartDate &&
          day === selectedStartDate.getDate() &&
          currentDate.getMonth() === selectedStartDate.getMonth() &&
          currentDate.getFullYear() === selectedStartDate.getFullYear()) ||
        (selectedEndDate &&
          day === selectedEndDate.getDate() &&
          currentDate.getMonth() === selectedEndDate.getMonth() &&
          currentDate.getFullYear() === selectedEndDate.getFullYear());

      const isInRange = isDateInRange(day);

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`p-2 rounded-full w-10 h-10 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isCurrentDay
              ? 'bg-color text-white'
              : isSelected
              ? 'bg-orange-300'
              : isInRange
              ? 'bg-gray-400 text-white'
              : 'hover:bg-gray-200'
          }`}
          aria-label={`Select ${day} ${
            monthNames[currentDate.getMonth()]
          } ${currentDate.getFullYear()}`}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className=' bg-white rounded-lg overflow-hidden w-full'>
      <div className='flex items-center justify-between px-4 py-2 bg-gray-100'>
        <button
          onClick={handlePrevMonth}
          className='text-gray-600 hover:text-gray-800 focus:outline-none'
          aria-label='Previous month'
        >
          <FaChevronLeft />
        </button>
        <h2 className='text-lg font-semibold text-gray-800'>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={handleNextMonth}
          className='text-gray-600 hover:text-gray-800 focus:outline-none'
          aria-label='Next month'
        >
          <FaChevronRight />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-1 p-4'>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div
            key={day}
            className='text-center text-sm font-medium text-gray-700'
          >
            {day}
          </div>
        ))}
        {renderCalendarDays()}
      </div>
    </div>
  );
};

export default Calendar;
