import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../../contexts/UIContext";
import { UploadService } from "../../services/api.service";

const uploadService = new UploadService();

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const { setLoading, showSuccess, showError } = useUI();
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      showError("Please select a file first!");
      return;
    }

    setLoading('file-upload', true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const response = await uploadService.post('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      showSuccess("File uploaded successfully!");
      navigate("/dashboard"); // Navigate to the dashboard route
    } catch (error) {
      console.error("Error uploading file:", error);
      showError(error.response?.data?.error || "File upload failed! Please try again.");
    } finally {
      setLoading('file-upload', false);
    }
  };

  const isLoading = useUI().isLoading('file-upload');

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
          disabled={isLoading || !file}
          className={`w-full py-3 px-6 rounded-xl font-medium text-white 
            ${isLoading || !file 
              ? 'bg-gray-300 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#9747FF] to-[#E93D82] hover:opacity-90 transition-opacity'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Uploading...
            </div>
          ) : "Upload and Analyze"}
        </button>
      </div>
    </div>
  );
};

export default FileUpload;