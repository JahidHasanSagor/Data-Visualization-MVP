import React, { useState, useEffect, useMemo } from "react";
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
import { Bar, Line, Pie } from 'react-chartjs-2';
import ExportButton from './ExportButton';
import ExportDropdown from './ExportDropdown';
import AdvancedFilter from './AdvancedFilter';
import { useAuth } from '../contexts/AuthContext';
import { useApi } from '../contexts/ApiContext';
import { useUI } from '../contexts/UIContext';
import { dashboardService } from '../services/api.service';
import ChartSkeleton from './ui/ChartSkeleton';
import Skeleton from './ui/Skeleton';

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

const EmptyChart = ({ type, title }) => {
  const emptyData = {
    labels: ['No Data'],
    datasets: [{
      data: [0],
      backgroundColor: 'rgba(200, 200, 200, 0.2)',
      borderColor: 'rgba(200, 200, 200, 1)',
      borderWidth: 1
    }]
  };

  const emptyOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    scales: {
      y: { display: false },
      x: { display: false }
    }
  };

  const ChartComponent = type === 'line' ? Line : type === 'bar' ? Bar : Pie;
  
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <p className="text-gray-400 mb-2">{title}</p>
      <div className="w-full h-64 opacity-30">
        <ChartComponent data={emptyData} options={emptyOptions} />
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, children, onExport, isLoading }) => (
  <div className="bg-white rounded-lg p-6 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        {isLoading ? (
          <div className="h-9 w-32 bg-gray-200 animate-pulse rounded mt-1"></div>
        ) : (
          <p className="text-3xl font-bold mt-1">{value || '0'}</p>
        )}
      </div>
      <button
        onClick={onExport}
        className="text-gray-600 hover:text-gray-800 flex items-center text-sm"
        disabled={isLoading}
      >
        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export PNG
      </button>
    </div>
    {children}
  </div>
);

