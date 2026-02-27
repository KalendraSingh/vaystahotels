import React from "react";
import { Star, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export function HotelCard({ hotel }) {
  return (
    <div className="bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] rounded-lg border border-[#E5C100] overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-[1.015] hover:shadow-xl flex flex-col md:flex-row">
      <div className="md:w-1/3 relative">
        <Link to={`/hotelDetailed/${hotel.id}`}>
          <img
            src={hotel.bannerImage}
            alt={hotel.name}
            className="w-full h-48 md:h-56 max-h-130 object-cover"
          />
        </Link>
      </div>
      <div className="p-4 md:p-6 flex flex-col md:w-2/3">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-[#B68F00]">{hotel.name}</h3>
          {hotel.avgRating && (
            <div className="flex items-center">
              <Star className="w-5 h-5 text-yellow-400 fill-current" />
              <span className="ml-1">{hotel.avgRating.toFixed(1)}</span>
            </div>
          )}
        </div>
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-[16px]">{hotel.city}</span>
        </div>
        <p className="text-gray-600 text-[14px] mb-4 flex-grow">
          {hotel.description?.slice(0,150)}
        </p>
        {/* <div className="flex flex-wrap gap-2 mb-4">
          {hotel?.amenities?.map((amenity,index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 px-2 py-1 rounded-full"
            >
              {amenity.name}
            </span>
          ))}
        </div> */}
        <div className="flex justify-between items-center mt-auto">
          <span className="text-2xl font-bold text-[#7a6c00]">
            ₹ {hotel.avgPrice}
          </span>
          <Link
            to={`/hotelDetailed/${hotel.id}`}
            className="text-[#D4AF37] font-semibold hover:underline"
          >
            <button className="bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-[#0D0D0D] font-semibold px-4 py-2 rounded transition-colors hover:opacity-90">
              Book Now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
