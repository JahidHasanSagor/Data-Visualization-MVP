import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FileUpload = ({ setUploadedData }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/upload", formData);
      if (setUploadedData) {
        setUploadedData(response.data);
        navigate("/dashboard"); // This will navigate to the dashboard route
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("File upload failed! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto bg-white rounded-2xl shadow-lg space-y-6 mt-8 border border-gray-100">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-[#9747FF] to-[#E93D82] bg-clip-text text-transparent">
          Import Your Data
        </h2>
        <p className="text-gray-500">Upload your CSV file to start visualizing your data</p>
      </div>
      
      <div className="space-y-6">
        <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-[#9747FF] transition-colors">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer space-y-4 flex flex-col items-center"
          >
            <svg className="w-12 h-12 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <div className="space-y-2">
              <p className="text-gray-600 font-medium">
                {file ? file.name : "Click to upload or drag and drop"}
              </p>
              <p className="text-sm text-gray-500">CSV files only</p>
            </div>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full py-3 px-6 rounded-xl font-medium text-white 
            ${loading || !file 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#9747FF] to-[#E93D82] hover:opacity-90 transition-opacity'
            }`}
        >
          {loading ? "Uploading..." : "Upload and Analyze"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;