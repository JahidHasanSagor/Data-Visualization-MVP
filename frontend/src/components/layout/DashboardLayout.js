import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <Navbar 
        onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} 
        isDashboard={true}
      />
      <Sidebar isOpen={isSidebarOpen} />
      <main 
        className={`
          transition-all duration-300 pt-16
          ${isSidebarOpen ? 'ml-64' : 'ml-0'}
        `}
      >
        <div className="px-8 py-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;