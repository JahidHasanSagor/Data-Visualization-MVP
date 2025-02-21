import React, { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard"; // Main content area

const DashboardLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

        {/* Main Content */}
        <main className="p-6 bg-gray-900 text-white flex-1 overflow-auto">
          <Dashboard />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