const NoDataState = () => (
  <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
    <p className="text-gray-500 text-center mb-4">Upload your marketing data file to visualize insights</p>
    <a href="/upload" className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
      </svg>
      Upload Data
    </a>
  </div>
);

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    revenue: null,
    clicks: null,
    conversions: null,
    performance: null,
    categories: null
  });
  const [uploadedData, setUploadedData] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [dateRange, setDateRange] = useState({ startDate: null, endDate: null });
  const { currentUser } = useAuth();
  const { integrations, fetchIntegrationData } = useApi();
  const { showError, showSuccess, setLoading, isLoading } = useUI();
  
  // Loading states
  const isLoadingData = isLoading('dashboard-data');
  const isLoadingIntegrations = isLoading('integrations');
  
  // Fetch uploaded data on component mount
  useEffect(() => {
    const fetchUploadedData = async () => {
      setLoading('dashboard-data', true);
      
      try {
        const response = await dashboardService.getData();
        
        if (response.success) {
          setUploadedData(response.data.uploadedData || []);
          if (response.data.uploadedData && response.data.uploadedData.length > 0) {
            updateChartData(response.data.uploadedData);
          }
        } else {
          showError(response.error || 'Failed to fetch dashboard data');
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        showError('Failed to fetch dashboard data');
      } finally {
        setLoading('dashboard-data', false);
      }
    };
    
    if (currentUser) {
      fetchUploadedData();
    }
  }, [currentUser, setLoading, showError]);
  
  // Fetch integration data when user is logged in
  useEffect(() => {
    const fetchIntegrations = async () => {
      setLoading('integrations', true);
      
      try {
        if (integrations.google.connected) {
          await fetchIntegrationData('google');
        }
        
        if (integrations.meta.connected) {
          await fetchIntegrationData('meta');
        }
      } catch (error) {
        console.error('Error fetching integration data:', error);
        showError('Failed to fetch integration data');
      } finally {
        setLoading('integrations', false);
      }
    };
    
    if (currentUser) {
      fetchIntegrations();
    }
  }, [currentUser, integrations.google.connected, integrations.meta.connected, fetchIntegrationData, setLoading, showError]);
  
  // Process uploaded data when it changes
  useEffect(() => {
    if (uploadedData && uploadedData.length > 0) {
      let processedData = uploadedData;

      // Filter by date range if available
      if (dateRange.startDate && dateRange.endDate) {
        processedData = processedData.filter(item => {
          const itemDate = new Date(item.date);
          return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
        });
      }

      setFilteredData(processedData);
      updateChartData(processedData);
    }
  }, [uploadedData, dateRange]);

  // Calculate totals and averages
  const calculateMetrics = (data) => {
    if (!data || data.length === 0) return {};
    
    const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
    const totalClicks = data.reduce((sum, item) => sum + item.clicks, 0);
    const avgConversions = Math.round(data.reduce((sum, item) => sum + item.conversions, 0) / data.length);
    const avgPerformance = Math.round(data.reduce((sum, item) => sum + item.performance, 0) / data.length);
    
    return {
      totalRevenue: new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalRevenue),
      totalClicks: new Intl.NumberFormat('en-US').format(totalClicks),
      avgConversions: new Intl.NumberFormat('en-US').format(avgConversions),
      avgPerformance: new Intl.NumberFormat('en-US').format(avgPerformance)
    };
  };

  // Update chart data based on filtered data
  const updateChartData = (data) => {
    if (!data || data.length === 0) {
      setChartData({
        revenue: null,
        clicks: null,
        conversions: null,
        performance: null,
        categories: null
      });
      return;
    }

    try {
      // Revenue Data - Line Chart (Green)
      const revenueData = {
        labels: data.map(item => item.date),
        datasets: [{
          label: 'Total Revenue',
          data: data.map(item => item.revenue),
          backgroundColor: 'rgba(46, 204, 113, 0.1)',
          borderColor: 'rgba(46, 204, 113, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(46, 204, 113, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.4,
          fill: true
        }]
      };

      // Clicks Data - Bar Chart (Blue)
      const clicksData = {
        labels: data.map(item => item.date),
        datasets: [{
          label: 'Total Clicks',
          data: data.map(item => item.clicks),
          backgroundColor: 'rgba(52, 152, 219, 0.6)',
          borderColor: 'rgba(52, 152, 219, 1)',
          borderWidth: 0
        }]
      };

      // Conversions Data - Line Chart (Purple)
      const conversionsData = {
        labels: data.map(item => item.date),
        datasets: [{
          label: 'Average Conversions',
          data: data.map(item => item.conversions),
          backgroundColor: 'rgba(155, 89, 182, 0.1)',
          borderColor: 'rgba(155, 89, 182, 1)',
          borderWidth: 2,
          pointBackgroundColor: 'rgba(155, 89, 182, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          tension: 0.4,
          fill: true
        }]
      };

      // Performance Data - Bar Chart (Orange)
      const performanceData = {
        labels: data.map(item => item.date),
        datasets: [{
          label: 'Performance Metrics',
          data: data.map(item => item.performance),
          backgroundColor: 'rgba(243, 156, 18, 0.6)',
          borderColor: 'rgba(243, 156, 18, 1)',
          borderWidth: 0
        }]
      };

      // Categories Data - Pie Chart
      const categories = [...new Set(data.map(item => item.category))];
      const categoryData = {
        labels: categories,
        datasets: [{
          data: categories.map(cat => 
            data.filter(item => item.category === cat).length
          ),
          backgroundColor: [
            'rgba(46, 204, 113, 0.8)',
            'rgba(52, 152, 219, 0.8)',
            'rgba(155, 89, 182, 0.8)',
            'rgba(243, 156, 18, 0.8)',
            'rgba(231, 76, 60, 0.8)',
          ],
          borderWidth: 0
        }]
      };

      setChartData({
        revenue: revenueData,
        clicks: clicksData,
        conversions: conversionsData,
        performance: performanceData,
        categories: categoryData
      });
    } catch (error) {
      console.error('Error updating chart data:', error);
      showError('Failed to update chart data');
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilteredData) => {
    setFilteredData(newFilteredData);
    updateChartData(newFilteredData);
  };

  // Handle date range changes
  const handleDateRangeChange = (newDateRange) => {
    setDateRange(newDateRange);
  };

  // Render integration charts if available
  const renderIntegrationCharts = () => {
    if (isLoadingIntegrations) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <ChartSkeleton />
          <ChartSkeleton />
        </div>
      );
    }

    const googleData = integrations.google.data;
    const metaData = integrations.meta.data;

    return (
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Integration Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {googleData && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3">Google Analytics</h3>
              {googleData.pageViews && (
                <div className="h-64">
                  <Line
                    data={{
                      labels: googleData.pageViews.dates,
                      datasets: [
                        {
                          label: 'Page Views',
                          data: googleData.pageViews.values,
                          borderColor: 'rgba(54, 162, 235, 1)',
                          backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {metaData && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-3">Meta Ads</h3>
              {metaData.adPerformance && (
                <div className="h-64">
                  <Bar
                    data={{
                      labels: metaData.adPerformance.campaigns,
                      datasets: [
                        {
                          label: 'Clicks',
                          data: metaData.adPerformance.clicks,
                          backgroundColor: 'rgba(255, 99, 132, 0.6)',
                        },
                        {
                          label: 'Impressions',
                          data: metaData.adPerformance.impressions,
                          backgroundColor: 'rgba(54, 162, 235, 0.6)',
                        },
                      ],
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                    }}
                  />
                </div>
              )}
            </div>
          )}

          {!googleData && !metaData && (
            <div className="col-span-2 bg-blue-50 p-6 rounded-lg border border-blue-200">
              <p className="text-blue-700 text-center">
                No integration data available. Connect your accounts in the Integrations page.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const chartOptions = {
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
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
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
          padding: 8,
          maxTicksLimit: 5
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 11
          },
          padding: 8,
          maxTicksLimit: 7
        }
      }
    }
  };

  const pieOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: true,
        position: 'right',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            size: 11
          }
        }
      }
    }
  };

  const metrics = calculateMetrics(filteredData);

  // Render chart with fallback
  const renderChart = (chartData, type, title) => {
    if (isLoadingData) {
      return <div className="h-64 bg-gray-100 animate-pulse rounded"></div>;
    }

    if (!chartData || !chartData.labels || !chartData.datasets) {
      return <EmptyChart type={type} title={`No ${title} data available`} />;
    }

    const ChartComponent = type === 'line' ? Line : type === 'bar' ? Bar : Pie;
    const options = type === 'pie' ? pieOptions : chartOptions;

    return (
      <div className="h-64">
        <ChartComponent data={chartData} options={options} />
      </div>
    );
  };

  // Check if we have any data to display
  const hasData = useMemo(() => {
    return uploadedData && uploadedData.length > 0;
  }, [uploadedData]);

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Analytics Dashboard</h1>
        {hasData && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Last updated: {new Date().toLocaleDateString()}</span>
            <ExportDropdown chartData={chartData} />
          </div>
        )}
      </div>

      {!hasData ? (
        <NoDataState />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Search in data..."
                      disabled={isLoadingData}
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select 
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
                    disabled={isLoadingData}
                  >
                    <option>All Categories</option>
                    {chartData?.categories?.labels?.map(cat => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricCard
              title="Total Revenue"
              value={metrics.totalRevenue}
              onExport={() => {/* Add export logic */}}
              isLoading={isLoadingData}
            >
              {renderChart(chartData.revenue, 'line', 'revenue')}
            </MetricCard>

            <MetricCard
              title="Total Clicks"
              value={metrics.totalClicks}
              onExport={() => {/* Add export logic */}}
              isLoading={isLoadingData}
            >
              {renderChart(chartData.clicks, 'bar', 'clicks')}
            </MetricCard>

            <MetricCard
              title="Average Conversions"
              value={metrics.avgConversions}
              onExport={() => {/* Add export logic */}}
              isLoading={isLoadingData}
            >
              {renderChart(chartData.conversions, 'line', 'conversions')}
            </MetricCard>

            <MetricCard
              title="Performance Metrics"
              value={metrics.avgPerformance}
              onExport={() => {/* Add export logic */}}
              isLoading={isLoadingData}
            >
              {renderChart(chartData.performance, 'bar', 'performance')}
            </MetricCard>

            <MetricCard
              title="Category Distribution"
              value="Categories"
              onExport={() => {/* Add export logic */}}
              isLoading={isLoadingData}
            >
              {renderChart(chartData.categories, 'pie', 'categories')}
            </MetricCard>
          </div>

          {currentUser && renderIntegrationCharts()}
        </>
      )}
    </div>
  );
};

export default Dashboard;