import React from 'react';

const Banner = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc]">
      {/* Main Hero Banner */}
      <div className="relative col-span-2 h-[400px] rounded-3xl overflow-hidden shadow-lg group border border-[#E5C100]">
        <img
          src="https://images.unsplash.com/photo-1710429068963-1f6c853134a4?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Spiritual Banner"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 drop-shadow-lg text-[#D4AF37]">
            Discover Spiritual Tranquility
          </h2>
          <p className="text-sm md:text-base text-[#B68F00]">
            Book your perfect stay in Ayodhya today.
          </p>
        </div>
      </div>

      {/* Mini Side Banners */}
      <div className="flex flex-col gap-6">
        {/* Mini Banner 1 */}
        <div className="relative h-[190px] rounded-3xl overflow-hidden shadow-md group border border-[#E5C100]">
          <img
            src="https://images.unsplash.com/photo-1740596400206-f894025300b5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8SGVyaXRhZ2UlMjBIb21lc3xlbnwwfHwwfHx8MA%3D%3D"
            alt="Heritage Homes"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 p-4 z-10">
            <h3 className="text-lg font-semibold drop-shadow text-[#B68F00]">
              Heritage Homes
            </h3>
          </div>
        </div>

        {/* Mini Banner 2 */}
        <div className="relative h-[190px] rounded-3xl overflow-hidden shadow-md group border border-[#E5C100]">
          <img
            src="https://images.unsplash.com/photo-1605352081508-2e09927ecfe3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8THV4dXJ5JTIwUmV0cmVhdHN8ZW58MHx8MHx8fDA%3D"
            alt="Luxury Retreats"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute bottom-0 p-4 z-10">
            <h3 className="text-lg font-semibold drop-shadow text-[#B68F00]">
              Luxury Retreats
            </h3>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
