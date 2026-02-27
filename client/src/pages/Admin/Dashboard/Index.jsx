import React, { useState, useContext, useEffect } from 'react';
import Navbar from './Navbar';
import MainContent from './MainContent';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { HeaderFooterContext } from '../../../Context/HeaderFooter';

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNav, setActiveNav] = useState('Dashboard');
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);
  const handleNavClick = (nav) => setActiveNav(nav);

  const { setIsHeader, setIsFooter } = useContext(HeaderFooterContext);
  useEffect(() => {
    setIsFooter(false);
    setIsHeader(false);
    return () => {
      setIsFooter(true);
      setIsHeader(true);
    };
  }, []);

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
      <div className='flex flex-col flex-1 h-[100vh]'>
        <Navbar toggleSidebar={toggleSidebar} />
        <div className='px-4 py-4 overflow-x-hidden z-0'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
