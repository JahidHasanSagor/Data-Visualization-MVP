import React, { useState } from 'react';
import * as googleAnalyticsApi from '../../services/api/googleAnalytics';
import axios from 'axios';

const GoogleAnalyticsConnect = ({ connected, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  
  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Use the real authentication API
      await googleAnalyticsApi.authenticate();
      
      // Fetch properties after successful authentication
      const propertiesList = await googleAnalyticsApi.getProperties();
      setProperties(propertiesList);
      
      // Update connection status
      onStatusUpdate({ 
        connected: true, 
        last_sync: new Date().toISOString(),
        error: null
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error connecting to Google Analytics:', err);
      setError(err.message || 'Failed to connect to Google Analytics');
      setLoading(false);
    }
  };
  
  const handleDisconnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Make a real API call to disconnect
      const token = localStorage.getItem('authToken');
      await axios.post('http://localhost:5000/api/integrations/google/disconnect', {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update status
      onStatusUpdate({
        connected: false,
        last_sync: null,
        error: null
      });
      
      // Clear properties
      setProperties([]);
      setSelectedProperty('');
      setAnalyticsData(null);
      
      setLoading(false);
    } catch (err) {
      console.error('Error disconnecting from Google Analytics:', err);
      setError(err.message || 'Failed to disconnect');
      setLoading(false);
    }
  };
  
  const handlePropertyChange = (e) => {
    setSelectedProperty(e.target.value);
    // Clear previous data when property changes
    setAnalyticsData(null);
  };
  
  const fetchData = async () => {
    if (!selectedProperty) return;
    
    try {
      setDataLoading(true);
      setError(null);
      
      // Get dates for last 30 days
      const endDate = new Date().toISOString().split('T')[0];
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      
      // Fetch analytics data
      const data = await googleAnalyticsApi.getData(selectedProperty, startDate, endDate);
      setAnalyticsData(data);
      
      // Update last sync time
      onStatusUpdate({
        last_sync: new Date().toISOString()
      });
      
      setDataLoading(false);
    } catch (err) {
      console.error('Error fetching Google Analytics data:', err);
      setError(err.message || 'Failed to fetch analytics data');
      setDataLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all">
      <div className="flex items-center space-x-3 mb-4">
        <svg className="w-8 h-8 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" opacity="0.2" />
          <path d="M12.87 14.5H11.13v-9h1.74v9zm-5.04 0H6.09v-5.25h1.74v5.25zm10.08 0h-1.74v-3h1.74v3z" />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Google Analytics</h3>
      </div>
      
      <p className="text-gray-600 mb-6">
        Connect your Google Analytics account to visualize website traffic, user behavior, and conversion metrics.
      </p>
      
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
          <span className="font-medium">Error:</span> {error}
        </div>
      )}
      
      {connected ? (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-green-700 text-sm mb-4">
            <span className="font-medium">Connected!</span> Your Google Analytics account is linked successfully.
          </div>
          
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Select Analytics Property
            </label>
            <select
              value={selectedProperty}
              onChange={handlePropertyChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="">Select a property</option>
              {properties.map((property) => (
                <option key={property.property_id} value={property.property_id}>
                  {property.display_name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handleDisconnect}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              {loading ? 'Disconnecting...' : 'Disconnect'}
            </button>
            
            <button
              onClick={fetchData}
              disabled={!selectedProperty || loading || dataLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {dataLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Loading...
                </>
              ) : 'Fetch Data'}
            </button>
          </div>
          
          {analyticsData && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Analytics Data (Last 30 Days)</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {analyticsData.dimensions && analyticsData.dimensions.map((dim) => (
                        <th key={dim} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {dim}
                        </th>
                      ))}
                      {analyticsData.metrics && analyticsData.metrics.map((metric) => (
                        <th key={metric} className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {metric}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {analyticsData.rows && analyticsData.rows.map((row, index) => (
                      <tr key={index}>
                        {analyticsData.dimensions.map((dim) => (
                          <td key={dim} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {row[dim]}
                          </td>
                        ))}
                        {analyticsData.metrics.map((metric) => (
                          <td key={metric} className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                            {row[metric]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={handleConnect}
          disabled={loading}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Connecting...
            </>
          ) : (
            <>Connect Google Analytics</>
          )}
        </button>
      )}
    </div>
  );
};

export default GoogleAnalyticsConnect; 