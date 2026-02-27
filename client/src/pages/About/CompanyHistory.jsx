import React from 'react';

const historyData = [
  {
    content:
      'See the highlights of London via 2 classic modes of transport on this half-day adventure. First, you will enjoy great views of Westminster Abbey, the Houses of Parliament, and the London Eye, as you meander through the historic streets on board a vintage double decker bus.',
  },
  {
    content:
      "Continue to see St. Paul's Cathedral, Sir Christopher Wren's architectural masterpiece, where Admirals Nelson and Wellington are buried, and Princess Diana and Prince Charles got married. Continue to the Tower of London, built nearly 1,000 years ago during the reign of William the Conqueror.",
  },
  {
    content:
      'Home to the Crown Jewels, the Tower is protected by the famous Beefeaters, and the imposing palace has been used as a fortress and a prison throughout its history. Your guide will take you to Traitors Gate, where prisoners entered the Tower for the last time.',
  },
  {
    content:
      "Next, take a short trip along the River Thames, passing Shakespeare's Globe, Cleopatra's Needle, and London Bridge, before arriving at Westminster Pier. Rejoin the bus and head for Buckingham Palace. Make your way to the perfect spot to watch the world famous Changing of the Guard ceremony as the soldiers, dressed in their fabulous tunics and busbies, march to military music.",
  },
];

function CompanyHistory() {
  return (
    <article className='flex px-4 mx-auto flex-col rounded-none text-zinc-700 w-full lg:w-[1150px] py-10'>
      <h1 className='self-start text-2xl font-medium text-center capitalize'>
        Company History
      </h1>
      <div className='z-10 mt-3.5 text-sm leading-6 max-md:mr-0 max-md:max-w-full'>
        {historyData.map((section, index) => (
          <section key={index} className='mb-6'>
            <p>{section.content}</p>
          </section>
        ))}
      </div>
    </article>
  );
}

export default CompanyHistory;
