import React, { useEffect, useState } from "react";
import { HotelCard } from "./HotelCard";
import { Filters } from "./Filters";
import { AmenitiesFilter } from "./AmenitiesFilter";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Search,
  X,
} from "lucide-react";
import { getAllHotels, getAllAmenities } from "../../../api/Public/HotelApi";
import { useSearchParams } from "react-router-dom";
import VenderHeader from "../Home/VenderHeader";

function HotelList() {
  const [latestHotels, setLatestHotels] = useState([]);
  const [amenitiesList, setAmenitiesList] = useState([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 10000],
    rating: null,
    amenities: [],
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerType, setDrawerType] = useState(null);
  const [sortBy, setSortBy] = useState("avgPrice");
  const [sortOrder, setSortOrder] = useState("asc");
  const hotelsPerPage = 4;

  const [searchParams] = useSearchParams();
  const destinationParam = searchParams.get("destination") || "";
  const hotelParam = searchParams.get("hotel") || "";

  useEffect(() => {
    fetchLatestHotels();
  }, [filters, searchQuery, sortBy, sortOrder]);

  useEffect(() => {
    const combinedSearch = `${destinationParam} ${hotelParam}`.trim();
    setSearchQuery(combinedSearch);
  }, [destinationParam, hotelParam]);

  useEffect(() => {
    fetchAmenities();
  }, []);

  const [loading, setLoading] = useState(false);  // Add loading state

  const fetchAmenities = async () => {
    try {
      const res = await getAllAmenities();
      if (res.status === 200) {
        // Extract amenity names from the response
        const amenityNames = res.data.map(amenity => amenity.name);
        setAmenitiesList(amenityNames);
      }
    } catch (error) {
      console.error("Failed to fetch amenities:", error);
    }
  };

  const fetchLatestHotels = async () => {
    setLoading(true);  // Start loading
    try {
      // Prepare filter data
      const searchData = {
        searchTerm: searchQuery,
        filterData: {
          price: filters.priceRange[1],
          rating: filters.rating,
          amenities: filters.amenities.length > 0 ? filters.amenities : undefined,
        },
        sortBy: sortBy,
        sortOrder: sortOrder,
        page: 1,
        pageSize: 20, // Reduced from 100 to prevent database timeout
      };

      const res = await getAllHotels(searchData);
      if (res.status === 200) {
        setLatestHotels(res.data.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch hotels:", error);
    }
    setLoading(false);  // Stop loading
  };


  // Use hotels directly from API (already filtered)
  const totalPages = Math.ceil(latestHotels.length / hotelsPerPage);
  const indexOfLastHotel = currentPage * hotelsPerPage;
  const indexOfFirstHotel = indexOfLastHotel - hotelsPerPage;
  const currentHotels = latestHotels.slice(
    indexOfFirstHotel,
    indexOfLastHotel
  );

  return (
    <>
      <VenderHeader />
      <div className="max-w-7xl mt-4 mx-auto px-4 sm:px-6 lg:px-8 bg-white min-h-screen">

        {/* Search Bar */}
        <div className="w-full max-w-6xl mx-auto mb-6 px-4">
          <div className="flex items-center gap-2 bg-white border border-[#E5C100] rounded-xl shadow-sm px-3 py-2">
            <Search className="text-[#B68F00] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by location or hotel name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow bg-transparent outline-none placeholder:text-[#B68F00] text-[#7a6c00] text-sm"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="p-1">
                <X className="w-4 h-4 text-[#B68F00]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Buttons - Mobile */}
        <div className="flex items-center justify-between gap-2 mb-4 lg:hidden px-2 max-w-md mx-auto">
          <div
            className="flex items-center gap-1 flex-1 min-w-[80px] border border-[#E5C100] rounded-lg px-2 py-1 bg-white cursor-pointer justify-center"
            onClick={() => setDrawerType("amenities")}
          >
            <span className="text-sm text-[#B68F00] truncate">Amenities</span>
            <ChevronDown className="w-4 h-4 text-[#B68F00]" />
          </div>
          <div
            className="flex items-center gap-1 flex-1 min-w-[80px] border border-[#E5C100] rounded-lg px-2 py-1 bg-white cursor-pointer justify-center"
            onClick={() => setDrawerType("filters")}
          >
            <span className="text-sm text-[#B68F00] truncate">Filter</span>
            <ChevronDown className="w-4 h-4 text-[#B68F00]" />
          </div>
          <div
            className="flex items-center gap-1 flex-1 min-w-[80px] border border-[#E5C100] rounded-lg px-2 py-1 bg-white cursor-pointer justify-center"
            onClick={() => setDrawerType("sort")}
          >
            <span className="text-sm text-[#B68F00] truncate">Sort</span>
            <ChevronDown className="w-4 h-4 text-[#B68F00]" />
          </div>
        </div>

        {/* Filters + Hotel Cards */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="hidden lg:block lg:w-1/4">
            <Filters
              filters={filters}
              setFilters={setFilters}
              onApply={() => { }}
              amenitiesList={amenitiesList}
            />
          </div>

          <div className="lg:w-3/4 w-full">
            <div className="flex flex-col gap-6">
              {loading ? (
                <p className="text-center text-[#7a6c00]">Loading hotels...</p>
              ) : currentHotels.length === 0 ? (
                <p className="text-center text-[#7a6c00]">No hotels available.</p>
              ) : (
                currentHotels.map((hotel) => (
                  <HotelCard key={hotel.id} hotel={hotel} />
                ))
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex flex-wrap justify-center items-center mb-4 gap-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded bg-gradient-to-br from-[#D4AF37] to-[#FFD700] hover:opacity-90 disabled:opacity-50"
                >
                  <ChevronLeft className="w-5 h-5 text-white" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded ${currentPage === page
                        ? "bg-[#D4AF37] text-white"
                        : "bg-white border border-[#E5C100] text-[#B68F00] hover:bg-[#fff9e6]"
                        }`}
                    >
                      {page}
                    </button>
                  )
                )}
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded bg-gradient-to-br from-[#D4AF37] to-[#FFD700] hover:opacity-90 disabled:opacity-50"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Drawers */}
        {drawerType && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <div className="fixed inset-y-0 right-0 w-full max-w-xs bg-white shadow-xl">
              <div className="p-4 flex justify-between items-center border-b border-[#E5C100]">
                <h2 className="text-xl font-semibold text-[#B68F00]">
                  {drawerType === "amenities" && "Amenities"}
                  {drawerType === "filters" && "Filters"}
                  {drawerType === "sort" && "Sort by"}
                </h2>
                <button
                  onClick={() => setDrawerType(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-6 h-6 text-[#7a6c00]" />
                </button>
              </div>
              <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                {drawerType === "amenities" && (
                  <Filters
                    filters={filters}
                    setFilters={setFilters}
                    onApply={() => setDrawerType(null)}
                    mode="amenities"
                    amenitiesList={amenitiesList}
                  />
                )}

                {drawerType === "filters" && (
                  <div className="space-y-6">
                    {/* Hotel Type */}
                    <div>
                      <h3 className="text-base font-semibold text-[#D4AF37] mb-2">
                        Hotel Type
                      </h3>
                      <div className="flex gap-2">
                        {["Any type", "Homestay", "Hotel"].map((type) => (
                          <button
                            key={type}
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                typeOfPlace: type,
                              }))
                            }
                            className={`flex-1 py-2 border rounded-lg text-sm ${filters.typeOfPlace === type
                              ? "border-[#FFD700] text-[#B68F00] bg-[#fff9e6]"
                              : "border-[#E5C100] text-[#B68F00] hover:bg-[#fff9e6]"
                              }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Price Filter */}
                    <div>
                      <h3 className="text-base font-semibold text-[#D4AF37] mb-2">
                        Maximum Price
                      </h3>
                      <p className="text-xs text-[#7a6c00] mb-2">
                        Total price, includes all fees
                      </p>

                      {/* Price Distribution Graph */}
                      <div className="h-24 bg-[#fff9e6] rounded-lg mb-4 relative overflow-hidden border border-[#E5C100]">
                        <div className="absolute inset-x-4 bottom-0 flex justify-between items-end h-full">
                          {Array.from({ length: 30 }).map((_, i) => (
                            <div
                              key={i}
                              className="w-[2px] bg-gradient-to-t from-[#FFD700] to-[#D4AF37]"
                              style={{ height: `${Math.random() * 100}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Price Slider */}
                      <input
                        type="range"
                        min="0"
                        max="10000"
                        step="500"
                        value={filters.priceRange[1]}
                        onChange={(e) =>
                          setFilters((prev) => ({
                            ...prev,
                            priceRange: [0, Number(e.target.value)],
                          }))
                        }
                        className="w-full accent-[#D4AF37] mb-2"
                      />

                      {/* Price Input */}
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#7a6c00]">Up to</span>
                        <input
                          type="number"
                          min="0"
                          max="10000"
                          step="500"
                          value={filters.priceRange[1]}
                          onChange={(e) =>
                            setFilters((prev) => ({
                              ...prev,
                              priceRange: [0, Number(e.target.value)],
                            }))
                          }
                          className="flex-1 border border-[#E5C100] rounded-lg py-2 px-3 text-sm text-[#7a6c00] outline-none"
                        />
                        <span className="text-sm text-[#7a6c00]">₹</span>
                      </div>
                    </div>

                    {/* Apply Button */}
                    <button
                      onClick={() => setDrawerType(null)}
                      className="w-full mt-4 py-3 rounded-lg text-white font-semibold transition-colors bg-gradient-to-br from-[#D4AF37] to-[#FFD700]"
                    >
                      Show stays
                    </button>
                  </div>
                )}

                {drawerType === "sort" && (
                  <div className="space-y-4">
                    <button
                      onClick={() => {
                        setSortBy("avgPrice");
                        setSortOrder("asc");
                        setDrawerType(null);
                      }}
                      className={`w-full py-3 rounded-lg border text-[#B68F00] ${sortBy === "avgPrice" && sortOrder === "asc"
                        ? "border-[#FFD700] bg-[#fff9e6]"
                        : "border-[#E5C100]"
                        }`}
                    >
                      Price: Low to High
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("avgPrice");
                        setSortOrder("desc");
                        setDrawerType(null);
                      }}
                      className={`w-full py-3 rounded-lg border text-[#B68F00] ${sortBy === "avgPrice" && sortOrder === "desc"
                        ? "border-[#FFD700] bg-[#fff9e6]"
                        : "border-[#E5C100]"
                        }`}
                    >
                      Price: High to Low
                    </button>
                    <button
                      onClick={() => {
                        setSortBy("avgRating");
                        setSortOrder("desc");
                        setDrawerType(null);
                      }}
                      className={`w-full py-3 rounded-lg border text-[#B68F00] ${sortBy === "avgRating" && sortOrder === "desc"
                        ? "border-[#FFD700] bg-[#fff9e6]"
                        : "border-[#E5C100]"
                        }`}
                    >
                      Rating: High to Low
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default HotelList;
