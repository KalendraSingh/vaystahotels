import React from 'react';
import Hero from './Hero';
import OffersSlider from './OffersSlider';
import Milestone from './Milestone';
import CitySlider from './CitySlider';
import Hotels from './Hotels';
import Trending from './Trending';
import Banner from './Banner';
import TopRated from './TopRated';
import TestimonialSection from './TestimonialSection';
import SectionTwo from './SectionTwo'; 
import MobileNav from './MobileNav';

function Index() {
  return (
    <div className=" bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]

">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]

">
        <Hero />
      </div>

      {/* Offers Slider */}
      <div className="py-12  bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]

">
        <OffersSlider />
      </div>

      {/* Milestone Section */}
      <div className="py-12 bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]

">
        <Milestone />
      </div>

      {/* City Slider */}
      <div className="py-12 bg-white">
        <CitySlider />
      </div>

      {/* Hotels Section */}
      <div className="py-12 bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]

">
        <Hotels />
      </div>

      {/* Trending Section */}
      <div className="py-12 bg-white">
        <Trending />
      </div>

      {/* Banner Section */}
      <div className="relative  ">
        <Banner />
      </div>

      {/* Top Rated Section */}
      <div className="py-12 bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]">

        <TopRated />
      </div>

 {/* color collection
 1.#ffcc00-Bright yellow gold
 2.#ffea94-Soft pastel gold highlight
 3.#FFD700-Rich gold
 
 */}
 {/* Mobile Bottom Navigation - Always Visible */}
        <MobileNav />
       
    </div>

     
  );
}

export default Index;
