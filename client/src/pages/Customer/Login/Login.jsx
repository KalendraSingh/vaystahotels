import React, { useEffect, useState } from 'react';
import { IoMdEyeOff } from 'react-icons/io';
import { IoEye } from 'react-icons/io5';
import LoginImgSlider from '../../../components/LoginImgSlider/LoginImgSlider';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { userLogin } from '../../../../api/Customer/AuthApi';
import { useAuth } from '../../../Hooks/useAuth';
import { notification } from 'antd';
import ButtonSpinner from '../../../components/ButtonSpinner/ButtonSpinner';


const Login = () => {
  const location = useLocation();
  const prevPath = location.state?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { auth, setAuth, persist, setPersist } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const allData = {
      email,
      password,
    };

    try {
      const res = await userLogin(allData);
      if (res.status === 200) {
        setAuth(res.data);
        setLoading(false);
        notification.success({
          message: 'Login Successfully!',
        });
        navigate(location.state?.from || '/');
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      notification.error({
        message: error.response.data.message,
      });
    }
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
            to="/signup"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded-lg transition shadow-md"
          >
            Register 
          </Link>
        </div>
      </header>
 <main className="min-h-screen bg-[#fffdf5] flex items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Left Section with image and text */}
        <div className="hidden md:flex flex-col justify-center p-10 md:w-1/2 bg-[#fff8e8]">
          <h2 className="text-3xl md:text-4xl font-bold text-[#7A4C00] mb-4">
            Welcome Back!
          </h2>
          <p className="text-zinc-700 mb-6">
            Log in to access your customer account and manage your bookings.
          </p>
          <img
            src="https://plus.unsplash.com/premium_photo-1677288649820-a7bd079d102e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dG91cmlzdHxlbnwwfHwwfHx8MA%3D%3D" // 🖼 Replace with your own path
            alt="Customer Illustration"
            className="rounded-xl  shadow-md"
          />
        </div>

        {/* Right Login Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12">
          <h1 className="text-2xl font-bold text-zinc-800 mb-2">Customer Login</h1>
          <p className="text-zinc-600 mb-6 text-sm">Log in to your customer account</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="border border-zinc-300 rounded-md p-3">
              <input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
              />
            </div>

            <div className="border border-zinc-300 rounded-md p-3 flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-500"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <IoEye className="w-5 h-5" /> : <IoMdEyeOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="text-right">
              <Link to="/forgot-password" className="text-blue-500 text-sm hover:underline">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-br from-[#D4AF37] to-[#FFD700] text-[#0D0D0D] font-semibold py-3 rounded-md hover:from-[#E5C100] hover:to-[#FFD700] transition"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-orange-600 mt-6">
            Don’t have an account?{' '}
            <Link to="/signup" className="font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </main>
    </>
  );
}

export default Login;
