import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios';

const ApiSettings = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [testingApi, setTestingApi] = useState('');
  
  // API credentials state
  const [credentials, setCredentials] = useState({
    googleAnalytics: {
      clientId: '',
      clientSecret: '',
      redirectUri: window.location.origin + '/auth/google/callback'
    },
    metaAds: {
      appId: '',
      appSecret: '',
      redirectUri: window.location.origin + '/auth/meta/callback'
    }
  });
  
  // Integration status state
  const [integrationStatus, setIntegrationStatus] = useState({
    googleAnalytics: false,
    metaAds: false
  });
  
  // Fetch current API settings on component mount
  useEffect(() => {
    const fetchApiSettings = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('authToken');
        
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }
        
        const response = await axios.get('http://localhost:5000/api/integrations/settings', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.data) {
          // Update credentials with existing values
          setCredentials({
            googleAnalytics: {
              clientId: response.data.googleAnalytics?.clientId || '',
              clientSecret: response.data.googleAnalytics?.clientSecret || '',
              redirectUri: window.location.origin + '/auth/google/callback'
            },
            metaAds: {
              appId: response.data.metaAds?.appId || '',
              appSecret: response.data.metaAds?.appSecret || '',
              redirectUri: window.location.origin + '/auth/meta/callback'
            }
          });
          
          // Update integration status
          setIntegrationStatus({
            googleAnalytics: response.data.googleAnalytics?.connected || false,
            metaAds: response.data.metaAds?.connected || false
          });
        }
      } catch (err) {
        console.error('Error fetching API settings:', err);
        setError('Failed to load API settings. Using default values.');
        // Continue with empty form fields
      } finally {
        setLoading(false);
      }
    };
    
    fetchApiSettings();
  }, []);
  
  // Handle input changes
  const handleInputChange = (integration, field, value) => {
    setCredentials(prev => ({
      ...prev,
      [integration]: {
        ...prev[integration],
        [field]: value
      }
    }));
  };
  
  // Save API settings
  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication required');
        setLoading(false);
        return;
      }
      
      const response = await axios.post('http://localhost:5000/api/integrations/settings', credentials, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.status === 200) {
        setSuccess('API settings saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error('Error saving API settings:', err);
      setError('Failed to save API settings. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Test API connection
  const testApiConnection = async (integration) => {
    try {
      setTestingApi(integration);
      setError('');
      
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        setError('Authentication required');
        setTestingApi('');
        return;
      }
      
      const response = await axios.post(
        `http://localhost:5000/api/integrations/${integration}/test`,
        { credentials: credentials[integration] },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.status === 200) {
        setSuccess(`${integration === 'googleAnalytics' ? 'Google Analytics' : 'Meta Ads'} connection successful!`);
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      console.error(`Error testing ${integration} connection:`, err);
      setError(`Failed to connect to ${integration === 'googleAnalytics' ? 'Google Analytics' : 'Meta Ads'}. Please check your credentials.`);
    } finally {
      setTestingApi('');
    }
  };
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-center">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-6 text-center">
          {success}
        </div>
      )}
      
      {/* Google Analytics Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-[#111827]">Google Analytics</h3>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${integrationStatus.googleAnalytics ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span className="text-sm text-gray-600">{integrationStatus.googleAnalytics ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
            <input
              type="text"
              value={credentials.googleAnalytics.clientId}
              onChange={(e) => handleInputChange('googleAnalytics', 'clientId', e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
              placeholder="Enter your Google Analytics Client ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
            <input
              type="password"
              value={credentials.googleAnalytics.clientSecret}
              onChange={(e) => handleInputChange('googleAnalytics', 'clientSecret', e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
              placeholder="Enter your Google Analytics Client Secret"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
            <input
              type="text"
              value={credentials.googleAnalytics.redirectUri}
              disabled
              className="w-full px-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-md text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">This URL needs to be added to your Google API Console.</p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => testApiConnection('googleAnalytics')}
              disabled={testingApi === 'googleAnalytics' || !credentials.googleAnalytics.clientId || !credentials.googleAnalytics.clientSecret}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                testingApi === 'googleAnalytics' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#9747FF] to-[#E93D82] hover:opacity-90'
              }`}
            >
              {testingApi === 'googleAnalytics' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Meta Ads Settings */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E5E7EB]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-[#111827]">Meta Ads</h3>
          <div className="flex items-center">
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${integrationStatus.metaAds ? 'bg-green-500' : 'bg-gray-300'}`}></span>
            <span className="text-sm text-gray-600">{integrationStatus.metaAds ? 'Connected' : 'Not Connected'}</span>
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">App ID</label>
            <input
              type="text"
              value={credentials.metaAds.appId}
              onChange={(e) => handleInputChange('metaAds', 'appId', e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
              placeholder="Enter your Meta Ads App ID"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">App Secret</label>
            <input
              type="password"
              value={credentials.metaAds.appSecret}
              onChange={(e) => handleInputChange('metaAds', 'appSecret', e.target.value)}
              className="w-full px-3 py-2 border border-[#E5E7EB] rounded-md focus:outline-none focus:ring-2 focus:ring-[#9747FF]"
              placeholder="Enter your Meta Ads App Secret"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Redirect URI</label>
            <input
              type="text"
              value={credentials.metaAds.redirectUri}
              disabled
              className="w-full px-3 py-2 bg-gray-50 border border-[#E5E7EB] rounded-md text-gray-500"
            />
            <p className="mt-1 text-xs text-gray-500">This URL needs to be added to your Meta Developer Console.</p>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={() => testApiConnection('metaAds')}
              disabled={testingApi === 'metaAds' || !credentials.metaAds.appId || !credentials.metaAds.appSecret}
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                testingApi === 'metaAds' 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#9747FF] to-[#E93D82] hover:opacity-90'
              }`}
            >
              {testingApi === 'metaAds' ? 'Testing...' : 'Test Connection'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`px-6 py-2 text-sm font-medium text-white rounded-md ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-[#9747FF] to-[#E93D82] hover:opacity-90'
          }`}
        >
          {loading ? 'Saving...' : 'Save API Settings'}
        </button>
      </div>
    </div>
  );
};

export default ApiSettings; 