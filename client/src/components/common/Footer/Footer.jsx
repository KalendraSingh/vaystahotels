import {
  Facebook,
  Globe,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Twitter,
  Youtube,
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className='bg-[#0f172a] text-[#f3f4f6] pt-20 pb-12 font-light tracking-wide font-sans relative z-10'>
      <div className='max-w-7xl mx-auto px-6'>
        <div className='grid grid-cols-1 md:grid-cols-5 gap-14 mb-16'>
          {/* Brand */}
          <div className='md:col-span-2'>
            <div className='flex items-center mb-6'>
              <Link
                to='/'
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <img
                  src='/vaystaF.png'
                  alt='Vaysta Logo'
                  className='w-24 h-24 object-contain mr-4'
                />
              </Link>
              {/* <h2 className="text-3xl font-bold text-[#d4af37] tracking-widest font-[Playfair Display]">
                VAYSTA
              </h2> */}
            </div>
            <p className='text-sm leading-relaxed mb-6 text-[#cbd5e1]'>
              Vaysta Hotels brings you timeless luxury at India’s sacred and
              cultural hotspots.
            </p>
            <div className='flex space-x-5'>
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <Icon
                  key={idx}
                  className='w-6 h-6 text-[#cbd5e1] hover:text-[#d4af37] transition duration-300 cursor-pointer'
                />
              ))}
            </div>
          </div>

          {/* Offerings */}
          <div>
            <h3 className='text-sm font-semibold text-[#d4af37] uppercase mb-5 tracking-widest'>
              Offerings
            </h3>
            <ul className='space-y-3 text-sm text-[#cbd5e1]'>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Luxury Stays
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Group Booking
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Special Packages
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Custom Plans
                </a>
              </li>
            </ul>
          </div>

          {/* Destinations */}
          <div>
            <h3 className='text-sm font-semibold text-[#d4af37] uppercase mb-5 tracking-widest'>
              Destinations
            </h3>
            <ul className='space-y-3 text-sm text-[#cbd5e1]'>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Ayodhya
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Lucknow
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Varanasi
                </a>
              </li>
              <li>
                <a href='#' className='hover:text-[#d4af37] transition'>
                  Vrindavan
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className='text-sm font-semibold text-[#d4af37] uppercase mb-5 tracking-widest'>
              Contact
            </h3>
            <ul className='space-y-4 text-sm text-[#cbd5e1]'>
              <li className='flex items-start'>
                <span>
                  <MapPin className='w-4 h-4 mr-2 text-[#d4af37]' />
                </span>
                Jalwanpura Raiganj , Ayodhya, Uttar Pradesh - 224123
              </li>
              <li className='flex items-start'>
                <Phone className='w-4 h-4 mr-2 text-[#d4af37]' />
                +91 6307200050
              </li>
              <li className='flex items-start'>
                <Mail className='w-4 h-4 mr-2 text-[#d4af37]' />
                vaysta.contact@gmail.com
              </li>
              <li className='flex items-start'>
                <Globe className='w-4 h-4 mr-2 text-[#d4af37]' />
                www.vaystahotels.com
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className='border-t border-gray-700 pt-10 pb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 items-center'>
            <div>
              <h4 className='text-[#f3f4f6] text-lg font-semibold mb-2 tracking-wide'>
                Stay Updated
              </h4>
              <p className='text-sm text-[#cbd5e1]'>
                Receive our exclusive offers & hotel updates.
              </p>
            </div>
            <form className='flex flex-col sm:flex-row gap-4'>
              <input
                type='email'
                placeholder='Email address'
                className='flex-1 bg-gray-800 text-white px-4 py-2 rounded-full border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#d4af37]'
              />
              <button
                type='submit'
                className='bg-[#d4af37] text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition font-medium'
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className='border-t border-gray-700 pt-6 mt-6 text-sm text-[#cbd5e1] flex flex-col sm:flex-row justify-between items-center'>
          <p>All rights reserved © 2026 Vaysta OPC Pvt. Ltd.</p>
          <div className='flex space-x-4 mt-3 sm:mt-0'>
            <Link to={'/policy'} className='hover:text-[#d4af37] transition'>
              Privacy Policy
            </Link>
            <a href='#' className='hover:text-[#d4af37] transition'>
              Terms
            </a>
            <a href='#' className='hover:text-[#d4af37] transition'>
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
