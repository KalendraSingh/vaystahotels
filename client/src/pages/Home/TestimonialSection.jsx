import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

// Testimonial Data
const testimonials = [
  {
    name: "Santosh Singh",
    location: "Lucknow, Uttar Pradesh",
    message:
      "Communication. They helped me with website consultation. I am very pleased with his inputs and I look forward to connecting with him in the near future on other projects.",
    avatar: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  },
  {
    name: "Chandresh Bind",
    location: "Noida, Uttar Pradesh",
    message:
      "Devotech Software Solutions delivered beyond our expectations. Their commitment to quality and timely delivery is truly commendable.",
    avatar: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  },
  {
    name: "Vikash Pandey",
    location: "Basti, Uttar Pradesh",
    message:
      "We were impressed by their technical expertise and proactive approach. Their team ensured our project met every requirement seamlessly",
    avatar: "https://cdn-icons-png.flaticon.com/512/219/219983.png",
  },
];

// Testimonial Card Component
const TestimonialCard = ({ testimonial }) => (
  <div className="relative max-w-[300px] mx-auto text-center pt-12">
    {/* Blue Border Wrapper */}
    <div className="relative bg-blue-500 rounded-3xl pb-6 px-1 overflow-visible">
      {/* White Inner Box */}
      <div className="bg-white rounded-2xl px-6 pt-6 pb-6 relative z-10">
        {/* Location Badge */}
        <div className="absolute -top-4 left-4 bg-orange-500 text-white text-sm px-3 py-1 rounded-full font-medium z-20">
          {testimonial.location}
        </div>

        {/* Avatar */}
        <div className="absolute -top-8 right-4 w-16 h-16 border-4 border-white rounded-full bg-white shadow-md z-20">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>

        {/* Message */}
        <p className="text-gray-600 text-base leading-relaxed mt-6 z-10 relative">
          {testimonial.message}
        </p>
      </div>

      {/* Inverted Right Angle Triangle (speech tail) */}
      <div className="absolute left-1/2 -bottom-[20px] transform -translate-x-1/2 w-0 h-0 border-t-[20px] border-r-[20px] border-t-blue-500 border-r-transparent z-0" />
    </div>

    {/* Name */}
    <p className="mt-8 text-black font-bold tracking-wide text-lg">
      {testimonial.name}
    </p>
  </div>
);

// Testimonial Section with Swiper Carousel
const TestimonialSection = () => (
  <section className="py-20 bg-gray-50 overflow-hidden">
    <div className="max-w-6xl mx-auto px-4">
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {testimonials.map((testimonial, index) => (
          <SwiperSlide key={index} className="flex justify-center">
            <TestimonialCard testimonial={testimonial} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  </section>
);

export default TestimonialSection;
