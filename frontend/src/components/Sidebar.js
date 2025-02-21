import React from "react";
import { FaHome, FaChartBar, FaFileUpload, FaFilePdf, FaSignOutAlt } from "react-icons/fa";

const Sidebar = ({ isOpen }) => {
  return (
    <div className={`bg-gray-800 text-white h-screen p-5 transition-all ${isOpen ? "w-64" : "w-16"} duration-300`}>
      <ul className="space-y-6">
        <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-400">
          <FaHome className="text-xl" />
          {isOpen && <span>Dashboard</span>}
        </li>
        <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-400">
          <FaChartBar className="text-xl" />
          {isOpen && <span>Analytics</span>}
        </li>
        <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-400">
          <FaFileUpload className="text-xl" />
          {isOpen && <span>Upload Data</span>}
        </li>
        <li className="flex items-center space-x-4 cursor-pointer hover:text-blue-400">
          <FaFilePdf className="text-xl" />
          {isOpen && <span>Reports</span>}
        </li>
        <li className="flex items-center space-x-4 cursor-pointer text-red-400 hover:text-red-600">
          <FaSignOutAlt className="text-xl" />
          {isOpen && <span>Logout</span>}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
