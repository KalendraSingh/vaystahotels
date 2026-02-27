import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogIn, LogOut } from 'lucide-react';
import { userLogout } from '../../../../api/Customer/AuthApi';
import { useAuth } from '../../../Hooks/useAuth';
import Drawer from '@mui/material/Drawer';
import { createTheme, Divider, ListItem, ThemeProvider } from '@mui/material';
const Navigation = () => {
  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Hotels', path: '/hotels' },
    // { name: 'Special Offers', path: '/special-offers' },
    { name: 'About us', path: '/about' },
    { name: 'Contact us', path: '/contact' },
  ];

  const { auth, setAuth } = useAuth();
  const user = auth.data && auth.data.name;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isOn, setIsOn] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();

  const handleTogle = () => {
    setIsOn(!isOn);
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogOut = async () => {
    const res = await userLogout();
    if (res.status === 200) {
      setAuth(null);
      setIsOn(!isOn);
      setIsDropdownOpen(!isDropdownOpen);
      navigate('/');
    }
  };

  const drawerRef = useRef(null); // Reference for drawer

  // Handle click outside dropdown or drawer
  const handleClickOutside = (event) => {
    // Close only if click is outside both the dropdown and drawer
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target) &&
      drawerRef.current &&
      !drawerRef.current.contains(event.target)
    ) {
      setIsDropdownOpen(false);
      setIsOn(false);
    }
  };

  useEffect(() => {
    // Add event listener to detect clicks outside
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup event listener on unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <ThemeProvider theme={theme}>
        <Drawer
          ref={drawerRef}
          open={isDropdownOpen}
          onClose={handleTogle}
          anchor='left'
          variant='temporary'
          sx={{
            display: {
              xs: 'block',
              sm: 'block',
              md: 'block',
              lg: 'none',
              xl: 'none',
            },
          }}
          ModalProps={{
            keepMounted: true,
          }}
        >
          <div className='flex justify-end px-5 py-5'>
            <button
              onClick={() => {
                setIsDropdownOpen(false);
                setIsOn(false);
              }}
              className='border border-gray-300 rounded-full p-1'
            >
              <X size={24} className='text-orange-600 text-xl' />
            </button>
          </div>
          <div className='flex flex-col gap-5 p-10 px-1/3'>
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`relative flex flex-col cursor-pointer ${
                  index === activeIndex ? 'text-orange-600' : 'text-neutral-800'
                }`}
                onClick={() => {
                  setIsDropdownOpen(false);
                  setActiveIndex(index);
                  setIsOn(false);
                }}
              >
                <div className='transition-colors text-2xl uppercase duration-300 hover:text-orange-600'>
                  {item.name}
                </div>
                <div
                  className={`absolute left-0 right-0 bottom-[-8px] h-0.5 bg-orange-600 transition-all duration-300 ${
                    index === activeIndex ? 'w-full' : 'w-0'
                  } group-hover:w-full`}
                ></div>
              </Link>
            ))}
            <Link
              to='/Customer-Profile'
              onClick={() => {
                setIsDropdownOpen(false);
              }}
              className={`relative flex flex-col cursor-pointer text-neutral-800`}
            >
              <div className='transition-colors text-2xl uppercase duration-300 hover:text-orange-600'>
                Profile
              </div>
            </Link>

            {!user && (
              <Link
                to='/login'
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
                className={`relative flex flex-col cursor-pointer text-neutral-800`}
              >
                <div className='transition-colors text-2xl uppercase duration-300 hover:text-orange-600'>
                  Login
                </div>
              </Link>
            )}
            {user && (
              <Link
                to='/login'
                onClick={() => {
                  setIsDropdownOpen(false);
                  handleLogOut();
                }}
                className={`relative flex flex-col cursor-pointer text-neutral-800`}
              >
                <div className='transition-colors text-2xl uppercase duration-300 hover:text-orange-600'>
                  Logout
                </div>
              </Link>
            )}

            <Divider />
            <div className='self-stretch uppercase my-auto text-base leading-none text-right text-orange-600 basis-auto'>
              <Link onClick={handleTogle} to='/vendor-signup'>
                List your property
              </Link>
            </div>
          </div>
        </Drawer>
      </ThemeProvider>
      <nav className='flex flex-wrap gap-6 items-center self-end mt-6 max-md:max-w-full'>
        <div className='hidden lg:flex flex-wrap gap-12 items-start self-stretch my-auto text-base leading-none text-right text-neutral-800 max-md:max-w-full'>
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className={`hidden md:block relative flex flex-col cursor-pointer ${
                index === activeIndex ? 'text-orange-600' : 'text-neutral-800'
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <div className='transition-colors uppercase duration-300 hover:text-orange-600'>
                {item.name}
              </div>
              <div
                className={`absolute left-0 right-0 bottom-[-8px] h-0.5 bg-orange-600 transition-all duration-300 ${
                  index === activeIndex ? 'w-full' : 'w-0'
                } group-hover:w-full`}
              ></div>
            </Link>
          ))}
        </div>

        <div className='hidden lg:block shrink-0 self-stretch my-auto w-px border border-black border-solid h-[18px]' />

        <div className='hidden lg:block self-stretch uppercase my-auto text-base leading-none text-right text-orange-600 basis-auto'>
          <Link to='/vendor-signup'>List your property</Link>
        </div>

        <div
          ref={dropdownRef}
          className='flex gap-2 relative items-center self-stretch py-1.5 pr-2 pl-4  min-h-[37px] rounded-[100px]'
        >
          <div className='flex items-center justify-center rounded-full bg-gray-100'>
            <button
              className={`flex items-center w-20 h-10 px-1 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 bg-orange-500`}
              onClick={handleTogle}
              aria-label={isOn ? 'Turn off' : 'Turn on'}
            >
              <span className='flex items-center justify-center w-8 h-8'>
                {isOn ? (
                  <X className='text-white' size={24} />
                ) : (
                  <Menu className='text-white' size={24} />
                )}
              </span>
              <span
                className={`w-8 h-8  transform transition-transform duration-300 flex items-center justify-center ${
                  isOn ? 'translate-x-0' : 'translate-x-0'
                }`}
              >
                <img
                  src='https://cdn.builder.io/api/v1/image/assets/TEMP/9b4b10049aa449aef8042472f5821965f709fc5fe0ddd1bb563137517a0f3c85?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
                  alt='Arrow icon'
                  width={26}
                  height={27}
                  className={`object-contain rounded-full w-[26px] h-[27px] transition-transform duration-300 
                  }`}
                />
              </span>
            </button>
            {isDropdownOpen && (
              <div className='mt-2 hidden lg:block w-48 absolute top-14 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 '>
                <div
                  className='py-1'
                  role='menu'
                  aria-orientation='vertical'
                  aria-labelledby='options-menu'
                >
                  {!user && (
                    <Link
                      to='/login'
                      onClick={handleTogle}
                      className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      role='menuitem'
                    >
                      <User className='mr-3 h-5 w-5 text-gray-400' />
                      Login
                    </Link>
                  )}
                  {user && (
                    <>
                      <Link
                        to='/customer-profile'
                        onClick={handleTogle}
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        role='menuitem'
                      >
                        <User className='mr-3 h-5 w-5 text-gray-400' />
                        Profile
                      </Link>
                      <Link
                        onClick={handleLogOut}
                        className='flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                        role='menuitem'
                      >
                        <LogOut className='mr-3 h-5 w-5 text-gray-400' />
                        Logout
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
});

export default Navigation;
