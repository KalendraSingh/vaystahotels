import React, { useEffect, useState } from "react";
import LoginImgSlider from "../../../components/LoginImgSlider/LoginImgSlider";
import { notification } from "antd";
import { vendorRegister } from "../../../../api/Vendor/AuthApi";
import { Link } from "react-router-dom";
import VendorHeader from "../../Home/VenderHeader";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      notification.error({
        message: "Password Error",
        description: "Password and Confirm Password do not match.",
      });
      return;
    }

    try {
      const res = await vendorRegister(formData);
      if (res.status === 200) {
        notification.success({
          message: res.data.message,
        });
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        notification.error({
          message: "Registration Error",
          description: error.response.data.message,
        });
      } else {
        notification.error({
          message: "Error",
          description: "Something went wrong. Please try again.",
        });
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
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
            to="/vendor-login"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded-lg transition shadow-md"
          >
            Vendor Login
          </Link>
        </div>
      </header>

      <div className="min-h-screen bg-yellow-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-6xl bg-white rounded-xl shadow-lg overflow-hidden grid md:grid-cols-2">
          {/* Left Side - Content */}
          <div className="p-8 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold text-yellow-700">
                Create an Account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Let's get you all set up so you can access your personal
                account.
              </p>

              <form
                onSubmit={handleSubmit}
                className="mt-6 space-y-5 text-sm text-zinc-700"
              >
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="First Name"
                    className="w-1/2 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last Name"
                    className="w-1/2 px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    required
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email address"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Mobile Number"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="mt-1"
                    required
                  />
                  <p className="text-sm text-gray-700">
                    I agree to all the{" "}
                    <Link to="/policy">
                      <span className="text-blue-500 hover:underline">
                        Terms
                      </span>{" "}
                      and{" "}
                      <span className="text-blue-500 hover:underline">
                        Privacy Policies
                      </span>
                    </Link>
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={!formData.agreeTerms}
                  className={`w-full py-3 rounded-md font-semibold text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 ${
                    !formData.agreeTerms ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Create an Account
                </button>
                <p className="text-sm text-center text-yellow-700">
                  Already have an account?{" "}
                  <Link
                    to="/vendor-login"
                    className="font-medium underline hover:text-yellow-800"
                  >
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>

          {/* Right Side - Image Slider */}
          <div className="hidden md:block mr-8">
            <LoginImgSlider />
          </div>
        </div>
      </div>
    </>
  );
};

export default Signup;
