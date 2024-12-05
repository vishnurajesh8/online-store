import React, { useState } from "react";
import { FaBell } from "react-icons/fa";
import { MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 left-0 w-full flex items-center justify-between bg-white text-black px-6 py-4 shadow-md z-50">
      {/* Left: Company Logo and Name */}
      <div className="flex items-center space-x-2">
        <img
          src="https://via.placeholder.com/40"
          alt="Company Logo"
          className="h-8 w-8 rounded-full"
        />
        <h1 className="text-lg font-semibold">YourCompany</h1>
      </div>

      {/* Center: Email Input */}
      <div className="flex-1 pl-10">
        <input
          type="email"
          placeholder="Enter your email"
          className="w-96 bg-gray-200 text-black px-4 py-2 rounded-lg focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      {/* Right: Icons */}
      <div className="flex items-center space-x-4">
        {/* Bell Icon */}
        <button
          className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 focus:outline-none"
          title="Notifications"
        >
          <FaBell size={20} />
        </button>

        {/* Night Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300 focus:outline-none"
          title="Toggle Night Mode"
        >
          {darkMode ? (
            <MdOutlineLightMode size={20} />
          ) : (
            <MdOutlineDarkMode size={20} />
          )}
        </button>

        {/* Profile Image */}
        <img
          src="https://via.placeholder.com/40"
          alt="User"
          className="h-8 w-8 rounded-full border-2 border-blue-500"
        />
      </div>
    </nav>
  );
};

export default Navbar;
