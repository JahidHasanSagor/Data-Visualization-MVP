import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import DataTable from "./DataTable";

ChartJS.register(BarElement, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const Dashboard = ({ uploadedData }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      const keys = Object.keys(uploadedData[0] || {});
      if (keys.length < 2) return;

      const labels = uploadedData.map((item) => item[keys[0]] || "Unknown");
      const values = uploadedData.map((item) => parseFloat(item[keys[1]]) || 0);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: keys[1] || "Data",
            data: values,
            backgroundColor: "#4ADE80",
            borderColor: "#22C55E",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [uploadedData]);

  if (!uploadedData || uploadedData.length === 0) {
    return <p className="text-gray-400 text-center">No data available. Please upload a CSV file.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </header>

      <DataTable data={uploadedData} />

      {chartData && (
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-2xl font-bold">${chartData.datasets[0].data.reduce((a, b) => a + b, 0)}</p>
            <Line data={chartData} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Total Clicks</h3>
            <p className="text-2xl font-bold">{chartData.datasets[0].data.length * 100}</p>
            <Bar data={chartData} />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">Conversions</h3>
            <p className="text-2xl font-bold">{Math.round(chartData.datasets[0].data.reduce((a, b) => a + b, 0) / chartData.datasets[0].data.length)}</p>
            <Line data={chartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
