import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useUI } from '../contexts/UIContext';
import { dashboardService } from '../services/api.service';
import Skeleton from './ui/Skeleton';

// Register Chart.js components
Chart.register(...registerables);

const Analytics = () => {
  const [marketingData, setMarketingData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const { setLoading, showError, isLoading } = useUI();
  const [metrics, setMetrics] = useState({
    revenue: { total: 0, data: [] },
    clicks: { total: 0, data: [] },
    conversions: { total: 0, data: [] },
    performance: { total: 0, data: [] }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading('analytics', true);
    try {
      const response = await dashboardService.getData();
      
      if (response.success && response.data && response.data.uploadedData) {
        const data = response.data.uploadedData;
        setMarketingData(data);
        processMarketingData(data);
      } else {
        showError('No data available');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      showError('Failed to fetch dashboard data');
    } finally {
      setLoading('analytics', false);
    }
  };

  const processMarketingData = (data) => {
    if (!data || data.length === 0) return;

    // Check if we have marketing data with Date, Revenue, Clicks, etc.
    const firstItem = data[0];
    
    if (firstItem.label && firstItem.value) {
      // Simple data format with label/value
      const labels = data.map(item => item.label);
      const values = data.map(item => parseFloat(item.value));
      
      setMetrics({
        revenue: { 
          total: values.reduce((sum, val) => sum + val, 0), 
          data: { labels, values } 
        },
        clicks: { 
          total: Math.round(values.reduce((sum, val) => sum + val, 0) / 2), 
          data: { labels, values: values.map(v => Math.round(v / 2)) } 
        },
        conversions: { 
          total: Math.round(values.reduce((sum, val) => sum + val, 0) / 10), 
          data: { labels, values: values.map(v => Math.round(v / 10)) } 
        },
        performance: { 
          total: Math.round(values.reduce((sum, val) => sum + val, 0) / 100), 
          data: { labels, values: values.map(v => Math.round(v / 100)) } 
        }
      });
    } else {
      // Try to extract columns from marketing data
      const dates = data.map(item => item.Date || item.date);
      const revenues = data.map(item => parseFloat(item.Revenue || item.revenue || 0));
      const clicks = data.map(item => parseInt(item.Clicks || item.clicks || 0));
      const conversions = data.map(item => parseInt(item.Conversions || item.conversions || 0));
      const costs = data.map(item => parseFloat(item.Cost || item.cost || 0));
      
      setMetrics({
        revenue: { 
          total: revenues.reduce((sum, val) => sum + val, 0), 
          data: { labels: dates, values: revenues } 
        },
        clicks: { 
          total: clicks.reduce((sum, val) => sum + val, 0), 
          data: { labels: dates, values: clicks } 
        },
        conversions: { 
          total: conversions.reduce((sum, val) => sum + val, 0), 
          data: { labels: dates, values: conversions } 
        },
        performance: { 
          total: costs.reduce((sum, val) => sum + val, 0), 
          data: { labels: dates, values: costs } 
        }
      });
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(Math.round(num));
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(Math.round(num));
  };

  // Common chart options
  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#333',
        bodyColor: '#333',
        borderColor: 'rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        padding: 10,
        cornerRadius: 4,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 11
          },
          padding: 8
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 10
          },
          maxRotation: 0,
          padding: 8
        }
      }
    }
  };

  // Revenue chart (green line chart)
  const renderRevenueChart = (data) => {
    if (!data || !data.labels || !data.values) return null;
    
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Revenue',
          data: data.values,
          borderColor: '#10B981', // green
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointBackgroundColor: '#10B981',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.4,
          fill: false
        }
      ]
    };
    
    return <Line data={chartData} options={commonOptions} height={200} />;
  };

  // Clicks chart (blue bar chart)
  const renderClicksChart = (data) => {
    if (!data || !data.labels || !data.values) return null;
    
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Clicks',
          data: data.values,
          backgroundColor: '#3B82F6', // blue
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 4,
          barThickness: 16,
          maxBarThickness: 20
        }
      ]
    };
    
    return <Bar data={chartData} options={commonOptions} height={200} />;
  };

  // Conversions chart (purple line chart)
  const renderConversionsChart = (data) => {
    if (!data || !data.labels || !data.values) return null;
    
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Conversions',
          data: data.values,
          borderColor: '#A855F7', // purple
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointBackgroundColor: '#A855F7',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.4,
          fill: false
        }
      ]
    };
    
    return <Line data={chartData} options={commonOptions} height={200} />;
  };

  // Performance chart (orange bar chart)
  const renderPerformanceChart = (data) => {
    if (!data || !data.labels || !data.values) return null;
    
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: 'Performance',
          data: data.values,
          backgroundColor: '#F97316', // orange
          borderColor: 'transparent',
          borderWidth: 0,
          borderRadius: 4,
          barThickness: 16,
          maxBarThickness: 20
        }
      ]
    };
    
    return <Bar data={chartData} options={commonOptions} height={200} />;
  };

  // Category Distribution (pie chart)
  const renderCategoryChart = (data) => {
    if (!data || !data.labels || !data.values) return null;
    
    // Take only first 5 items for the pie chart
    const labels = data.labels.slice(0, 5);
    const values = data.values.slice(0, 5);
    
    const chartData = {
      labels: labels,
      datasets: [
        {
          data: values,
          backgroundColor: [
            '#10B981', // green
            '#3B82F6', // blue
            '#A855F7', // purple
            '#F97316', // orange
            '#EF4444', // red
          ],
          borderWidth: 0
        }
      ]
    };
    
    const pieOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            boxWidth: 15,
            padding: 15,
            font: {
              size: 12
            }
          }
        }
      }
    };
    
    return <Pie data={chartData} options={pieOptions} height={300} />;
  };

  const isAnalyticsLoading = isLoading('analytics');

  return (
    <div className="p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <div className="flex items-center">
            <button className="flex items-center text-sm text-gray-600 hover:text-gray-900 mr-4">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export Data
            </button>
            <div className="text-sm text-gray-500">
              Last updated: 3/6/2025
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Search in data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option>All Categories</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Revenue Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Revenue</h2>
              <button className="text-gray-500 hover:text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PNG
              </button>
            </div>
            {isAnalyticsLoading ? (
              <div>
                <Skeleton type="title" className="mb-4" />
                <Skeleton height={200} className="mb-2" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-green-500 mb-4">{formatCurrency(metrics.revenue.total)}</h3>
                <div className="h-48">
                  {renderRevenueChart(metrics.revenue.data)}
                </div>
              </>
            )}
          </div>

          {/* Clicks Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Total Clicks</h2>
              <button className="text-gray-500 hover:text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PNG
              </button>
            </div>
            {isAnalyticsLoading ? (
              <div>
                <Skeleton type="title" className="mb-4" />
                <Skeleton height={200} className="mb-2" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-blue-500 mb-4">{formatNumber(metrics.clicks.total)}</h3>
                <div className="h-48">
                  {renderClicksChart(metrics.clicks.data)}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Conversions Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Average Conversions</h2>
              <button className="text-gray-500 hover:text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PNG
              </button>
            </div>
            {isAnalyticsLoading ? (
              <div>
                <Skeleton type="title" className="mb-4" />
                <Skeleton height={200} className="mb-2" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-purple-500 mb-4">{formatNumber(metrics.conversions.total)}</h3>
                <div className="h-48">
                  {renderConversionsChart(metrics.conversions.data)}
                </div>
              </>
            )}
          </div>

          {/* Performance Metrics Card */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Performance Metrics</h2>
              <button className="text-gray-500 hover:text-gray-700 flex items-center">
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export PNG
              </button>
            </div>
            {isAnalyticsLoading ? (
              <div>
                <Skeleton type="title" className="mb-4" />
                <Skeleton height={200} className="mb-2" />
              </div>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-orange-500 mb-4">{formatNumber(metrics.performance.total)}</h3>
                <div className="h-48">
                  {renderPerformanceChart(metrics.performance.data)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Category Distribution</h2>
            <button className="text-gray-500 hover:text-gray-700 flex items-center">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PNG
            </button>
          </div>
          {isAnalyticsLoading ? (
            <div>
              <Skeleton height={300} className="mb-2" />
            </div>
          ) : (
            <div className="h-72">
              {renderCategoryChart(metrics.revenue.data)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics; 