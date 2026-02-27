import React, { useState } from "react";
import { Star } from "lucide-react";

export function Filters({ filters, setFilters, onApply, mode = "all", amenitiesList = [] }) {
  const showPrice = mode === "all" || mode === "filters";
  const showRating = mode === "all" || mode === "filters";
  const showAmenities = mode === "all" || mode === "amenities";

  return (
    <div className="p-4">
      {/* Desktop Filter Layout */}
      {mode === "all" && (
        <div className="hidden lg:block bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] p-6 rounded-lg shadow-md border border-[#E5C100]">
          {/* Price Range */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Price Range</h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full h-2 rounded-lg cursor-pointer accent-[#D4AF37]"
            />
            <div className="flex justify-between text-sm text-[#7a6c00]">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Rating</h3>
            <div className="flex flex-col gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: prev.rating === rating ? null : rating,
                    }))
                  }
                  className={`flex items-center p-2 rounded transition ${filters.rating === rating ? "bg-[#fff3cc]" : "hover:bg-[#fffbe5]"
                    }`}
                >
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#FFD700] fill-current" />
                  ))}
                  <span className="ml-2 text-[#B68F00]">{rating} Stars</span>
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">Amenities</h3>
            <div className="space-y-2">
              {amenitiesList.map((amenity) => (
                <label key={amenity} className="flex items-center text-[#7a6c00]">
                  <input
                    type="checkbox"
                    checked={filters.amenities.includes(amenity)}
                    onChange={(e) => {
                      setFilters((prev) => ({
                        ...prev,
                        amenities: e.target.checked
                          ? [...prev.amenities, amenity]
                          : prev.amenities.filter((a) => a !== amenity),
                      }));
                    }}
                    className="mr-2 accent-[#D4AF37]"
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={onApply}
            className="w-full py-3 rounded-lg text-white font-semibold transition-colors bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
          >
            Apply Filters
          </button>
        </div>
      )}

      {/* Mobile Layout */}
      <div className="block lg:hidden space-y-6">
        {/* Price Range */}
        {showPrice && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-[#D4AF37]">Price Range</h3>
            <input
              type="range"
              min="0"
              max="10000"
              value={filters.priceRange[1]}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  priceRange: [prev.priceRange[0], Number(e.target.value)],
                }))
              }
              className="w-full h-2 rounded-lg cursor-pointer accent-[#D4AF37]"
            />
            <div className="flex justify-between text-xs text-[#7a6c00] mt-1">
              <span>₹{filters.priceRange[0]}</span>
              <span>₹{filters.priceRange[1]}</span>
            </div>
          </div>
        )}

        {/* Rating */}
        {showRating && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-[#D4AF37]">Rating</h3>
            <div className="flex flex-wrap gap-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      rating: prev.rating === rating ? null : rating,
                    }))
                  }
                  className={`flex items-center px-3 py-2 rounded-lg text-sm ${filters.rating === rating
                    ? "bg-[#FFD700] text-white"
                    : "border border-[#E5C100] text-[#B68F00]"
                    }`}
                >
                  {rating}★
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Amenities */}
        {showAmenities && (
          <div>
            <h3 className="text-sm font-semibold mb-2 text-[#D4AF37]">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      amenities: prev.amenities.includes(amenity)
                        ? prev.amenities.filter((a) => a !== amenity)
                        : [...prev.amenities, amenity],
                    }))
                  }
                  className={`px-3 py-2 rounded-lg text-sm ${filters.amenities.includes(amenity)
                    ? "bg-[#FFD700] text-white"
                    : "border border-[#E5C100] text-[#B68F00]"
                    }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={() =>
              setFilters({
                priceRange: [0, 10000],
                rating: null,
                amenities: [],
              })
            }
            className="flex-1 py-3 rounded-lg border border-[#E5C100] text-[#B68F00] text-sm"
          >
            Clear
          </button>
          <button
            onClick={onApply}
            className="flex-1 py-3 rounded-lg text-white text-sm font-semibold bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
