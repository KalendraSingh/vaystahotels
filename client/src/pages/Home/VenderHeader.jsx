import React from 'react'
import { Link } from 'react-router-dom'
function VenderHeader() {
  return (
    
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
            to="/login"
            className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white text-sm sm:text-base font-medium py-2 px-4 sm:px-6 rounded-lg transition shadow-md"
          >
            Login 
          </Link>
        </div>
      </header>
     
  )
}

export default VenderHeader