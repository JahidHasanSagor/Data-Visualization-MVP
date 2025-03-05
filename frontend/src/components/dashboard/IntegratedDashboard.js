import React, { useState, useEffect, useCallback } from 'react';
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
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

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

const IntegratedDashboard = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date() // Today
  });
  
  // Data states
  const [googleAnalyticsData, setGoogleAnalyticsData] = useState(null);
  const [metaAdsData, setMetaAdsData] = useState(null);
  const [combinedMetrics, setCombinedMetrics] = useState(null);
  const [usingDemoData, setUsingDemoData] = useState(false);
  
  // Selected properties/accounts
  const [selectedGAProperty, setSelectedGAProperty] = useState('123456789'); // Default to demo property
  const [selectedMetaAccount, setSelectedMetaAccount] = useState('123456789'); // Default to demo account
  
  // Additional state for date picker
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Demo data generation functions
  const getDemoGoogleAnalyticsData = () => {
    return {
      sessions: 12458,
      pageViews: 28764,
      avgSessionDuration: '2m 34s',
      bounceRate: 42.3,
      users: 8765,
      newUsers: 3421,
      timeOnPage: '1m 47s',
      topPages: [
        { page: '/home', views: 4532 },
        { page: '/products', views: 3298 },
        { page: '/about', views: 2187 }
      ],
      deviceBreakdown: {
        Desktop: 68,
        Mobile: 27,
        Tablet: 5
      }
    };
  };
  
  const getDemoMetaAdsData = () => {
    return {
      impressions: 87654,
      clicks: 3421,
      ctr: 3.9,
      cpc: 0.67,
      spend: 2291.87,
      conversions: 342,
      costPerConversion: 6.70,
      conversionRate: 10.0,
      campaigns: [
        { id: 1, name: 'Summer Sale', spend: 876.32, impressions: 32456, clicks: 1234 },
        { id: 2, name: 'Product Launch', spend: 765.21, impressions: 28765, clicks: 987 },
        { id: 3, name: 'Brand Awareness', spend: 650.34, impressions: 26433, clicks: 1200 }
      ]
    };
  };
  
  // Function to generate combined metrics from both data sources
  const generateCombinedMetrics = useCallback((gaData, metaData) => {
    // Calculate combined metrics
    const totalUsers = gaData.users || 0;
    const totalConversions = metaData.conversions || 0;
    const totalRevenue = metaData.spend * 2.5; // Demo calculation for revenue
    
    // Generate random trend percentages
    const usersTrend = Math.floor(Math.random() * 20) - 5; // -5 to +15
    const conversionsTrend = Math.floor(Math.random() * 25) - 10; // -10 to +15
    const revenueTrend = Math.floor(Math.random() * 30) - 10; // -10 to +20
    
    // Generate dates for the last 7 days
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    
    // Traffic chart data
    const trafficChart = {
      labels: ['Organic Search', 'Direct', 'Social', 'Referral', 'Email', 'Paid Search'],
      datasets: [
        {
          label: 'Google Analytics',
          data: [35, 25, 15, 10, 10, 5],
          backgroundColor: 'rgba(249, 171, 0, 0.6)',
        },
        {
          label: 'Meta Ads',
          data: [10, 15, 40, 15, 10, 10],
          backgroundColor: 'rgba(24, 119, 242, 0.6)',
        }
      ]
    };
    
    // Funnel chart data
    const funnelChart = {
      labels: dates,
      datasets: [
        {
          label: 'Impressions',
          data: [12500, 13200, 12800, 14500, 13800, 15200, 16000],
          borderColor: 'rgba(24, 119, 242, 0.8)',
          backgroundColor: 'rgba(24, 119, 242, 0.1)',
          tension: 0.4
        },
        {
          label: 'Clicks',
          data: [4200, 4500, 4100, 5200, 4900, 5500, 5800],
          borderColor: 'rgba(249, 171, 0, 0.8)',
          backgroundColor: 'rgba(249, 171, 0, 0.1)',
          tension: 0.4
        },
        {
          label: 'Conversions',
          data: [320, 350, 310, 420, 380, 450, 480],
          borderColor: 'rgba(151, 71, 255, 0.8)',
          backgroundColor: 'rgba(151, 71, 255, 0.1)',
          tension: 0.4
        }
      ]
    };
    
    return {
      totalUsers,
      totalConversions,
      totalRevenue,
      usersTrend,
      conversionsTrend,
      revenueTrend,
      trafficChart,
      funnelChart
    };
  }, []);
  
  // Helper function to load demo data
  const loadDemoData = useCallback(() => {
    console.log("Loading demo data");
    setUsingDemoData(true);
    
    // Set demo data for Google Analytics
    const gaData = getDemoGoogleAnalyticsData();
    setGoogleAnalyticsData(gaData);
    
    // Set demo data for Meta Ads
    const metaData = getDemoMetaAdsData();
    setMetaAdsData(metaData);
    
    // Generate combined metrics from demo data
    const combined = generateCombinedMetrics(gaData, metaData);
    setCombinedMetrics(combined);
    
    // Set a friendly error message
    setError("Using demo data. Connect your accounts in Settings → API Integrations for real data.");
  }, [generateCombinedMetrics]);
  
  // Define fetchData function outside useEffect to make it available for the refresh button
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setUsingDemoData(false);
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        console.log("No authentication token found, using demo data");
        loadDemoData();
        return;
      }
      
      // Check if we have integration status first
      const statusResponse = await axios.get('http://localhost:5000/api/integrations/status', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      const integrationStatus = statusResponse.data;
      
      if (!integrationStatus.google_analytics.connected || !integrationStatus.meta_ads.connected) {
        console.log("One or more integrations not connected, using demo data");
        loadDemoData();
        return;
      }
      
      // Fetch Google Analytics data
      const gaResponse = await axios.get(`http://localhost:5000/api/integrations/google-analytics/data`, {
        params: {
          property_id: selectedGAProperty,
          start_date: dateRange.startDate.toISOString().split('T')[0],
          end_date: dateRange.endDate.toISOString().split('T')[0]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Fetch Meta Ads data
      const metaResponse = await axios.get(`http://localhost:5000/api/integrations/meta-ads/data`, {
        params: {
          account_id: selectedMetaAccount,
          start_date: dateRange.startDate.toISOString().split('T')[0],
          end_date: dateRange.endDate.toISOString().split('T')[0]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Process and set data
      setGoogleAnalyticsData(gaResponse.data);
      setMetaAdsData(metaResponse.data);
      
      // Generate combined metrics
      const combined = generateCombinedMetrics(gaResponse.data, metaResponse.data);
      setCombinedMetrics(combined);
      
    } catch (err) {
      console.error("Error fetching integration data:", err);
      
      if (err.response) {
        console.log("Error response:", err.response.data);
        console.log("Status code:", err.response.status);
      }
      
      setError("Failed to fetch integration data. Using demo data instead.");
      loadDemoData();
    } finally {
      setLoading(false);
    }
  }, [dateRange, selectedGAProperty, selectedMetaAccount, loadDemoData, generateCombinedMetrics]);
  
  // Fetch data on component mount and when date range changes
  useEffect(() => {
    fetchData();
  }, [dateRange, selectedGAProperty, selectedMetaAccount, fetchData]);
  
  // Handle property/account selection
  const handleGAPropertyChange = (e) => {
    setSelectedGAProperty(e.target.value);
  };
  
  const handleMetaAccountChange = (e) => {
    setSelectedMetaAccount(e.target.value);
  };
  
  // Handle date range change
  const handleDateRangeChange = (range) => {
    setDateRange(range);
  };
  
  // Render loading state
  if (loading && !usingDemoData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#9747FF]"></div>
      </div>
    );
  }
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#111827]">Integrated Analytics Dashboard</h1>
        
        <div className="flex space-x-4">
          {/* Date Range Selector */}
          <div className="relative">
            <button 
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-[#E5E7EB] rounded-md hover:bg-gray-50"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>
                {dateRange.startDate.toLocaleDateString()} - {dateRange.endDate.toLocaleDateString()}
              </span>
              <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showDatePicker && (
              <div className="absolute right-0 mt-2 bg-white border border-[#E5E7EB] rounded-md shadow-lg z-10">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                      <input 
                        type="date" 
                        value={dateRange.startDate.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange({
                          startDate: new Date(e.target.value),
                          endDate: dateRange.endDate
                        })}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                      <input 
                        type="date"
                        value={dateRange.endDate.toISOString().split('T')[0]}
                        onChange={(e) => handleDateRangeChange({
                          startDate: dateRange.startDate,
                          endDate: new Date(e.target.value)
                        })}
                        className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => setShowDatePicker(false)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#9747FF] to-[#E93D82] rounded-md hover:opacity-90"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#9747FF] to-[#E93D82] rounded-md hover:opacity-90 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Refresh Data</span>
          </button>
        </div>
      </div>
      
      {/* Demo Data Notice */}
      {usingDemoData && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">You are viewing demo data</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  To view your actual data, please ensure you are logged in and have connected your Google Analytics and Meta Ads accounts in the Settings page.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Error Message */}
      {error && !usingDemoData && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Account Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Analytics Property Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.87 14.5H11.13v-9h1.74v9zm-5.04 0H6.09v-5.25h1.74v5.25zm10.08 0h-1.74v-3h1.74v3z" />
            </svg>
            <h2 className="text-lg font-medium text-[#111827]">Google Analytics</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Property</label>
            <select
              value={selectedGAProperty}
              onChange={handleGAPropertyChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
            >
              <option value="123456789">Demo Property</option>
              <option value="987654321">My Website</option>
              <option value="456789123">Mobile App</option>
            </select>
          </div>
        </div>
        
        {/* Meta Ads Account Selector */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-4">
            <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 8.25h-3v-2.25c0-0.825 0.675-1.5 1.5-1.5h1.5v-3h-1.5c-2.475 0-4.5 2.025-4.5 4.5v2.25h-3v3h3v7.5h3v-7.5h3v-3z" />
            </svg>
            <h2 className="text-lg font-medium text-[#111827]">Meta Ads</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Ad Account</label>
            <select
              value={selectedMetaAccount}
              onChange={handleMetaAccountChange}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
            >
              <option value="123456789">Demo Account</option>
              <option value="987654321">Business Page</option>
              <option value="456789123">E-commerce Store</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Combined Metrics */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
        <h2 className="text-xl font-semibold text-[#111827] mb-6">Combined Performance Metrics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-[#F9FAFB] p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Users</p>
            <p className="text-2xl font-bold text-[#111827]">
              {combinedMetrics?.totalUsers.toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${combinedMetrics?.usersTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {combinedMetrics?.usersTrend > 0 ? '+' : ''}{combinedMetrics?.usersTrend}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          </div>
          
          {/* Total Conversions */}
          <div className="bg-[#F9FAFB] p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Conversions</p>
            <p className="text-2xl font-bold text-[#111827]">
              {combinedMetrics?.totalConversions.toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${combinedMetrics?.conversionsTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {combinedMetrics?.conversionsTrend > 0 ? '+' : ''}{combinedMetrics?.conversionsTrend}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          </div>
          
          {/* Total Revenue */}
          <div className="bg-[#F9FAFB] p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-[#111827]">
              ${combinedMetrics?.totalRevenue.toLocaleString()}
            </p>
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${combinedMetrics?.revenueTrend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {combinedMetrics?.revenueTrend > 0 ? '+' : ''}{combinedMetrics?.revenueTrend}%
              </span>
              <span className="text-xs text-gray-500 ml-2">vs. previous period</span>
            </div>
          </div>
        </div>
        
        {/* Combined Traffic Chart */}
        <div className="mb-8">
          <h3 className="text-lg font-medium text-[#111827] mb-4">Traffic Sources</h3>
          <div className="h-80">
            {combinedMetrics?.trafficChart && (
              <Bar 
                data={combinedMetrics.trafficChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false
                    }
                  }
                }} 
              />
            )}
          </div>
        </div>
        
        {/* Conversion Funnel */}
        <div>
          <h3 className="text-lg font-medium text-[#111827] mb-4">Conversion Funnel</h3>
          <div className="h-80">
            {combinedMetrics?.funnelChart && (
              <Line 
                data={combinedMetrics.funnelChart} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'top',
                    },
                    title: {
                      display: false
                    }
                  }
                }} 
              />
            )}
          </div>
        </div>
      </div>
      
      {/* Platform Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Analytics Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-6">
            <svg className="w-6 h-6 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.87 14.5H11.13v-9h1.74v9zm-5.04 0H6.09v-5.25h1.74v5.25zm10.08 0h-1.74v-3h1.74v3z" />
            </svg>
            <h2 className="text-lg font-medium text-[#111827]">Google Analytics Metrics</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Sessions</span>
              <span className="text-sm font-bold text-[#111827]">{googleAnalyticsData?.sessions.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#F9AB00] h-2.5 rounded-full" style={{ width: '70%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Page Views</span>
              <span className="text-sm font-bold text-[#111827]">{googleAnalyticsData?.pageViews.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#F9AB00] h-2.5 rounded-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Avg. Session Duration</span>
              <span className="text-sm font-bold text-[#111827]">{googleAnalyticsData?.avgSessionDuration}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#F9AB00] h-2.5 rounded-full" style={{ width: '60%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Bounce Rate</span>
              <span className="text-sm font-bold text-[#111827]">{googleAnalyticsData?.bounceRate}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#F9AB00] h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
          </div>
        </div>
        
        {/* Meta Ads Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
          <div className="flex items-center space-x-3 mb-6">
            <svg className="w-6 h-6 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M16.5 8.25h-3v-2.25c0-0.825 0.675-1.5 1.5-1.5h1.5v-3h-1.5c-2.475 0-4.5 2.025-4.5 4.5v2.25h-3v3h3v7.5h3v-7.5h3v-3z" />
            </svg>
            <h2 className="text-lg font-medium text-[#111827]">Meta Ads Metrics</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Impressions</span>
              <span className="text-sm font-bold text-[#111827]">{metaAdsData?.impressions.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#1877F2] h-2.5 rounded-full" style={{ width: '80%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Clicks</span>
              <span className="text-sm font-bold text-[#111827]">{metaAdsData?.clicks.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#1877F2] h-2.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">CTR</span>
              <span className="text-sm font-bold text-[#111827]">{metaAdsData?.ctr}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#1877F2] h-2.5 rounded-full" style={{ width: '50%' }}></div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-500">Cost per Click</span>
              <span className="text-sm font-bold text-[#111827]">${metaAdsData?.cpc}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-[#1877F2] h-2.5 rounded-full" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedDashboard; 