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
import axios from "axios";

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
  const [integrationData, setIntegrationData] = useState({
    googleAnalytics: null,
    metaAds: null
  });
  const [loadingIntegrations, setLoadingIntegrations] = useState(false);
  const [integrationError, setIntegrationError] = useState(null);

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

  // Fetch integration data
  useEffect(() => {
    const fetchIntegrationData = async () => {
      try {
        setLoadingIntegrations(true);
        setIntegrationError(null);
        
        // For demo purposes, use dummy data
        // In a real app, you'd fetch from the API
        
        // Simulate API response
        setTimeout(() => {
          // Google Analytics dummy data
          const gaData = {
            chart_data: {
              labels: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6', 'Jan 7'],
              datasets: [
                {
                  label: 'Active Users',
                  data: [120, 135, 142, 128, 145, 160, 155],
                  borderColor: 'rgba(75, 192, 192, 1)',
                  backgroundColor: 'rgba(75, 192, 192, 0.2)',
                  borderWidth: 2,
                  tension: 0.4
                },
                {
                  label: 'Page Views',
                  data: [450, 520, 510, 480, 530, 580, 560],
                  borderColor: 'rgba(54, 162, 235, 1)',
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderWidth: 2,
                  tension: 0.4
                }
              ]
            }
          };
          
          // Meta Ads dummy data
          const metaData = {
            data: [
              {
                campaign_name: 'Summer Sale',
                impressions: '12500',
                clicks: '450',
                spend: '350.25',
                ctr: '0.036',
                cpc: '0.78'
              },
              {
                campaign_name: 'Product Launch',
                impressions: '18200',
                clicks: '620',
                spend: '520.75',
                ctr: '0.034',
                cpc: '0.84'
              },
              {
                campaign_name: 'Brand Awareness',
                impressions: '25600',
                clicks: '380',
                spend: '420.50',
                ctr: '0.015',
                cpc: '1.11'
              }
            ]
          };
          
          setIntegrationData({
            googleAnalytics: gaData,
            metaAds: metaData
          });
          
          setLoadingIntegrations(false);
        }, 1500);
      } catch (err) {
        console.error('Error fetching integration data:', err);
        setIntegrationError('Failed to load integration data');
        setLoadingIntegrations(false);
      }
    };

    // Only fetch if we have a date range
    if (dateRange?.[0] && dateRange?.[1]) {
      fetchIntegrationData();
    }
  }, [dateRange]);

  const updateChartData = (data) => {
    // Check if data exists and has the expected format
    if (!data || !data.length || !data[0]) {
      console.error("Invalid data format for charts");
      return;
    }

    // Use standardized column names from backend
    const labels = data.map((item) => item.label || "Unknown");
    const values = data.map((item) => parseFloat(item.value) || 0);

    // Create chart data
    setChartData({
      labels: labels,
      datasets: [
        {
          label: "Value",
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

  // Add this section to the return statement, after the existing cards
  const renderIntegrationCharts = () => {
    if (!integrationData.googleAnalytics && !integrationData.metaAds) {
      return null;
    }
    
    return (
      <>
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">Integration Data</h2>
        
        {/* Google Analytics Card */}
        {integrationData.googleAnalytics && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all mb-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.87 14.5H11.13v-9h1.74v9zm-5.04 0H6.09v-5.25h1.74v5.25zm10.08 0h-1.74v-3h1.74v3z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Google Analytics</h3>
              </div>
              <ExportButton elementId="ga-chart" fileName="google-analytics" />
            </div>
            
            <div className="h-64 mt-4" id="ga-chart">
              <Line
                data={integrationData.googleAnalytics.chart_data}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { position: 'top' },
                  },
                  scales: {
                    x: {
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                      ticks: { color: "#94a3b8" },
                    },
                    y: {
                      grid: { color: "rgba(255, 255, 255, 0.1)" },
                      ticks: { color: "#94a3b8" },
                    },
                  },
                }}
              />
            </div>
          </div>
        )}
        
        {/* Meta Ads Card */}
        {integrationData.metaAds && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.5 8.25h-3v-2.25c0-0.825 0.675-1.5 1.5-1.5h1.5v-3h-1.5c-2.475 0-4.5 2.025-4.5 4.5v2.25h-3v3h3v7.5h3v-7.5h3v-3z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-800">Meta Ads Performance</h3>
              </div>
              <ExportButton elementId="meta-table" fileName="meta-ads" />
            </div>
            
            <div className="overflow-x-auto" id="meta-table">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Clicks</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Spend</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CPC</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {integrationData.metaAds.data.map((campaign, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.campaign_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseInt(campaign.impressions).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{parseInt(campaign.clicks).toLocaleString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(campaign.spend).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{(parseFloat(campaign.ctr) * 100).toFixed(2)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${parseFloat(campaign.cpc).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    );
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

      {/* Integration Charts */}
      {renderIntegrationCharts()}
    </div>
  );
};

export default Dashboard;