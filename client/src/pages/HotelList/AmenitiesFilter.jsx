import React from "react";

export function AmenitiesFilter({ filters, setFilters, onApply }) {
  const amenitiesList = [
    "WiFi",
    "Parking",
    "Pool",
    "Gym",
    "Restaurant",
    "Spa",
    "Air Conditioning",
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#D4AF37] mb-4">Select Amenities</h3>
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
            className={`px-3 py-2 rounded-lg text-sm ${
              filters.amenities.includes(amenity)
                ? "bg-[#FFD700] text-white"
                : "border border-[#E5C100] text-[#B68F00]"
            }`}
          >
            {amenity}
          </button>
        ))}
      </div>
      <div className="flex justify-between gap-4 mt-6">
        <button
          onClick={() =>
            setFilters((prev) => ({ ...prev, amenities: [] }))
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
  );
}
