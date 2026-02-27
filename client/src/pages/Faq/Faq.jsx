import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';

const Faq = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  const faqData = [
    {
      id: 1,
      question: 'What services do you offer?',
      answer:
        'We offer a comprehensive range of services including web development, mobile app development, UI/UX design, and digital marketing solutions tailored to meet your business needs.',
    },
    {
      id: 2,
      question: 'How can I contact support?',
      answer:
        'You can reach our support team 24/7 through email at support@example.com, live chat on our website, or by calling our toll-free number at 1-800-123-4567.',
    },
    {
      id: 3,
      question: 'What are your business hours?',
      answer:
        'Our business hours are Monday through Friday, 9:00 AM to 6:00 PM EST. However, our online support is available 24/7 for urgent matters.',
    },
    {
      id: 4,
      question: 'Do you offer refunds?',
      answer:
        "Yes, we offer a 30-day money-back guarantee on all our services. If you're not satisfied with our service, please contact our support team to process your refund.",
    },
  ];

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const toggleAccordion = (id) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Hero Section */}
      <section className='pt-20 pb-12 px-8 md:pt-32 md:pb-24 bg-gradient-to-r from-blue-50 to-indigo-50'>
        <div className='container mx-auto px-4 flex flex-col md:flex-row items-center'>
          <div className='md:w-1/2 mb-8 md:mb-0'>
            <h2 className='text-4xl md:text-5xl font-bold text-gray-800 mb-4'>
              How can we help you?
            </h2>
            <p className='text-lg text-gray-600'>
              Find answers to frequently asked questions about our services,
              policies, and more.
            </p>
          </div>
          <div className='md:w-1/2'>
            <img
              src='https://images.unsplash.com/photo-1557804506-669a67965ba0'
              alt='FAQ Hero'
              className='rounded-lg shadow-xl w-full h-auto'
            />
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className='py-12 md:py-24'>
        <div className='container mx-auto px-4'>
          <h3 className='text-3xl font-bold text-center text-gray-800 mb-12'>
            Frequently Asked Questions
          </h3>
          <div className='max-w-3xl mx-auto space-y-4'>
            {faqData.map((faq) => (
              <div
                key={faq.id}
                className='bg-white rounded-lg shadow-md overflow-hidden'
              >
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className='w-full px-6 py-4 flex justify-between items-center focus:outline-none focus:ring-2 focus:ring-blue-500'
                  aria-expanded={activeAccordion === faq.id}
                  aria-controls={`faq-content-${faq.id}`}
                >
                  <span className='text-lg font-medium text-gray-700'>
                    {faq.question}
                  </span>
                  {activeAccordion === faq.id ? (
                    <IoIosArrowUp className='text-blue-600' />
                  ) : (
                    <IoIosArrowDown className='text-gray-400' />
                  )}
                </button>
                <div
                  id={`faq-content-${faq.id}`}
                  className={`transition-all duration-300 ease-in-out ${
                    activeAccordion === faq.id ? 'max-h-40' : 'max-h-0'
                  } overflow-hidden`}
                >
                  <p className='px-6 py-4 text-gray-600'>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Overlay for drawer menu */}
      {isDrawerOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-30'
          onClick={toggleDrawer}
          aria-hidden='true'
        />
      )}
    </div>
  );
};

export default Faq;
