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
          setUploadedData(response.data); // Ensure the function exists before calling
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
    <div className="p-6 max-w-lg mx-auto bg-gray-900 text-gray-100 rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-center">Upload CSV File</h2>
      <div className="text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer mx-auto"
        />
        <button
          onClick={handleUpload}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
