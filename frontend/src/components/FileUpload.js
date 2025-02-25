import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const FileUpload = ({ setUploadedData }) => {
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    axios
      .post("http://127.0.0.1:5000/api/upload", formData)
      .then((response) => {
        if (setUploadedData) {
          setUploadedData(response.data);
          navigate("/dashboard");
        } else {
          console.error("setUploadedData is not defined");
          alert("File uploaded but cannot update data.");
        }
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        alert("File upload failed!");
      });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-gray-800 text-gray-100 rounded-xl shadow-lg space-y-4 mt-6">
      <h2 className="text-2xl font-bold text-center mb-6">Upload CSV File</h2>
      <div className="text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 
                   file:rounded-full file:border-0 file:text-sm file:font-semibold
                   file:bg-emerald-50 file:text-emerald-700
                   hover:file:bg-emerald-100 cursor-pointer
                   border rounded-lg border-gray-600 p-2"
        />
        <button
          onClick={handleUpload}
          className="mt-6 px-6 py-2 bg-emerald-600 text-white rounded-lg 
                   hover:bg-emerald-700 transition-colors duration-200"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUpload;