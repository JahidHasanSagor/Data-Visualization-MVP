import React, { useState } from "react";
import axios from "axios";
import DataTable from "./DataTable";
import ChartComponent from "./Chart";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [data, setData] = useState(null);

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
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        console.error("Error uploading file:", error);
        alert("File upload failed!");
      });
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold">Upload CSV File</h2>
      <input type="file" accept=".csv" onChange={handleFileChange} className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer" />
      <button onClick={handleUpload} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 !important">
        Upload
      </button>


      {data && <DataTable data={data} />}
      {data && <ChartComponent data={data} />}
    </div>

  );

};

//css added for the file upload
export default FileUpload;
