import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ uploadedData, dateRange }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      let filteredData = uploadedData;

      // Filter by date range if available
      if (dateRange?.[0] && dateRange?.[1]) {
        filteredData = uploadedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= dateRange[0] && itemDate <= dateRange[1];
        });
      }

      const dataKeys = Object.keys(filteredData[0] || {});
      const labels = filteredData.map((item) => item[dataKeys[0]] || "Unknown");
      const values = filteredData.map((item) => parseFloat(item[dataKeys[1]]) || 0);

      setChartData({
        labels: labels,
        datasets: [
          {
            label: dataKeys[1] || "Data",
            data: values,
            backgroundColor: "#4ADE80",
            borderColor: "#22C55E",
            borderWidth: 1,
          },
        ],
      });
    }
  }, [uploadedData, dateRange]);

  if (!uploadedData || uploadedData.length === 0) {
    return (
      <p className="text-gray-400 text-center">
        No data available. Please upload a CSV file.
      </p>
    );
  }

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <div className="bg-slate-50 p-6">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
        <div className="text-sm text-gray-600">
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </header>

      {chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Card 1 - Total Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
            <p className="text-3xl font-bold my-3 text-emerald-600">
              ${chartData.datasets[0].data
                .reduce((a, b) => a + b, 0)
                .toLocaleString()}
            </p>
            <div className="h-48 mt-4">
              <Line
                data={{
                  ...chartData,
                  datasets: [
                    {
                      ...chartData.datasets[0],
                      borderColor: "#10b981",
                      backgroundColor: "rgba(16, 185, 129, 0.1)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Card 2 - Total Clicks */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-800">Total Clicks</h3>
            <p className="text-3xl font-bold my-3 text-blue-600">
              {(chartData.datasets[0].data.length * 100).toLocaleString()}
            </p>
            <div className="h-48 mt-4">
              <Bar
                data={{
                  ...chartData,
                  datasets: [
                    {
                      ...chartData.datasets[0],
                      backgroundColor: "#60a5fa",
                      borderColor: "#3b82f6",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Card 3 - Average Conversions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-800">
              Average Conversions
            </h3>
            <p className="text-3xl font-bold my-3 text-purple-600">
              {Math.round(
                chartData.datasets[0].data.reduce((a, b) => a + b, 0) /
                  chartData.datasets[0].data.length
              ).toLocaleString()}
            </p>
            <div className="h-48 mt-4">
              <Line
                data={{
                  ...chartData,
                  datasets: [
                    {
                      ...chartData.datasets[0],
                      borderColor: "#9333ea",
                      backgroundColor: "rgba(147, 51, 234, 0.1)",
                      tension: 0.4,
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>

          {/* Card 4 - Performance Metrics */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <h3 className="text-lg font-semibold text-gray-800">
              Performance Metrics
            </h3>
            <p className="text-3xl font-bold my-3 text-orange-600">
              {chartData.datasets[0].data.length}
            </p>
            <div className="h-48 mt-4">
              <Bar
                data={{
                  ...chartData,
                  datasets: [
                    {
                      ...chartData.datasets[0],
                      backgroundColor: "#fb923c",
                      borderColor: "#f97316",
                    },
                  ],
                }}
                options={chartOptions}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;