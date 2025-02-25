import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";
import DashboardLayout from "./components/DashboardLayout";

function App() {
  const [uploadedData, setUploadedData] = useState(null);

  const DashboardWithLayout = ({ children }) => (
    <DashboardLayout>
      <Dashboard uploadedData={uploadedData} />
      {children}
    </DashboardLayout>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload setUploadedData={setUploadedData} />} />
        <Route path="/dashboard" element={<DashboardWithLayout />} />
        <Route path="/preset-widget" element={
          <DashboardWithLayout>
            {/* Add Preset Widget specific content here */}
          </DashboardWithLayout>
        } />
        <Route path="/custom-widget" element={
          <DashboardWithLayout>
            {/* Add Custom Widget specific content here */}
          </DashboardWithLayout>
        } />
        <Route path="/static-widget" element={
          <DashboardWithLayout>
            {/* Add Static Widget specific content here */}
          </DashboardWithLayout>
        } />
        <Route path="/widget-bundle" element={
          <DashboardWithLayout>
            {/* Add Widget Bundle specific content here */}
          </DashboardWithLayout>
        } />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;