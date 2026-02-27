import React, { useState } from 'react';
import VisionMission from './VisionMission';
import TeamSection from './TeamSection';
import CompanyHistory from './CompanyHistory';
import ContactInfo from './ContactInfo';

const About = () => {
  const paragraphs = [
    'See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.',
    "Continue to see St. Paul's Cathedral, Sir Christopher Wren's architectural masterpiece, where Admirals Nelson and Wellington are buried, and Princess Diana and Prince Charles got married. Continue to the Tower of London, built nearly 1,000 years ago during the reign of William the Conqueror.",
    'Home to the Crown Jewels, the Tower is protected by the famous Beefeaters, and the imposing palace has been used as a fortress and a prison throughout its history. Your guide will take you to Traitors Gate, where prisoners entered the Tower for the last time.',
    "Next, take a short trip along the River Thames, passing Shakespeare's Globe, Cleopatra's Needle, and London Bridge, before arriving at Westminster Pier. Rejoin the bus and head for Buckingham Palace. Make your way to the perfect spot to watch the world famous Changing of the Guard ceremony as the soldiers, dressed in their fabulous tunics and busbies, march to military music.",
  ];

  return (
    <>
      <article className='flex flex-col rounded-none'>
        <header>
          <img
            loading='lazy'
            src='https://cdn.builder.io/api/v1/image/assets/TEMP/c997b701128f627343414f328b62846fbe7a362e9356963979256454a5dcfa0a?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a'
            alt='Company overview header image'
            className='object-contain w-full aspect-[4.13] max-md:max-w-full'
          />
        </header>
        <section className=' relative md:top-[-90px] flex z-10 flex-col self-center px-4 sm:px-8 md:px-20 py-8 md:py-14 w-full bg-white rounded-xl shadow-md max-w-[1111px]'>
          <h1 className='self-start text-2xl md:text-3xl font-medium text-zinc-700'>
            Company Overview
          </h1>
          <div className='mt-6 space-y-4 overflow-hidden transition-all duration-300 ease-in-out '>
            <p className='text-sm leading-6 text-zinc-700'>{paragraphs}</p>
          </div>
        </section>
      </article>
      <VisionMission />
      <TeamSection />

      <CompanyHistory />
      <ContactInfo />
    </>
  );
};

export default About;
