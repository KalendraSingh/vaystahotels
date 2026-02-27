import React, { useState, useEffect, useRef } from 'react';
import { FiX } from 'react-icons/fi';
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';

const ShowMobileImages = ({ imageData = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(
    imageData[0]?.category || ''
  );
  const modalRef = useRef(null);

  // Extract unique categories from imageData if available
  const categories = imageData.length
    ? [...new Set(imageData.map((item) => item.category))]
    : [];

  // Flatten all images for the slider preview, filtering out undefined URLs
  const allImages = imageData.length
    ? imageData.flatMap((item) =>
        item.imageUrls
          .filter((url) => url) // Filters out any undefined URLs
          .map((url) => ({ url, category: item.category }))
      )
    : [];

  const handlePrevPreview = () => {
    setPreviewIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
  };

  const handleNextPreview = () => {
    setPreviewIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
  };

  const handlePreviewClick = () => {
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleScroll = () => {
    if (modalRef.current) {
      const sections = document.querySelectorAll('[data-category]');
      const scrollPosition = modalRef.current.scrollTop;

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop - 100 &&
          scrollPosition < sectionTop + sectionHeight - 100
        ) {
          setActiveCategory(section.getAttribute('data-category'));
        }
      });
    }
  };

  const scrollToCategory = (categoryId) => {
    const element = document.querySelector(`[data-category="${categoryId}"]`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (modalOpen) {
        switch (e.key) {
          case 'ArrowLeft':
            handlePrevPreview();
            break;
          case 'ArrowRight':
            handleNextPreview();
            break;
          case 'Escape':
            handleModalClose();
            break;
          default:
            break;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalOpen]);

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 block md:hidden'>
      {/* Preview Slider */}
      {allImages.length > 0 && (
        <div className='relative aspect-[21/12] overflow-hidden rounded-xl'>
          <button
            onClick={handlePreviewClick}
            className='w-full h-full relative group'
            aria-label='View larger version of preview image'
          >
            <img
              src={allImages[previewIndex]?.url || ''}
              alt={`Preview image ${previewIndex + 1}`}
              className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-105'
            />
            <div className='absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity' />
          </button>

          <button
            onClick={handlePrevPreview}
            className='absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors'
            aria-label='Previous preview image'
          >
            <BsChevronLeft size={12} />
          </button>

          <button
            onClick={handleNextPreview}
            className='absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full shadow-lg hover:bg-white transition-colors'
            aria-label='Next preview image'
          >
            <BsChevronRight size={12} />
          </button>

          <div className='absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/80 px-4 py-2 rounded-full'>
            {`${previewIndex + 1} / ${allImages.length}`}
          </div>
        </div>
      )}

      {/* Modal */}

      {modalOpen && (
        <div
          className='fixed inset-0 z-50 flex items-start justify-center bg-black bg-opacity-90'
          role='dialog'
          aria-modal='true'
          aria-labelledby='modal-title'
        >
          <div className='relative w-full h-full flex flex-col'>
            <div className='sticky top-0 z-10 bg-black/95 py-4'>
              <button
                onClick={handleModalClose}
                className='fixed top-2 right-2 md:absolute md:top-4 md:right-4 text-white p-2 hover:bg-white/10 rounded-full z-50'
                aria-label='Close modal'
              >
                <FiX size={24} />
              </button>

              <div className='flex overflow-x-auto scrollbar-hide space-x-4 py-4 justify-start md:justify-center px-4 pt-10 md:pt-0'>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => scrollToCategory(category)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                      activeCategory === category
                        ? 'bg-color text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
            <div
              ref={modalRef}
              className='flex-1 overflow-y-auto px-4 py-6'
              onScroll={handleScroll}
            >
              {categories.map((category) => (
                <div
                  key={category}
                  data-category={category}
                  className='mb-12 last:mb-0'
                >
                  <h2 className='text-white text-2xl font-bold mb-6'>
                    {category}
                  </h2>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {imageData
                      .filter((item) => item.category === category)
                      .flatMap((item) =>
                        item.imageUrls
                          .filter((url) => url) // Filter out undefined URLs
                          .map((url, index) => (
                            <div
                              key={`${item.id}-${index}`}
                              className='relative aspect-[4/3] overflow-hidden rounded-lg'
                            >
                              <img
                                src={url}
                                alt={`Image of ${category}`}
                                className='w-full h-full object-cover'
                              />
                            </div>
                          ))
                      )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowMobileImages;
