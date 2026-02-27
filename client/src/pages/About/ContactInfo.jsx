import React from 'react';

const ContactInfo = () => {
  const contactData = [
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/9d7cadd12de6d4076be22ec3c497a51a5530d5badfb5232e14f1a1dbec9aea25?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      title: 'Phone',
      content: '+91 6307200050',
      iconAlt: 'Phone icon',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/132eea5b5a8e638d8a20dd4c0a5e40a98773c250045b61f88ce7a43e941197df?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      title: 'Email',
      content: 'fgroupservicess@gmail.com',
      iconAlt: 'Email icon',
    },
    {
      icon: 'https://cdn.builder.io/api/v1/image/assets/TEMP/f4682ac66b07bb5ace7992cb7f553f2a106e9942eaaafdbc2c05c22a91ee0d76?placeholderIfAbsent=true&apiKey=0fe35db3f1aa404fa7baf33129e1989a',
      title: 'Address',
      content:
        'Gomti Nagar, Lucknow-226002, Uttar Pradesh',
      iconAlt: 'Address icon',
    },
  ];

  function ContactItem({ icon, title, content, iconAlt }) {
    return (
      <div className='flex gap-5  justify-center items-center'>
        <img
          loading='lazy'
          src={icon}
          alt={iconAlt}
          className='object-contain shrink-0 my-auto aspect-square w-[35px]'
        />
        <div className='flex flex-col'>
          <h3 className='self-start text-base font-medium text-orange-600'>
            {title}
          </h3>
          <p className='text-sm leading-8 text-zinc-700'>{content}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className='flex flex-col justify-center items-center py-11 w-full bg-stone-50'>
        <div className='flex px-4 flex-col items-center ml-4 w-full mx-auto max-md:max-w-full'>
          <h2 className='text-2xl  font-medium text-center capitalize text-zinc-700'>
            Contact Information
          </h2>
          <p className='mt-1 text-sm leading-loose text-center text-neutral-900 max-md:max-w-full'>
            Feel free to contact us for more information, we'll be happy to help
            you
          </p>
          <div className='flex px-8 gap-10 items-center flex-wrap mt-10 w-full'>
            {contactData.map((item, index) => (
              <React.Fragment key={item.title}>
                <ContactItem
                  icon={item.icon}
                  title={item.title}
                  content={item.content}
                  iconAlt={item.iconAlt}
                />
                {index < contactData.length - 1 && (
                  <div className='shrink-0 hidden lg:block self-stretch my-auto w-0 border border-solid border-zinc-700 h-[70px]' />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ContactInfo;
