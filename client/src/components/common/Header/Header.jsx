import React, { useState } from 'react';
import Logo from './Logo';
import Navigation from './Navigation';
import { LogOut, Menu, Settings } from 'lucide-react';
import { FaUser } from 'react-icons/fa6';

const navitems = [
  { name: 'home', label: 'Home' },
  { name: 'about', label: 'About' },
  { name: 'contact', label: 'contact' },
  { name: 'property', label: 'List Property' },
];

const Header = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  return (
    <header className='flex relative flex-col items-center w-full max-md:max-w-full'>
      <nav
        className={`fixed w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md'
            : 'bg-transparent'
        }`}
      >
        <div className='max-w-[1400px] mx-auto'>
          <div className='flex  items-center justify-between'>
            {/* Logo */}
            <div>
              <a
                href='#'
                className={` text-3xl md:text-4xl font-bold transition-colors text-[#FF5403] `}
              >
                Vaysta
              </a>
            </div>
            <div className='block md:hidden'>
              <Menu className='text-white' />
            </div>
            <div className='relative'>
              <div className='flex justify-center '>
                <img
                  src='Hero/nav.svg'
                  className='h-[70px] w-full object-cover'
                />
                <div className='absolute top-3'>
                  <div className='flex gap-8'>
                    {navitems.map((item) => (
                      <a
                        key={item.name}
                        href='#'
                        className={`relative py-2 transition-color text-black uppercase `}
                      >
                        {item.label}
                        <span
                          className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ${
                            activeNav === item.name
                              ? 'scale-x-100'
                              : 'scale-x-0'
                          } ${isScrolled ? 'bg-blue-600' : 'bg-orange-500'}`}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className='hidden md:flex items-center space-x-8'>
              <div className='relative'>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`p-2.5 rounded-full bg-gray-500 transition-all duration-300 ${
                    isScrolled
                      ? 'hover:bg-blue-50 text-gray-700 hover:text-blue-600'
                      : 'hover:bg-white/40 text-white'
                  }`}
                >
                  <FaUser className='w-7 h-7' />
                </button>

                {isProfileOpen && (
                  <div className='absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-xl py-2 border border-gray-100'>
                    <div className='px-4 py-3 border-b'>
                      <p className='font-semibold text-gray-800'>Fgroup</p>
                      <p className='text-sm text-gray-600'>
                        fgroupservicess.com
                      </p>
                    </div>
                    <a
                      href='#'
                      className='flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors'
                    >
                      <Settings className='w-4 h-4 mr-2' /> Settings
                    </a>
                    <a
                      href='#'
                      className='flex items-center px-4 py-2.5 text-gray-700 hover:bg-blue-50 transition-colors'
                    >
                      <LogOut className='w-4 h-4 mr-2' /> Logout
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
