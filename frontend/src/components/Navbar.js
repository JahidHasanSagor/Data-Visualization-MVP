import React from "react";
import { FaBell, FaUserCircle, FaCog, FaBars } from "react-icons/fa";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      {/* Left side - Menu button & logo */}
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="text-xl focus:outline-none">
          <FaBars />
        </button>
        <h1 className="text-2xl font-bold">My Dashboard</h1>
      </div>

      {/* Right side - Icons */}
      <div className="flex items-center space-x-4">
        <FaBell className="text-xl cursor-pointer" />
        <FaCog className="text-xl cursor-pointer" />
        <FaUserCircle className="text-2xl cursor-pointer" />
      </div>
    </nav>
  );
};

export default Navbar;
