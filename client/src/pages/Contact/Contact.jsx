import React, { useEffect, useState } from 'react';
import VenderHeader from '../Home/VenderHeader';
import {
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
} from 'react-icons/fa';

const InputField = ({ name, placeholder, type = 'text', value, onChange }) => (
  <input
    name={name}
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className='px-4 py-3 mt-4 bg-white border-2 border-[#E5C100] rounded-md w-full focus:outline-none focus:ring-2 focus:ring-[#FFD700]'
    aria-label={placeholder}
  />
);

const TextArea = ({ name, placeholder, value, onChange }) => (
  <textarea
    name={name}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className='px-4 py-3 mt-4 bg-white border-2 border-[#E5C100] rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-[#FFD700]'
    aria-label={placeholder}
  />
);

const Button = ({ children, type = 'button', onClick }) => (
  <button
    type={type}
    onClick={onClick}
    className='w-full py-3 mt-8 text-white font-semibold rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#FFD700] shadow-lg hover:brightness-105 transition duration-300'
  >
    {children}
  </button>
);

const Map = () => (
  <div className='w-full mt-8 lg:mt-0 lg:ml-10 rounded-xl overflow-hidden shadow-md border border-[#E5C100]'>
    <iframe
      src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3561.5400663358305!2d82.19890307521989!3d26.790927176720007!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399a076bcde2e8cf%3A0xbab9e7942d70ae12!2sAmbedkar%20Park%20Jalwanpura!5e0!3m2!1sen!2sin!4v1768762770373!5m2!1sen!2sin'
      width='100%'
      height='450'
      style={{ border: 0 }}
      allowFullScreen=''
      loading='lazy'
      title='Google Maps'
    ></iframe>
  </div>
);

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobileNumber: '',
    message: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const contactData = [
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9d7cadd12de6d4076be22ec3c497a51a5530d5badfb5232e14f1a1dbec9aea25',
      title: 'Phone',
      content: '+91 6307200050',
      iconAlt: 'Phone icon',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/132eea5b5a8e638d8a20dd4c0a5e40a98773c250045b61f88ce7a43e941197df',
      title: 'Email',
      content: 'fgroupservicess@gmail.com',
      iconAlt: 'Email icon',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/132eea5b5a8e638d8a20dd4c0a5e40a98773c250045b61f88ce7a43e941197df',
      title: 'Email',
      content: 'vaysta.contact@gmail.com',
      iconAlt: 'Email icon',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f4682ac66b07bb5ace7992cb7f553f2a106e9942eaaafdbc2c05c22a91ee0d76',
      title: 'Head Office',
      content: '4/5/82, Jalwanpura Raiganj,Faizabad, Ayodhya, Ayodhya RS, Faizabad – 224123, Uttar Pradesh, India',
      iconAlt: 'Address icon',
    },
  ];

  function ContactItem({ icon, title, content, iconAlt }) {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return (
      <div className='flex items-start gap-4'>
        <img
          loading='lazy'
          src={icon}
          alt={iconAlt}
          className='w-6 md:w-8 lg:w-10 aspect-square object-contain'
        />
        <div>
          <h3 className='text-sm font-semibold text-[#D4AF37]'>{title}</h3>
          <p className='text-sm text-neutral-800'>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <VenderHeader />

      <div className='bg-white py-16 px-4 md:px-20 text-[#0D0D0D]'>
        {/* Heading */}
        <div className='text-center mb-12'>
          <h1 className='text-4xl font-bold text-[#D4AF37] mb-2'>
            Get in Touch
          </h1>
          <div className='h-1 w-24 mx-auto bg-gradient-to-r from-[#D4AF37] to-[#FFD700] rounded'></div>
          <p className='mt-4 text-lg text-gray-700'>
            We'd love to hear from you, whether you're a traveler or host!
          </p>
        </div>

        {/* Contact Info + Form */}
        <div className='grid lg:grid-cols-2 gap-12 items-start'>
          {/* Contact Info Section */}

          {/* Contact Information Section */}
          <div className='bg-[#fffdf5] rounded-2xl shadow-lg p-8'>
            <h2 className='text-2xl font-bold text-[#B68F00] mb-6'>
              Contact Information
            </h2>
            <p className='text-sm text-gray-700 mb-8'>
              Feel free to reach out for any queries, we're always here to
              help!
            </p>

            <div className='space-y-6'>
              {contactData.map((item) => (
                <div key={item.title} className='flex items-start gap-4'>
                  <div className='flex-shrink-0 w-10 h-10 bg-[#fff9e0] rounded-full flex items-center justify-center border border-[#FFD700]'>
                    <img
                      src={item.icon}
                      alt={item.iconAlt}
                      className='w-5 h-5 object-contain'
                    />
                  </div>
                  <div>
                    <p className='text-sm text-[#B68F00] font-medium'>
                      {item.title}
                    </p>
                    <p className='text-sm text-neutral-800'>{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
            {/* Social Media Section */}
            <div className='text-end mb-10 mr-20'>
              <h3 className='text-xl font-semibold text-[#B68F00] mb-4 mr-1'>
                Follow us on
              </h3>
              <div className='flex justify-end space-x-6 text-[#D4AF37] text-2xl'>
                <a href='#' className='hover:text-[#FFD700]'>
                  <FaFacebook />
                </a>
                <a href='#' className='hover:text-[#FFD700]'>
                  <FaInstagram />
                </a>
                <a href='#' className='hover:text-[#FFD700]'>
                  <FaLinkedin />
                </a>
              </div>
            </div>

            {/* Support Tags */}
            <div className='text-center text-sm text-gray-500'>
              ✅ 24x7 Support | 🔒 Your information is secure with us | ❤️ 1000+
              Happy Customers
            </div>
            {/* Business Ownership Section */}
            <div className='mt-8 pt-8 border-t border-[#E5C100]'>
              <h2 className='text-2xl font-bold text-[#B68F00] mb-6'>
                Business Ownership
              </h2>
              <div className='space-y-4 text-sm text-neutral-800'>
                <p>
                  <span className='font-bold'>VAYSTA (OPC) PRIVATE LIMITED</span>{' '}
                  is a registered One Person Company incorporated under the
                  Companies Act, 2013, India.
                </p>
                <div>
                  <h3 className='font-semibold text-[#D4AF37] mb-1'>
                    Authorized Signatory:
                  </h3>
                  <p>Mr. Manish Pratap Sonkar, Director</p>
                </div>
                <div>
                  <h3 className='font-semibold text-[#D4AF37] mb-1'>
                    Contact Number:
                  </h3>
                  <p>+91 6307200050</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className='w-full flex flex-col bg-white p-6 border border-[#E5C100] rounded-2xl shadow-md'
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <InputField
                name='firstName'
                placeholder='First Name'
                value={formData.firstName}
                onChange={handleChange}
              />
              <InputField
                name='lastName'
                placeholder='Last Name'
                value={formData.lastName}
                onChange={handleChange}
              />
            </div>
            <InputField
              name='email'
              placeholder='Email Address'
              type='email'
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              name='mobileNumber'
              placeholder='Mobile Number'
              type='tel'
              value={formData.mobileNumber}
              onChange={handleChange}
            />
            <TextArea
              name='message'
              placeholder='Your message...'
              value={formData.message}
              onChange={handleChange}
            />
            <Button type='submit'>Send Message</Button>
          </form>
        </div>

        {/* Map */}
        <div className='mt-16'>
          <Map />
        </div>
      </div >
    </>
  );
};

export default Contact;
