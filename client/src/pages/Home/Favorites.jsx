import { useState, useEffect } from "react";
import { Heart, Trash2 } from "lucide-react";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    // Example: Fetch favorites from localStorage or API
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFavorites);
  }, []);

  const handleRemove = (hotelId) => {
    const updatedFavorites = favorites.filter((hotel) => hotel.id !== hotelId);
    setFavorites(updatedFavorites);
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-4xl mx-auto p-4">
        
        <h1 className="text-2xl font-bold text-[#D4AF37] mb-4 flex items-center gap-2">
          <Heart className="text-[#D4AF37]" /> My Favorites
        </h1>

        {favorites.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-lg">You haven't added any favorites yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {favorites.map((hotel) => (
              <div
                key={hotel.id}
                className="border border-[#E5C100] rounded-2xl p-3 bg-gradient-to-tr from-[#fff9e6] to-[#fff3cc] shadow-md"
              >
                <img
                  src={hotel.image}
                  alt={hotel.name}
                  className="h-40 w-full object-cover rounded-xl mb-3"
                />
                <h2 className="text-lg font-semibold text-[#B68F00]">
                  {hotel.name}
                </h2>
                <p className="text-gray-600 text-sm">{hotel.location}</p>
                <p className="text-[#7a6c00] font-medium mt-2">
                  ₹ {hotel.price} / night
                </p>
                <div className="flex justify-between items-center mt-3">
                  <button className="text-sm text-blue-600 font-medium hover:underline">
                    View Details
                  </button>
                  <button
                    onClick={() => handleRemove(hotel.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
