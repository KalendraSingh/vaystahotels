import React, { useState, useEffect } from "react";

import {
  Search,
  Heart,
  Settings,
  LogOut,
  Home,
  Compass,
  BookMarked,
  MapPin,
  Menu,
} from "lucide-react";
import { FaUser } from "react-icons/fa6";
import { LuBuilding2 } from "react-icons/lu";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const navitems = [
  { name: "property", label: "List Property", path: "/vendor-login" },
  { name: "hotel", label: "Hotels", path: "/hotels" },
  { name: "contact", label: "Support", path: "/contact" },
  { name: "Cities", label: "Cities", path: "/allCities" },
  { name: "Signup", label: "Sign in", path: "/login" },
];

function Hero() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchInput, setSearchInput] = useState({
    destination: "",
    hotel: "",
  });
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigate = useNavigate();

  const handleSearch = () => {
    const destination = searchInput.destination.trim();
    const hotel = searchInput.hotel.trim();

    // Build query params
    const params = new URLSearchParams();
    if (destination) params.append("destination", destination);
    if (hotel) params.append("hotel", hotel);

    navigate(`/hotels?${params.toString()}`);
  };

  return (
    <>
      <div className="bg-[#ffea94]">
        {/* Navigation */}
        <nav
          className={`fixed w-full z-50 transition-all duration-300 ${
            isScrolled
              ? "bg-[#0f172a]/95 backdrop-blur-md shadow-lg"
              : "bg-transparent"
          }`}
        >
          <div className="max-w-[900px] mx-auto px-4 py-0 flex items-center justify-between">
            {/* Logo */}
            <Link
              to="/"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              <div className="flex items-center">
                <img
                  src="/vaystaF.png"
                  alt="Company logo"
                  className="w-[45px] md:w-[50px] object-contain mr-4"
                />
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex w-4/5 flex-1 justify-center relative h-[50px]">
              <img
                src="Hero/nav.svg"
                alt="nav background"
                className="absolute h-full top-0 left-0 z-0 object-contain"
              />
              <div className="flex gap-10 items-center z-10 h-full">
                {navitems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setActiveNav(item.name)}
                    className={`relative uppercase text-sm font-semibold transition-colors duration-300 ${
                      isScrolled ? "text-[#E5C100]" : "text-black"
                    } hover:text-[#E5C100]`}
                  >
                    {item.label}
                    <span
                      className={`absolute bottom-0 left-0 w-full h-0.5 transform origin-left transition-transform duration-300 ${
                        activeNav === item.name ? "scale-x-100" : "scale-x-0"
                      } ${isScrolled ? "bg-[#FFD700]" : "bg-[#ffea94]"}`}
                    />
                  </Link>
                ))}
              </div>
            </div>

            {/* Profile Icon */}
            <div className="hidden md:flex items-center space-x-2 relative">
              <button
                id="profile-dropdown-button"
                onClick={() => setIsProfileOpen((prev) => !prev)}
                className={`p-2 rounded-full transition duration-300 shadow-md focus:outline-none ${
                  isScrolled
                    ? "bg-[#FFD700] text-[#0D0D0D] hover:bg-[#E5C100]"
                    : "bg-[#D4AF37] text-white hover:bg-[#FFD700]/90"
                }`}
                aria-haspopup="true"
                aria-expanded={isProfileOpen}
                aria-controls="profile-dropdown-menu"
              >
                <FaUser className="w-5 h-5" />
              </button>

              {isProfileOpen && (
                <div
                  id="profile-dropdown-menu"
                  className="absolute top-full left-1/2 mt-2 w-58 bg-white text-black rounded-xl shadow-2xl
                     z-50 border border-[#FFD700]/40 transition-all duration-300 animate-fadeInDown
                     -translate-x-1/2"
                  role="menu"
                  aria-label="Profile options"
                >
                  <div className="px-4 py-3 border-b border-[#FFD700]/20">
                    <p className="text-sm font-bold text-[#FFD700]">
                      Vaysta OPC Pvt Ltd
                    </p>
                    <p className="text-xs text-gray-400">
                      vaysta.contact@gmail.com
                    </p>
                  </div>
                  <Link
                    to="/customer-profile"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-[#FFD700]/10 transition-colors"
                    role="menuitem"
                  >
                    <Settings className="w-4 h-4" />{" "}
                    <span className="text-sm">Profile Settings</span>
                  </Link>
                  <Link
                    to="/my-booking"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-[#FFD700]/10 transition-colors"
                    role="BookMarked"
                  >
                    <BookMarked className="w-4 h-4" />{" "}
                    <span className="text-sm">My Bokking</span>
                  </Link>
                  {/* <button
                    href="#"
                    className="flex items-center gap-2 px-4 py-3 hover:bg-[#FFD700]/10 transition-colors"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" /> <span className="text-sm">Logout</span>
                  </button> */}
                </div>
              )}
            </div>

            {/* Mobile Menu Icon */}
            {/* <div className="md:hidden">
              <Menu className="text-black w-6 h-6" />
            </div> */}
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="fixed bottom-2 px-4 mx-auto w-full md:hidden z-50">
          <div className="flex justify-around py-2 px-4 backdrop-blur-xl rounded-full shadow-lg bg-white/90 border border-[#FFD700]/40">
            {[
              { icon: Home, label: "Home", name: "home" },
              {
                icon: Compass,
                label: "Discover",
                name: "discover",
                path: "/hotels",
              },
              { icon: Heart, label: "Favorite", name: "favorite" },
              {
                icon: BookMarked,
                label: "Bookings",
                name: "bookings",
                path: "/my-booking",
              },
            ].map(({ icon: Icon, label, name, path }) => (
              <Link
                key={name}
                to={path}
                onClick={() => setActiveNav(name)}
                className={`flex flex-col items-center transition-colors duration-300 ${
                  activeNav === name
                    ? "text-[#FFD700]"
                    : "text-gray-500 hover:text-[#FFD700]"
                }`}
              >
                <Icon
                  className={`w-5 h-5 ${
                    activeNav === name ? "stroke-2" : "stroke-1.5"
                  }`}
                />
                <span className="text-xs mt-1 font-medium">{label}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Hero Section */}
        <section className="relative h-screen md:h-[80vh] overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img
              src="https://resize.indiatvnews.com/en/centered/newbucket/1200_675/2025/02/ram-temple-in-ayodhya-1738681351.webp"
              alt="Hotel Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Content Container */}
          <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex flex-col justify-center items-center text-center">
            <h1 className="text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4 drop-shadow-lg">
              Stay Smart, <span className=" text-[#E5C100] ">Travel Easy</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-xl mb-8 drop-shadow">
              Discover the Comfort You Deserve Today!
            </p>

            {/* Compact Search Bar */}
            <div className="md:px-6 w-full md:max-w-3xl">
              <div className="bg-white/90 backdrop-blur-md rounded-2xl px-4 py-4 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                  {/* Location Input */}
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Location"
                      value={searchInput.destination}
                      onChange={(e) =>
                        setSearchInput({
                          ...searchInput,
                          destination: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-gray-800 transition"
                    />
                  </div>

                  {/* Hotel Name Input */}
                  <div className="relative group">
                    <LuBuilding2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input
                      type="text"
                      placeholder="Hotel Name"
                      value={searchInput.hotel}
                      onChange={(e) =>
                        setSearchInput({
                          ...searchInput,
                          hotel: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#FFD700] text-gray-800 transition"
                    />
                  </div>

                  {/* Search Button */}
                  <button
                    onClick={handleSearch}
                    className="w-full bg-gradient-to-r from-[#FFD700] to-[#E5C100] text-black font-semibold py-2 rounded-md flex items-center justify-center gap-2 hover:shadow-lg hover:brightness-110 transition-all duration-200"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Hero;
