import ContactInfo from './ContactInfo';
import SocialIcons from './SocialIcons';

function TopHeader() {
  return (
    <header className='w-full bg-color py-2'>
      <div className='max-w-[1107px] mx-auto'>
        <div className='flex justify-end gap-3 px-4 md:px-0'>
          <SocialIcons />
          <ContactInfo />
        </div>
      </div>
    </header>
  );
}

export default TopHeader;
