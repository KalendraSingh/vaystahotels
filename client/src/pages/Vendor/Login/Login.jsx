import React, { useEffect, useState } from "react";
import { IoMdEyeOff } from "react-icons/io";
import { IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { vendorLogin } from "../../../../api/Vendor/AuthApi";
import { notification } from "antd";
import { useAuth } from "../../../Hooks/useAuth";

// At the top of your component
import { useRef } from "react";

const VendorLoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { setVendorAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await vendorLogin({ email, password });
      if (res.status === 200) {
        setVendorAuth(res.data);
        notification.success({ message: "Vendor login successful!" });
        navigate("/vendor-dashboard");
      }
    } catch (error) {
      notification.error({
        message: error?.response?.data?.message || "Login failed",
      });
    }
  };

  const loginRef = useRef(null);
  const scrollToLogin = () => {
    loginRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Company Logo */}
      <header className="w-full sticky top-0 z-50 bg-white shadow-md px-4 sm:px-6 lg:px-8 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo and Title */}
          <Link to="/" className="flex items-center ml-4 space-x-3">
            <img
              src="/vaystaF.png"
              alt="Company logo"
              className="w-14 sm:w-12 md:w-16 object-contain mr-4"
            />
            <span className="hidden sm:inline text-xl sm:text-2xl font-bold text-yellow-800">
              Vaysta Hotels
            </span>
          </Link>

          {/* Register Button */}
          <Link
            to="/vendor-signup"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded-lg transition shadow-md"
          >
            Register Property
          </Link>
        </div>
      </header>

      <main className="bg-[#fffaf0] min-h-screen py-4 px-4">
        {/* Login Card */}
        <section ref={loginRef}>
          <div className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 border border-yellow-100 mt-4">
            {/* LEFT PANEL - Promo Updated */}
            <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-[#fffaf0] to-[#fff2cc] p-10">
              <div>
                <h2 className="text-4xl font-extrabold text-yellow-700 leading-snug mb-4">
                  List your property with Vaysta Hotels
                </h2>
                <p className="text-gray-700 text-base">
                  Join thousands of vendors earning income through
                  <span className="text-yellow-700 font-medium">
                    {" "}
                    Vaysta Hotels
                  </span>{" "}
                  — Whether it's a homestay, hotel, or resort — reach the right
                  audience effortlessly.
                </p>
              </div>

              <img
                src="https://plus.unsplash.com/premium_photo-1661963428055-4b25a7ebd3a9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDMzfHx8ZW58MHx8fHx8"
                alt="Comfortable Room"
                className="w-full mt-10 rounded-xl shadow-lg object-cover"
              />
            </div>

            {/* RIGHT PANEL - Login Form (unchanged) */}
            <div className="w-full p-8 md:p-12 flex flex-col justify-center bg-white bg-opacity-95">
              <h1 className="text-3xl font-bold text-zinc-900 mb-2">
                Vendor Login
              </h1>
              <p className="text-sm text-zinc-500 mb-8">
                Log in to manage and grow your property business with Vaysta.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex flex-col">
                  <label htmlFor="email" className="text-sm text-zinc-600 mb-1">
                    Business Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="vendor@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                </div>

                <div className="flex flex-col relative">
                  <label
                    htmlFor="password"
                    className="text-sm text-zinc-600 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-10 text-zinc-500 hover:text-yellow-600"
                  >
                    {showPassword ? (
                      <IoEye size={22} />
                    ) : (
                      <IoMdEyeOff size={22} />
                    )}
                  </button>
                </div>

                <div className="text-right">
                  <Link
                    to="/vendor-forgot-password"
                    className="text-sm text-blue-500 hover:underline"
                  >
                    Forgot Password?
                  </Link>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white py-3 rounded-lg font-semibold shadow-md transition"
                >
                  Login & Manage Listings
                </button>

                <p className="text-center text-sm text-gray-600">
                  New to ExpoStays?{" "}
                  <Link
                    to="/vendor-signup"
                    className="text-yellow-600 hover:underline font-medium"
                  >
                    Register Your Property
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="max-w-7xl mx-auto text-center py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-800 ">
            Earn more from your property with Vaysta
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mt-4 mx-auto">
            Whether it's a homestay, villa, or hotel — join Vaysta hotels and
            reach travelers across the globe.
          </p>
          <img
            src="https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1400&q=80"
            alt="Host Banner"
            className="w-full max-h-[400px] object-cover rounded-xl mt-8 shadow"
          />
        </section>

        {/* Airbnb-style Benefits Grid */}
        <section className="bg-white py-20 px-4">
  <h2 className="text-3xl md:text-4xl font-bold text-center text-[#D4AF37] mb-14">
    Why Partner With Us
  </h2>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
    {[
      {
        title: "Low Commission, Higher Earnings",
        desc: "Maximize your profits with our industry-low commission rates.",
        img: "https://plus.unsplash.com/premium_photo-1680792417617-a2051b2814a5?w=900&auto=format&fit=crop&q=80",
      },
      {
        title: "Maximum Visibility",
        desc: "Get featured on our homepage, ads, and travel partner listings.",
        img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
      },
      {
        title: "Fast & Easy Onboarding",
        desc: "Get listed within hours with digital documentation.",
        img: "https://images.unsplash.com/photo-1640161339667-88fc7a1135b0?q=80&w=1170&auto=format&fit=crop",
      },
      {
        title: "Flexible Pricing & Calendar",
        desc: "Update prices and availability anytime from your dashboard.",
        img: "https://images.unsplash.com/photo-1726066012751-2adfb5485977?w=900&auto=format&fit=crop&q=80",
      },
      {
        title: "List Any Property Type",
        desc: "Villas, homestays, hostels, or apartments — all are welcome.",
        img: "https://images.unsplash.com/photo-1494380982332-dfc36fbfece6?w=900&auto=format&fit=crop&q=80",
      },
      {
        title: "24/7 Dedicated Support",
        desc: "We’re always available to help you with anything you need.",
        img: "https://plus.unsplash.com/premium_photo-1723802464689-411ae08ad38e?w=900&auto=format&fit=crop&q=80",
      },
    ].map((card, index) => (
      <div
        key={index}
        className="relative group h-80 sm:h-96 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
      >
        <img
          src={card.img}
          alt={card.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/90 transition duration-300" />

        {/* Text Content */}
        <div className="absolute bottom-0 p-6 text-white z-10">
          <h3 className="text-lg md:text-xl font-bold mb-1">{card.title}</h3>
          <p className="text-sm text-gray-200">{card.desc}</p>
        </div>
      </div>
    ))}
  </div>
</section>


        <section className="relative mt-20 rounded-xl overflow-hidden shadow-xl mb-20">
          {/* Background Image */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80"
            alt="Host Property Background"
            className="w-full h-[400px] object-cover "
          />

          {/* Overlay Content */}
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Manage Your Property With Ease
            </h2>
            <p className="text-lg text-gray-200 mb-6 max-w-2xl">
              Log in to your partner dashboard to update listings, track
              bookings, and connect with thousands of travelers.
            </p>
            <button
              onClick={scrollToLogin}
              className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
            >
              Vendor Login
            </button>
          </div>
        </section>

        {/* Other Services Section */}
        <section className="py-12 px-4 bg-white rounded-2xl shadow-xl">
          <h2 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center">
            Our Other Services
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
            {[
              {
                title: "Adventure",
                img: "https://images.unsplash.com/photo-1528543606781-2f6e6857f318?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWR2ZW50dXJlfGVufDB8fDB8fHww",
                paid: true,
              },
              {
                title: "MICE",
                img: "https://images.unsplash.com/photo-1616431505321-8adf35f76a58?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGFkdmVudHVyZSUyMHRyYXZlbHxlbnwwfHwwfHx8MA%3D%3D&ixlib=rb-4.1.0&q=60&w=3000",
              },
              {
                title: "Cruise",
                img: "https://images.unsplash.com/photo-1511316695145-4992006ffddb?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q3J1aXNlfGVufDB8fDB8fHww",
                paid: true,
              },
              {
                title: "Villas & Stays",
                img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
              },
              {
                title: "Luxury Trains",
                img: "https://images.unsplash.com/photo-1583997052384-115251bff5cb?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                paid: true,
              },
              {
                title: "Monuments",
                img: "https://plus.unsplash.com/premium_photo-1667516408599-67d72068eaa9?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YWR2ZW50dXJlJTIwdHJhdmVsfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
              },
              {
                title: "Activities",
                img: "https://images.unsplash.com/photo-1618083707368-b3823daa2726?fm=jpg&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YWR2ZW50dXJlJTIwdHJhdmVsfGVufDB8fDB8fHww&ixlib=rb-4.1.0&q=60&w=3000",
              },
              {
                title: "Gift Voucher",
                img: "https://plus.unsplash.com/premium_photo-1728613749980-cd3e758183df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDE2fHx8ZW58MHx8fHx8",
                paid: true,
              },
              {
                title: "Freight",
                img: "https://images.unsplash.com/photo-1596475522275-4c86d9dd84d3?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RnJlaWdodCUyMExvZ2lzdGljcyUyMGFuZCUyMGNhcmdvJTIwc29sdXRpb25zfGVufDB8fDB8fHww",
              },
            ].map((service, index) => (
              <div
                key={index}
                className="relative rounded-xl overflow-hidden group shadow-md border border-gray-200"
              >
                <img
                  src={service.img}
                  alt={service.title}
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 flex flex-col justify-end">
                  <h3 className="text-white text-lg font-semibold">
                    {service.title}
                  </h3>
                  {service.paid && (
                    <span className="text-xs text-yellow-300 font-semibold mb-1">
                      Registration Fee ₹499
                    </span>
                  )}
                  <button className="text-sm text-white underline underline-offset-2 hover:text-[#FFD700] transition">
                    Plan my Trip →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-white py-16 mt-24">
          <div className="max-w-7xl mx-auto px-6 md:px-12 grid md:grid-cols-2 gap-10 items-center">
            {/* Left: Hosting Image */}
            <div className="w-full">
              <img
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWwlMjByb29tfGVufDB8fDB8fHww"
                alt="Host Property"
                className="rounded-3xl shadow-xl w-full object-cover"
              />
            </div>

            {/* Right: Text + CTA */}
            <div className="text-center md:text-left">
              <h2 className="text-4xl md:text-5xl font-extrabold text-[#B68F00] mb-4 leading-snug">
                Start Hosting Today
              </h2>
              <p className="text-lg text-[#4A3F00] mb-6 max-w-xl">
                Turn your spare room, villa, or hotel into an earning
                opportunity. Join{" "}
                <span className="font-semibold text-[#FFD700]">ExpoStays</span>{" "}
                — a growing network of property owners trusted by thousands of
                travelers.
              </p>
              <Link
                to="/vendor-signup"
                className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-black font-semibold py-3 px-8 rounded-lg transition transform hover:scale-105"
              >
                Register Your Property
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default VendorLoginPage;
