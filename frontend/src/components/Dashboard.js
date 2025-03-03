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
  ArcElement,
} from 'chart.js';
import { Bar, Line, Pie, Scatter } from 'react-chartjs-2';
import ExportButton from './ExportButton';
import ExportDropdown from './ExportDropdown';
import AdvancedFilter from './AdvancedFilter';
import { useAuth } from '../contexts/AuthContext';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ uploadedData, dateRange }) => {
  const [chartData, setChartData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const auth = useAuth();
  const currentUser = auth?.currentUser; // Safe access

  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      let processedData = uploadedData;

      // Filter by date range if available
      if (dateRange?.[0] && dateRange?.[1]) {
        processedData = uploadedData.filter((item) => {
          const itemDate = new Date(item.date);
          return itemDate >= dateRange[0] && itemDate <= dateRange[1];
        });
      }

      setFilteredData(processedData);
      updateChartData(processedData);
    }
  }, [uploadedData, dateRange]);

  const updateChartData = (data) => {
    const dataKeys = Object.keys(data[0] || {});
    const labels = data.map((item) => item[dataKeys[0]] || "Unknown");
    const values = data.map((item) => parseFloat(item[dataKeys[1]]) || 0);

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
  };

  const handleFilterChange = (newFilteredData) => {
    setFilteredData(newFilteredData);
    updateChartData(newFilteredData);
  };

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
        <div className="flex items-center space-x-4">
          {/* Only show export if user is logged in */}
          {currentUser && <ExportDropdown data={filteredData} fileName="dashboard-data" />}
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>
      </header>

      {/* Advanced Filter */}
      <AdvancedFilter data={uploadedData} onFilterChange={handleFilterChange} />

      {chartData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {/* Card 1 - Total Revenue */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
              <ExportButton elementId="revenue-chart" fileName="revenue" />
            </div>
            <p className="text-3xl font-bold my-3 text-emerald-600">
              ${chartData.datasets[0].data
                .reduce((a, b) => a + b, 0)
                .toLocaleString()}
            </p>
            <div className="h-48 mt-4" id="revenue-chart">
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Total Clicks</h3>
              <ExportButton elementId="clicks-chart" fileName="clicks" />
            </div>
            <p className="text-3xl font-bold my-3 text-blue-600">
              {(chartData.datasets[0].data.length * 100).toLocaleString()}
            </p>
            <div className="h-48 mt-4" id="clicks-chart">
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Average Conversions</h3>
              <ExportButton elementId="conversions-chart" fileName="conversions" />
            </div>
            <p className="text-3xl font-bold my-3 text-purple-600">
              {Math.round(
                chartData.datasets[0].data.reduce((a, b) => a + b, 0) /
                  chartData.datasets[0].data.length
              ).toLocaleString()}
            </p>
            <div className="h-48 mt-4" id="conversions-chart">
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
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
              <ExportButton elementId="performance-chart" fileName="performance" />
            </div>
            <p className="text-3xl font-bold my-3 text-orange-600">
              {chartData.datasets[0].data.length}
            </p>
            <div className="h-48 mt-4" id="performance-chart">
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

          {/* Card 5 - Category Distribution (Pie Chart) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
              <ExportButton elementId="category-chart" fileName="categories" />
            </div>
            <div className="h-48 mt-4" id="category-chart">
              <Pie
                data={{
                  labels: chartData.labels.slice(0, 5),
                  datasets: [
                    {
                      data: chartData.datasets[0].data.slice(0, 5),
                      backgroundColor: [
                        '#10b981', '#3b82f6', '#9333ea', '#f97316', '#ef4444'
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { 
                      position: 'right',
                      labels: { color: '#64748b' }
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;