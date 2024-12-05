import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBoxes, FaList, FaWarehouse, FaUser, FaCog, FaArrowDown, FaArrowUp } from "react-icons/fa";

const Sidebar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [showAuth, setShowAuth] = useState(false);  // To toggle between Sign In and Sign Up
  const navigate = useNavigate();

  const toggleAuth = () => {
    setShowAuth(!showAuth);
  };

  // Logout function to clear the token and redirect to login page
  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove JWT token from localStorage
    navigate("/login"); // Redirect to the login page
  };

  return (
    <aside
      className={`bg-gradient-to-br from-teal-600 to-teal-800 text-white shadow-xl fixed top-16 ${
        isSidebarOpen ? "w-72" : "w-20"
      } transition-all duration-500 ease-in-out h-[calc(100vh-4rem)]`}
    >
      {/* Sidebar Header with Logo */}
      <div className="flex items-center justify-between p-6 border-b border-teal-500">
        <img
          src="https://via.placeholder.com/50" // Replace this with your logo URL
          alt="Company Logo"
          className={`h-10 w-10 rounded-full ${isSidebarOpen ? "block" : "hidden"}`}
        />
        <h1
          className={`font-bold text-2xl ${isSidebarOpen ? "block" : "hidden"}`}
        >
          Dashboard
        </h1>
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="text-white focus:outline-none transform hover:scale-110 transition-transform"
        >
          {isSidebarOpen ? (
            <span className="text-2xl">◀</span>
          ) : (
            <span className="text-2xl">▶</span>
          )}
        </button>
      </div>

      {/* Sidebar Navigation (Scrollable Content) */}
      <nav className="mt-4 overflow-y-auto h-[calc(100vh-4rem)]">
        <ul className="space-y-6">
          <li
            className="flex items-center p-4 hover:bg-teal-700 rounded-xl cursor-pointer transition-all duration-300"
            title="Dashboard"
          >
            <Link to="/" className="flex items-center w-full">
              <FaWarehouse size={22} className="mr-4" />
              {isSidebarOpen && (
                <span className="font-medium text-lg transition-opacity">{`Dashboard`}</span>
              )}
            </Link>
          </li>
          <li
            className="flex items-center p-4 hover:bg-teal-700 rounded-xl cursor-pointer transition-all duration-300"
            title="Create Product"
          >
            <Link to="/add_product" className="flex items-center w-full">
              <FaBoxes size={22} className="mr-4" />
              {isSidebarOpen && (
                <span className="font-medium text-lg transition-opacity">{`Create Product`}</span>
              )}
            </Link>
          </li>
          <li
            className="flex items-center p-4 hover:bg-teal-700 rounded-xl cursor-pointer transition-all duration-300"
            title="Product List"
          >
            <Link to="/table" className="flex items-center w-full">
              <FaList size={22} className="mr-4" />
              {isSidebarOpen && (
                <span className="font-medium text-lg transition-opacity">{`Product List`}</span>
              )}
            </Link>
          </li>

          {/* Logout Link */}
          <li
            className="flex items-center p-4 hover:bg-teal-700 rounded-xl cursor-pointer transition-all duration-300"
            title="Logout"
          >
            <button onClick={handleLogout} className="flex items-center w-full">
              <FaUser size={22} className="mr-4" />
              {isSidebarOpen && (
                <span className="font-medium text-lg transition-opacity">{`Logout`}</span>
              )}
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
