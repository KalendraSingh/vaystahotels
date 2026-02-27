import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiRefreshCw,
  FiChevronLeft,
  FiChevronRight,
} from 'react-icons/fi';

function Student() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    course: '',
    college: '',
    grade: '',
  });
  const itemsPerPage = 10;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    // Simulating API call
    const dummyData = [
      {
        id: 1,
        name: 'John Doe',
        course: 'Computer Science',
        college: 'MIT',
        grade: 'A',
      },
      {
        id: 2,
        name: 'Jane Smith',
        course: 'Engineering',
        college: 'Stanford',
        grade: 'B+',
      },
      {
        id: 3,
        name: 'Bob Johnson',
        course: 'Mathematics',
        college: 'Harvard',
        grade: 'A-',
      },
      // ... more dummy data
    ];
    setData(dummyData);
  };

  const filteredData = data.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.college.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filters.course === '' || item.course === filters.course) &&
      (filters.college === '' || item.college === filters.college) &&
      (filters.grade === '' || item.grade === filters.grade)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  return (
    <>
      <div className='bg-white rounded-lg shadow-md p-6'>
        <div className='flex flex-col sm:flex-row justify-between items-center mb-4'>
          <h2 className='text-2xl font-semibold mb-2 sm:mb-0'>
            Student Records
          </h2>
          <div className='flex items-center'>
            <div className='relative mr-4'>
              <input
                type='text'
                placeholder='Search...'
                className='pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
            </div>
            <button
              onClick={fetchData}
              className='flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            >
              <FiRefreshCw className='mr-2' />
              Refresh
            </button>
          </div>
        </div>
        <div className='mb-4 flex flex-wrap gap-4'>
          <select
            className='border rounded-md px-3 py-2'
            value={filters.course}
            onChange={(e) => handleFilterChange('course', e.target.value)}
          >
            <option value=''>All Courses</option>
            <option value='Computer Science'>Computer Science</option>
            <option value='Engineering'>Engineering</option>
            <option value='Mathematics'>Mathematics</option>
          </select>
          <select
            className='border rounded-md px-3 py-2'
            value={filters.college}
            onChange={(e) => handleFilterChange('college', e.target.value)}
          >
            <option value=''>All Colleges</option>
            <option value='MIT'>MIT</option>
            <option value='Stanford'>Stanford</option>
            <option value='Harvard'>Harvard</option>
          </select>
          <select
            className='border rounded-md px-3 py-2'
            value={filters.grade}
            onChange={(e) => handleFilterChange('grade', e.target.value)}
          >
            <option value=''>All Grades</option>
            <option value='A'>A</option>
            <option value='B+'>B+</option>
            <option value='A-'>A-</option>
          </select>
        </div>
        <div className='overflow-x-auto'>
          <table className='w-full table-auto'>
            <thead>
              <tr className='bg-gray-100'>
                <th className='px-4 py-2 text-left'>Name</th>
                <th className='px-4 py-2 text-left'>Course</th>
                <th className='px-4 py-2 text-left'>College</th>
                <th className='px-4 py-2 text-left'>Grade</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className='border-b hover:bg-gray-50'>
                  <td className='px-4 py-2'>{item.name}</td>
                  <td className='px-4 py-2'>{item.course}</td>
                  <td className='px-4 py-2'>{item.college}</td>
                  <td className='px-4 py-2'>{item.grade}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className='mt-4 flex justify-between items-center'>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center px-4 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            <FiChevronLeft className='mr-2' />
            Previous
          </button>
          <span className='text-gray-600'>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center px-4 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            Next
            <FiChevronRight className='ml-2' />
          </button>
        </div>
      </div>
    </>
  );
}

export default Student;
