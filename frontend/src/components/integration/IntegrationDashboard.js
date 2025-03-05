import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';
import GoogleAnalyticsConnect from './GoogleAnalyticsConnect';
import MetaConnect from './MetaConnect';
import IntegrationStatus from './IntegrationStatus';

const IntegrationDashboard = () => {
  const { currentUser } = useAuth();
  const [integrations, setIntegrations] = useState({
    google_analytics: {
      connected: false,
      last_sync: null,
      error: null
    },
    meta_ads: {
      connected: false,
      last_sync: null,
      error: null
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token on component mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    console.log('Initial token check:', token ? `Token exists (${token.substring(0, 10)}...)` : 'Token is missing');
    
    // Also check the user object
    const user = localStorage.getItem('user');
    console.log('User in localStorage:', user ? 'User exists' : 'User is missing');
    console.log('Current user from context:', currentUser ? `User exists (${currentUser.email})` : 'No current user');
  }, [currentUser]);

  // Fetch integration status
  useEffect(() => {
    const testBackendConnection = async () => {
      try {
        console.log('Testing backend connection...');
        const response = await axios.get('http://localhost:5000/api/test');
        console.log('Backend test successful:', response.data);
        return true;
      } catch (err) {
        console.error('Backend test failed:', err);
        return false;
      }
    };

    const fetchStatus = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Test backend connection first
        const isBackendConnected = await testBackendConnection();
        if (!isBackendConnected) {
          throw new Error('Cannot connect to backend server');
        }
        
        // Make a real API call to get integration status
        const token = localStorage.getItem('authToken');
        console.log('Auth token:', token ? 'Token exists' : 'Token is missing');
        
        console.log('Fetching integration status from:', 'http://localhost:5000/api/integrations/status');
        const response = await axios.get('http://localhost:5000/api/integrations/status', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Integration status response:', response.data);
        setIntegrations(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching integration status:', err);
        console.error('Error details:', err.response ? err.response.data : 'No response data');
        console.error('Error status:', err.response ? err.response.status : 'No status code');
        
        console.log('Using dummy data as fallback');
        // Use dummy data as fallback
        setIntegrations({
          google_analytics: {
            connected: true,
            last_sync: "2023-06-15T10:30:00Z",
            error: null
          },
          meta_ads: {
            connected: true,
            last_sync: "2023-06-14T15:45:00Z",
            error: null
          }
        });
        
        setError('Using demo data: Backend connection failed. Some features may be limited.');
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchStatus();
    }
  }, [currentUser]);

  // Handle integration connection status update
  const handleStatusUpdate = (integration, status) => {
    setIntegrations(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        ...status
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          <p>{error}</p>
          {error.includes('Backend connection failed') && (
            <p className="mt-2 text-sm">
              You're viewing demo data. To enable full functionality, please ensure the backend server is running.
            </p>
          )}
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 text-sm font-medium text-yellow-600 hover:text-yellow-800"
          >
            Try Again
          </button>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Integrations</h1>
            <p className="text-gray-600">
              Connect your external data sources to enhance your analytics dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Integration Status Cards */}
            <IntegrationStatus 
              title="Google Analytics"
              status={integrations.google_analytics}
              icon={
                <svg className="w-8 h-8 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" opacity="0.2" />
                  <path d="M12.87 14.5H11.13v-9h1.74v9zm-5.04 0H6.09v-5.25h1.74v5.25zm10.08 0h-1.74v-3h1.74v3z" />
                </svg>
              }
            />
            
            <IntegrationStatus 
              title="Meta Ads"
              status={integrations.meta_ads}
              icon={
                <svg className="w-8 h-8 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" opacity="0.2" />
                  <path d="M16.5 8.25h-3v-2.25c0-0.825 0.675-1.5 1.5-1.5h1.5v-3h-1.5c-2.475 0-4.5 2.025-4.5 4.5v2.25h-3v3h3v7.5h3v-7.5h3v-3z" />
                </svg>
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Google Analytics Connect */}
            <GoogleAnalyticsConnect 
              connected={integrations.google_analytics.connected}
              onStatusUpdate={(status) => handleStatusUpdate('google_analytics', status)}
            />
            
            {/* Meta Ads Connect */}
            <MetaConnect 
              connected={integrations.meta_ads.connected}
              onStatusUpdate={(status) => handleStatusUpdate('meta_ads', status)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Integrations</h1>
        <p className="text-gray-600">
          Connect your external data sources to enhance your analytics dashboard.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Integration Status Cards */}
        <IntegrationStatus 
          title="Google Analytics"
          status={integrations.google_analytics}
          icon={
            <svg className="w-8 h-8 text-[#F9AB00]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" opacity="0.2" />
              <path d="M12.87 14.5H11.13v-9h1.74v9zm-5.04 0H6.09v-5.25h1.74v5.25zm10.08 0h-1.74v-3h1.74v3z" />
            </svg>
          }
        />
        
        <IntegrationStatus 
          title="Meta Ads"
          status={integrations.meta_ads}
          icon={
            <svg className="w-8 h-8 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12z" opacity="0.2" />
              <path d="M16.5 8.25h-3v-2.25c0-0.825 0.675-1.5 1.5-1.5h1.5v-3h-1.5c-2.475 0-4.5 2.025-4.5 4.5v2.25h-3v3h3v7.5h3v-7.5h3v-3z" />
            </svg>
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Google Analytics Connect */}
        <GoogleAnalyticsConnect 
          connected={integrations.google_analytics.connected}
          onStatusUpdate={(status) => handleStatusUpdate('google_analytics', status)}
        />
        
        {/* Meta Ads Connect */}
        <MetaConnect 
          connected={integrations.meta_ads.connected}
          onStatusUpdate={(status) => handleStatusUpdate('meta_ads', status)}
        />
      </div>
    </div>
  );
};

export default IntegrationDashboard; 