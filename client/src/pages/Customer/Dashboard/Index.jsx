import React, { useState, useContext } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { HeaderFooterContext } from '../../../Context/HeaderFooter';
import { Outlet } from 'react-router-dom';

const CustomerDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('Profile');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleNavClick = (nav) => setActiveNav(nav);

  const { setIsHeader, setIsFooter } = useContext(HeaderFooterContext);
  setIsFooter(false);
  setIsHeader(false);

  return (
    <div className='flex  bg-gray-100'>
      <Sidebar
        sidebarOpen={sidebarOpen}
        sidebarCollapsed={sidebarCollapsed}
        activeNav={activeNav}
        toggleSidebar={toggleSidebar}
        toggleSidebarCollapse={toggleSidebarCollapse}
        handleNavClick={handleNavClick}
      />
      <div className='flex flex-col flex-1 w-screen h-[100vh]'>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className='px-4 py-4 overflow-x-hidden z-0'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
