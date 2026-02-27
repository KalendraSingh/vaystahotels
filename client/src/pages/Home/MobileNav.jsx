import { Home, Compass, Heart, BookMarked } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MobileNav() {
  const location = useLocation();
  const [activeNav, setActiveNav] = useState("");

  useEffect(() => {
    if (location.pathname === "/") setActiveNav("home");
    else if (location.pathname === "/hotels") setActiveNav("discover");
    else if (location.pathname === "/favorites") setActiveNav("favorite");
    else if (location.pathname === "/my-booking") setActiveNav("bookings");
  }, [location.pathname]);

  return (
    <div className="fixed bottom-2 px-4 mx-auto w-full md:hidden z-50">
      <div className="flex justify-around py-2 px-4 backdrop-blur-xl rounded-full shadow-lg bg-white/90 border border-[#FFD700]/40">
        {[
          { icon: Home, label: "Home", name: "home", path: "/" },
          { icon: Compass, label: "Discover", name: "discover", path: "/hotels" },
          { icon: Heart, label: "Favorite", name: "favorite", path: "/favorites" },
          { icon: BookMarked, label: "Bookings", name: "bookings", path: "/my-booking" },
        ].map(({ icon: Icon, label, name, path }) => (
          <Link
            key={name}
            to={path}
            onClick={() => setActiveNav(name)}
            className={`flex flex-col items-center transition-colors duration-300 ${
              activeNav === name ? "text-[#FFD700]" : "text-gray-500 hover:text-[#FFD700]"
            }`}
          >
            <Icon
              className={`w-5 h-5 ${activeNav === name ? "stroke-2" : "stroke-1.5"}`}
            />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
