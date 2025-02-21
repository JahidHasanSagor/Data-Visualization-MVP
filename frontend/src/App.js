import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FileUpload from "./components/FileUpload";
import Dashboard from "./components/Dashboard";

function App() {
  const [uploadedData, setUploadedData] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<FileUpload setUploadedData={setUploadedData} />} />
        <Route path="/dashboard" element={<Dashboard uploadedData={uploadedData} />} />
      </Routes>
    </Router>
  );
}

export default App;
