import React from 'react';

const highlights = [
  { number: "2021", text: "Year of establishment" },
  { number: "20+", text: "Expertise across 20+" },
  { number: "10+", text: "Employees in Deveotech" },
  { number: "20+", text: "Featured Projects Complete" },
];

const SectionTwo = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="px-6 sm:px-10 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-10 items-stretch">
        
        {/* Left Side - Image */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/2.8] rounded-lg overflow-hidden shadow-xl">
          <img
            src=""
            alt="Office"
            className="w-full h-full object-cover transition duration-700 ease-in-out"
          />
          {/* Rotated Experience Text */}
          <div className="absolute left-4 sm:left-6 md:left-10 top-[103%] transform -translate-y-1/2 rotate-[-90deg] origin-left">
            <div className="text-[32px] sm:text-[26px] md:text-[30px] lg:text-[36px] uppercase text-transparent tracking-[2px] font-semibold 
              [-webkit-text-stroke-width:1.2px] md:[-webkit-text-stroke-width:1.5px] [-webkit-text-stroke-color:white]">
              07+ EXPERIENCE
            </div>
          </div>
        </div>

        {/* Right Side - Content */}
        <div className="w-full flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 leading-snug">
            Welcome to DeveoTech Software Solution
          </h2>
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Discover innovative software development and IT services tailored for your business needs.
            Our team delivers scalable solutions powered by the latest technology trends.
          </p>

          {/* Highlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {highlights.map((item, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-full shadow-md cursor-pointer transition-all duration-300 bg-white"
              >
                <div className="absolute inset-0 bg-sky-500 transform scale-x-0 origin-left transition-transform duration-300 ease-out group-hover:scale-x-100 z-0 rounded-full" />
                <div className="relative z-10 flex items-center px-4 py-3">
                  <div className="w-10 h-10 bg-[#2E7BA2] rounded-full mr-4 flex-shrink-0"></div>
                  <div className="text-sm text-gray-800 group-hover:text-white transition-colors duration-300">
                    <strong className="block text-base">{item.number}</strong>
                    <span>{item.text}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 sm:justify-start justify-center">
            <a
              href="#"
              className="px-6 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition duration-300"
            >
              Get Started
            </a>
            <a
              href="#"
              className="px-6 py-2 rounded bg-white border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition duration-300"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionTwo;
